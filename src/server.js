import app from "./app";

const start = async () => {
    try {
        await app.listen({ port: 5000, host: "0.0.0.0" });
        console.log("Server running on Localhost 5000");
    }
    catch (err) {
        console.error(err);
    }
}

start();