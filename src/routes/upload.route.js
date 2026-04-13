import { saveFile, ensureUploadDir } from "../utils/file.util.js";
import { createEmbedding } from "../services/embedding.service.js";
import { scoreCV } from "../services/scoring.service.js";
import { insertCV, initCollection } from "../services/qdrant.service.js";
import fs from "fs";
import path from "path";

export default async function uploadRoute(app) {
  await initCollection();
  ensureUploadDir();

  app.post("/upload", async (req, reply) => {
    const file = await req.file();

    const filePath = await saveFile(file);

    let text = "dummy cv text javascript react node";

    // optional MinerU output check
    const base = path.parse(file.filename).name;

    const jsonPath = path.join(
      process.cwd(),
      "uploads",
      base,
      "auto",
      `${base}_content_list.json`
    );

    if (fs.existsSync(jsonPath)) {
      text = fs.readFileSync(jsonPath, "utf-8");
    }

    const vector = createEmbedding(text);
    const score = scoreCV(text);

    const point = {
      id: Date.now(),
      vector,
      payload: {
        filename: file.filename,
        text: text.slice(0, 2000),
        score: score.score,
        label: score.label,
      },
    };

    await insertCV(point);

    return reply.send({
      message: "CV uploaded",
      score,
    });
  });
}