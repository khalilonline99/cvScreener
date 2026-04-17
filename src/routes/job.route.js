import { getJob, updateJob } from "../services/job.service.js";
import { processCV } from "../services/process.service.js";

export default async function jobRoute(app) {

    app.get("/jobs/:id", async (req, reply) => {
        const job = getJob(req.params.id);

        if (!job) {
            return reply.code(404).send({ error: "Job not found" });
        }

        return reply.send(job);
    });

    
    app.post("/jobs/:id/retry", async (req, reply) => {
        const job = getJob(req.params.id);

        if (!job) {
            return reply.code(404).send({ error: "Job not found" });
        }

        if (!job.buffer) {
            return reply.code(400).send({ error: "No file buffer found" });
        }

        console.log("🔁 Retrying job:", req.params.id);

        updateJob(req.params.id, {
            status: "processing",
            error: null
        });

        processCV(job.buffer, job.fileName, req.params.id);

        return reply.send({ message: "Retry started" });
    });

}