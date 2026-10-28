import { Filter, MongoServerError, ObjectId, WithId } from "mongodb";
import { getDb } from "./db";
import { dateRange, NewsError, newsInputSchema, newsUpdateSchema, slugify } from "./news-schema";
import type { NewsArticle, NewsFilters, NewsResult } from "./types";

type NewsDocument = Omit<NewsArticle, "id" | "publishedAt" | "createdAt" | "updatedAt"> & { publishedAt: Date; createdAt: Date; updatedAt: Date };
let indexPromise: Promise<unknown> | undefined;

async function collection() {
  const db = await getDb();
  const news = db.collection<NewsDocument>("news");
  if (!indexPromise) {
    indexPromise = news.createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { sourceUrl: 1 }, unique: true },
      { key: { publishedAt: -1, _id: -1 } },
      { key: { category: 1, publishedAt: -1 } },
    ]).catch((error: unknown) => { indexPromise = undefined; throw error; });
  }
  await indexPromise;
  return news;
}

function serialize(article: WithId<NewsDocument>): NewsArticle {
  const { _id, ...data } = article;
  return { ...data, id: _id.toHexString(), publishedAt: data.publishedAt.toISOString(), createdAt: data.createdAt.toISOString(), updatedAt: data.updatedAt.toISOString() };
}

function validId(id: string): ObjectId {
  if (!/^[a-f0-9]{24}$/i.test(id)) throw new NewsError("Identificador de noticia inválido", 400);
  return new ObjectId(id);
}

export function buildNewsFilter(filters: NewsFilters = {}): Filter<NewsDocument> {
  const filter: Filter<NewsDocument> = {};
  const search = filters.q?.trim();
  if (search) {
    if (search.length > 200) throw new NewsError("La búsqueda admite hasta 200 caracteres", 400);
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    filter.$or = ["title", "description", "content", "company", "category", "tags"].map((field) => ({ [field]: regex }));
  }
  if (filters.category && filters.category !== "Todas") filter.category = filters.category;
  if (filters.date) filter.publishedAt = dateRange(filters.date);
  return filter;
}

export async function getNews(filters: NewsFilters = {}): Promise<NewsResult> {
  const limit = Math.max(1, Math.min(50, Math.floor(Number(filters.limit) || 12)));
  const page = Math.max(1, Math.min(10000, Math.floor(Number(filters.page) || 1)));
  const query = buildNewsFilter(filters);
  const news = await collection();
  const [documents, total] = await Promise.all([
    news.find(query).sort({ publishedAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    news.countDocuments(query),
  ]);
  return { articles: documents.map(serialize), total, page, pages: Math.ceil(total / limit) };
}

export async function getArticle(slug: string): Promise<NewsArticle | null> {
  const news = await collection();
  const article = await news.findOne({ slug });
  return article ? serialize(article) : null;
}

export async function getArticleById(id: string): Promise<NewsArticle | null> {
  const news = await collection();
  const article = await news.findOne({ _id: validId(id) });
  return article ? serialize(article) : null;
}

export async function getCategories(): Promise<string[]> {
  const news = await collection();
  return (await news.distinct("category")).sort((a, b) => a.localeCompare(b, "es"));
}

export async function createArticle(input: unknown): Promise<NewsArticle> {
  const data = newsInputSchema.parse(input);
  const news = await collection();
  const _id = new ObjectId();
  const now = new Date();
  const doc: WithId<NewsDocument> = { ...data, _id, slug: `${slugify(data.title)}-${_id.toHexString().slice(-6)}`, publishedAt: new Date(data.publishedAt), createdAt: now, updatedAt: now };
  try {
    await news.insertOne(doc);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) throw new NewsError("Esta fuente ya fue publicada. Edita la noticia existente para actualizarla.", 409);
    throw error;
  }
  return serialize(doc);
}

export async function updateArticle(id: string, input: unknown): Promise<NewsArticle> {
  const patch = newsUpdateSchema.parse(input);
  if (!Object.keys(patch).length) throw new NewsError("No hay campos para actualizar", 400);
  const news = await collection();
  const _id = validId(id);
  const existing = await news.findOne({ _id });
  if (!existing) throw new NewsError("Noticia no encontrada", 404);
  const data = newsInputSchema.parse({ ...serialize(existing), ...patch });
  try {
    const updated = await news.findOneAndUpdate({ _id }, { $set: { ...data, publishedAt: new Date(data.publishedAt), updatedAt: new Date() } }, { returnDocument: "after" });
    if (!updated) throw new NewsError("Noticia no encontrada", 404);
    return serialize(updated);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) throw new NewsError("Ya existe una noticia con esa fuente", 409);
    throw error;
  }
}

export async function deleteArticle(id: string): Promise<void> {
  const news = await collection();
  const result = await news.deleteOne({ _id: validId(id) });
  if (!result.deletedCount) throw new NewsError("Noticia no encontrada", 404);
}
