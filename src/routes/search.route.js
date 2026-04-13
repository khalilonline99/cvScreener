import { createEmbedding } from "../services/embedding.service.js";
import { searchCV } from "../services/qdrant.service.js";

export default async function searchRoute(app) {
  app.get("/search", async (req, reply) => {
    const { text } = req.query;

    const vector = createEmbedding(text);

    const result = await searchCV(vector);

    return reply.send(result);
  });
}