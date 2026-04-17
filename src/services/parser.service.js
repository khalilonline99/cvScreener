async function processCV(buffer, fileName, jobId) {
    try {
        console.log("⚙️ Processing:", fileName);

        const result = await parser.parse(buffer);
        const text = result.text;

        const aiData = await extractAI(text);
        const vector = await getEmbedding(text);

        await client.upsert(COLLECTION_NAME, {
            wait: true,
            points: [
                {
                    id: Date.now(),
                    vector,
                    payload: aiData,
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