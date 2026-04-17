import { LiteParse } from "@llamaindex/liteparse";

import { extractWithAI } from "./ai.service.js";
import { getEmbedding } from "./embedding.service.js";
import { client, COLLECTION_NAME } from "./qdrant.service.js";
import { updateJob } from "./job.service.js";

const parser = new LiteParse({ ocrEnabled: true });

export async function processCV(buffer, fileName, jobId) {
    try {
        console.log("⚙️ Processing:", fileName);

        const result = await parser.parse(buffer);
        const text = result.text;

        const aiData = await extractWithAI(text);
        const vector = await getEmbedding(text);

        await client.upsert(COLLECTION_NAME, {
            wait: true,
            points: [
                {
                    id: Date.now(),
                    vector,
                    payload: {...aiData, createdAt: Date.now()},
                },
            ],
        });

        updateJob(jobId, { status: "done" });

    } catch (err) {
        console.error("❌ Error processing:", fileName, err.message);

        updateJob(jobId, {
            status: "failed",
            error: err.message,
        });
    }
}