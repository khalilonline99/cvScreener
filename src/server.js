import app from "./app.js";

const start = async () => {
    try {
        await app.listen({ port: 5000 });
        console.log("Server running on Localhost 5000");
    }
    catch (err) {
        console.error(err);
    }
}

start();