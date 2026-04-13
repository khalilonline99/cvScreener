import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";
import uploadRoute from "./routes/upload.route.js";
import searchRoute from "./routes/search.route.js";


const app = Fastify({ logger: true });

await app.register(fastifyCors, {
  origin: "*",
  methods: ["POST", "GET"],
});

app.register(fastifyMultipart);

export default app;

//routes
app.register(uploadRoute, { prefix: "/api" });
app.register(searchRoute, { prefix: "/api" });



