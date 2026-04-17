import { getJob } from "../services/job.service.js";

export default async function jobRoute(app) {

    app.get("/jobs/:id", async (req, reply) => {
        const job = getJob(req.params.id);

        if (!job) {
            return reply.code(404).send({ error: "Job not found" });
        }

        return reply.send(job);
    });

}