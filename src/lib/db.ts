import { Db, MongoClient } from "mongodb";

declare global {
  var overfoxMongo: { uri: string; client: MongoClient; promise: Promise<MongoClient> } | undefined;
}

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI no está configurada");
  if (!global.overfoxMongo || global.overfoxMongo.uri !== uri) {
    const client = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 8000, connectTimeoutMS: 8000 });
    const promise = client.connect().catch((error: unknown) => {
      global.overfoxMongo = undefined;
      throw error;
    });
    global.overfoxMongo = { uri, client, promise };
  }
  const client = await global.overfoxMongo.promise;
  return client.db(process.env.MONGODB_DB || "overfox_news");
}

export async function closeDb(): Promise<void> {
  if (global.overfoxMongo) {
    await global.overfoxMongo.client.close();
    global.overfoxMongo = undefined;
  }
}
