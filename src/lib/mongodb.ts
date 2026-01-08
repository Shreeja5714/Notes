import { MongoClient, Db, Collection, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

if (!process.env.MONGODB_DB) {
  throw new Error("Please add your MONGODB_DB to .env.local");
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// In development, use a global variable to preserve the client across hot reloads.
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV !== "production") {
  if (!globalForMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalForMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalForMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  if (!clientPromise) {
    throw new Error("MongoDB client is not initialized");
  }
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export interface Note {
  _id?: ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getNotesCollection(): Promise<Collection<Note>> {
  const db = await getDb();
  return db.collection<Note>("notes");
}
