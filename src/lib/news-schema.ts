import { z } from "zod";

const externalUrl = z.string().trim().max(2048, "La URL admite hasta 2048 caracteres").url("Introduce una URL válida").refine((value) => {
  const url = new URL(value);
  return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
}, "Usa una URL pública http o https sin credenciales");

export const newsInputSchema = z.object({
  title: z.string().trim().min(8, "El título debe tener al menos 8 caracteres").max(180, "El título admite hasta 180 caracteres"),
  description: z.string().trim().min(20, "Añade un resumen de al menos 20 caracteres").max(400, "El resumen admite hasta 400 caracteres"),
  content: z.string().trim().min(40, "Añade el contexto de la noticia").max(30000, "El contenido admite hasta 30.000 caracteres"),
  imageUrl: externalUrl,
  company: z.string().trim().min(2, "La empresa debe tener al menos 2 caracteres").max(80, "La empresa admite hasta 80 caracteres"),
  category: z.string().trim().min(2, "La categoría debe tener al menos 2 caracteres").max(50, "La categoría admite hasta 50 caracteres"),
  tags: z.array(z.string().trim().min(1, "Las etiquetas no pueden estar vacías").max(32, "Cada etiqueta admite hasta 32 caracteres")).min(1, "Añade al menos una etiqueta").max(8, "Puedes añadir hasta 8 etiquetas").transform((tags) => Array.from(new Set(tags.map((tag) => tag.toLocaleLowerCase("es"))))),
  sourceUrl: externalUrl.transform((value) => {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  }),
  sourceName: z.string().trim().min(2, "La fuente debe tener al menos 2 caracteres").max(80, "El nombre de la fuente admite hasta 80 caracteres"),
  publishedAt: z.string().datetime({ offset: true, message: "Usa una fecha ISO 8601 con zona horaria" }).transform((value) => new Date(value).toISOString()),
  featured: z.boolean().default(false),
});

export const newsUpdateSchema = newsInputSchema.partial();
export type NewsInput = z.input<typeof newsInputSchema>;

export function slugify(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 140) || "noticia";
}

export function dateRange(date: string): { $gte: Date; $lt: Date } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new NewsError("La fecha debe tener formato AAAA-MM-DD", 400);
  const start = new Date(`${date}T04:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== date) throw new NewsError("Fecha de calendario inválida", 400);
  return { $gte: start, $lt: new Date(start.getTime() + 86400000) };
}

export class NewsError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "NewsError";
  }
}
