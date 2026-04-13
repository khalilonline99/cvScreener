import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from 'dotenv';

dotenv.config();

const qdrant = new QdrantClient({
    url: process.env.DB_URL,
    apiKey: process.env.QUADRANT_API_KEY,
});

try {
    const result = await qdrant.getCollections();
    console.log('List of collections:', result.collections);
} catch (err) {
    console.error('Could not get collections:', err);
}

const COLLECTION = "cv_screener";

export async function initCollection() {
  const collections = await qdrant.getCollections();

  const exists = collections.collections.some(
    (c) => c.name === COLLECTION
  );

//   if (!exists) {
//     await qdrant.createCollection(COLLECTION, {
//       vectors: {
//         size: 384,
//         distance: "Cosine",
//       },
//     });
//   }
}

export async function insertCV(point) {
  return qdrant.upsert(COLLECTION, {
    points: [point],
  });
}

export async function searchCV(vector) {
  return qdrant.search(COLLECTION, {
    vector,
    limit: 5,
    with_payload: true,
  });
}