import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import fastifyCors from "@fastify/cors";
import { stderr, stdout } from "process";
import util from "util";
import { QdrantClient } from "@qdrant/js-client-rest";

const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors, {
  origin: "*",
  methods: ["POST", "GET"],
});
fastify.register(fastifyMultipart);

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const execPromise = util.promisify(exec);

const client = new QdrantClient({ host: "localhost", port: 6333 }); // initialized the client
// await client.createCollection("test_bb", {
//   vectors: {size: 4, distance: "Dot"},
// });

// const operationInfo = await client.upsert("test_bb", {
//   wait: true,
//   points: [
//     { id: 1, vector: [0.05, 0.61, 0.76, 0.74], payload: { city: "Berlin" } },
//     { id: 2, vector: [0.19, 0.81, 0.75, 0.11], payload: { city: "London" } },
//     { id: 3, vector: [0.36, 0.55, 0.47, 0.94], payload: { city: "Moscow" } },
//     { id: 4, vector: [0.18, 0.01, 0.85, 0.80], payload: { city: "New York" } },
//     { id: 5, vector: [0.24, 0.18, 0.22, 0.44], payload: { city: "Beijing" } },
//     { id: 6, vector: [0.35, 0.08, 0.11, 0.44], payload: { city: "Mumbai" } },
//   ],
// });

// console.log(operationInfo);



let searchResult = await client.query("test_bb", {
  query: [0.2, 0.1, 0.9, 0.7],
  filter: {
    must: [{ key: "city", match: { value: "London" } }],
  },
  with_payload: true,
  limit: 3,
});
console.debug(searchResult.points);

fastify.post("/upload", async (req, res) => {
  // if (isProcessing) {
  //   return res.status(400).send({ error: "Already processing another file." });
  // }
  // isProcessing = true;
  try {
    const data = await req.file();
    const filePath = path.join(uploadDir, data.filename);
    const fileStream = fs.createWriteStream(filePath);
    await data.file.pipe(fileStream);

    // const outputFolder = path.join(uploadDir, data.filename.split(".")[0]);
    const outputFolder = "uploads";
    const command = `bash -c "source ~/miniconda3/bin/activate mineru && magic-pdf -p ${filePath} -o ${outputFolder}"`;
    await execPromise(command);

    // exec(
    //   `bash -c "source ~/miniconda3/bin/activate mineru && magic-pdf -p ${filePath} -o ${outputFolder}"`,
    //   (error, stdout, stderr) => {
    //     if (error) {
    //       console.error(`MinerU Error: ${error.message}`);
    //       return res.code(500).send({ error: "Failed to extract text" });
    //     }

    const expectedJsonFileName = `${path.basename(
      data.filename,
      path.extname(data.filename)
    )}_content_list.json`;

    const jsonFilePath = path.join(
      outputFolder,
      path.basename(data.filename, path.extname(data.filename)),
      "auto",
      expectedJsonFileName
    );
    console.log("The jsonFile Path 📂:", jsonFilePath);

    if (fs.existsSync(jsonFilePath)) {
      const extractedData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
      return res.send({
        message: "File processed successfully!",
        extractedData,
      });
    } else {
      return res
        .code(500)
        .send({ error: "Extraction failed. No corresponding JSON found." });
    }
    // }
    // );

    // const extractedText = `Extracted content from: ${data.filename} <br> which is dummy data and`;
    // return res.send({
    //   message: "📂 File uploaded successfully!",
    //   extractedText,
    // });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 5000 }),
      console.log("Server running at http://localhost:5000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
