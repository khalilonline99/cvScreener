import { client, COLLECTION_NAME } from "../services/qdrant.service.js";

export default async function cvRoutes(app) {

    app.get("/cvs", async (req, reply) => {

        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;

        try {
            const result = await client.scroll(COLLECTION_NAME, {
                limit: 1000,
                with_payload: true,
            });

            const data = result.points.map((item) => ({
                id: item.id,
                name: item.payload.name,
                email: item.payload.email,
                createdAt: item.payload.createdAt || 0
            }));

            data.sort((a, b) => b.createdAt - a.createdAt);
            const paginated = data.slice(offset, offset + limit);

            return reply.send(paginated);
        }
        catch (err) {
            app.log.error(err);
            return reply.code(500).send({
                error: "Failed to fetch CVs",
            });
        }
    });

    app.get("/cvs/:id", async (req, reply) => {
        const { id } = req.params;

        const result = await client.retrieve(COLLECTION_NAME, {
            ids: [Number(id)],
            with_payload: true,
        });

        return reply.send(result[0].payload);
    });


}