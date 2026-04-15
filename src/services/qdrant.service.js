import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from 'dotenv';

dotenv.config();

export const client  = new QdrantClient({
  url: process.env.DB_URL,
  apiKey: process.env.QUADRANT_API_KEY,
});

// try {
//   const result = await qdrant.getCollections();
//   console.log('List of collections:', result.collections);
// } catch (err) {
//   console.error('Could not get collections:', err);
// }

export const COLLECTION_NAME = "cvs";

