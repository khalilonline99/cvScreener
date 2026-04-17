import fastify from "fastify";
import app from "./app.js";
import cvRoutes from "./routes/cv.route.js";



const start = async () => {
    try {
        await app.listen({ port: 5000 });
        
        console.log("Server running on Localhost 5000");
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();