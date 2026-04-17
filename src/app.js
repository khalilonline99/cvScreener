import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";
import uploadRoute from "./routes/upload.route.js";
import searchRoute from "./routes/search.route.js";
import cvRoutes from "./routes/cv.route.js";
import jobRoute from "./routes/job.route.js";


const app = Fastify({ logger: true });

app.register(fastifyCors, {
  origin: "*",
  methods: ["POST", "GET"],
});

app.register(fastifyMultipart);


//routes
app.register(uploadRoute, { prefix: "/api" });
app.register(searchRoute, { prefix: "/api" });
app.register(cvRoutes, { prefix: "/api" });
app.register(jobRoute, { prefix: "/api" });


export default app;
