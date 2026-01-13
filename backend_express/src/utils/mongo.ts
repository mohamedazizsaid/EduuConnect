import { MongoClient, Db } from 'mongodb';

const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/educonnect';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectDB = async () => {
  if (db) return db;
  client = new MongoClient(MONGODB_URL);
  await client.connect();
  db = client.db();
  console.log('Connected to MongoDB');
  return db;
};

export const getDb = () => {
  if (!db) throw new Error('Database not initialized. Call connectDB() first.');
  return db;
};

export const closeDB = async () => {
  if (client) await client.close();
  client = null;
  db = null;
};

export default { connectDB, getDb, closeDB };
