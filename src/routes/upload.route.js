import { LiteParse } from "@llamaindex/liteparse";
import { extractCVData } from "../services/extract.service.js";
import { getEmbedding } from "../services/embedding.service.js";
import { client, COLLECTION_NAME } from "../services/qdrant.service.js";
import { extractWithAI } from "../services/ai.service.js";
import { createJob, updateJob } from "../services/job.service.js";
import { processCV } from "../services/process.service.js";


// init parser
const parser = new LiteParse({ ocrEnabled: true });

export default async function uploadRoute(app) {

  app.post("/upload", async (req, reply) => {
    console.log("🔥 Upload API HIT");

    const parts = req.parts();
    const jobIds = [];
    
    for await (const part of parts) {
      if (part.file) {
        console.log("📄 File received:", part.filename);

        const chunks = [];
        for await (const chunk of part.file) {
          chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        const jobId = createJob(part.filename, buffer);
        jobIds.push(jobId);

        await Promise.resolve();

        processCV(buffer, part.filename, jobId);
      }
    }

    return reply.send({ jobIds });
  });

}




// export default async function uploadRoute(app) {
//   app.post("/upload", async (req, reply) => {
//     try {
//       const file = await req.file();

//       if (!file) {
//         return reply.code(400).send({
//           error: "No file uploaded",
//         });
//       }

//       // ---------------- STREAM → BUFFER ----------------
//       const chunks = [];

//       for await (const chunk of file.file) {
//         chunks.push(chunk);
//       }

//       const buffer = Buffer.concat(chunks);

//       console.log("📦 Buffer size:", buffer.length);

//       // ---------------- PARSE DIRECTLY ----------------
//       let extractedText = "";

//       try {
//         const result = await parser.parse(buffer); // stream input

//         extractedText = result.text;

//         console.log("📦 Extracted Text un-organized, sent to AI");

//         // ----- we will use the ai for extraction and organize in json -------------
//         let aiData;

//         try {
//           aiData = await extractWithAI(extractedText);
//           console.log("🤖 AI Extracted Data:", aiData);

//           // ---------------- CREATE EMBEDDING TEXT ----------------
//           const embeddingText = `
//         ${aiData.skills?.join(", ")} professional
//         with experience in ${aiData.experience?.map(e => e.role).join(", ")}.
//         Education: ${aiData.education?.map(e => e.degree).join(", ")}.
//         `;


//           // ---------------- GENERATE VECTOR ----------------
//           const vector = await getEmbedding(embeddingText);

//           // Save in the quadrant
//           await client.upsert(COLLECTION_NAME, {
//             wait: true,
//             points: [
//               {
//                 id: Date.now(), // simple unique id
//                 vector: vector,
//                 payload: {
//                   name: aiData.name,
//                   email: aiData.email,
//                   phone: aiData.phone,
//                   skills: aiData.skills,
//                   experience_years: aiData.experience_years,
//                   experience: aiData.experience,
//                   education: aiData.education,
//                 },
//               },
//             ],
//           });
//           console.log("Upserted the data");

//           // ---------------- RESPONSE TO FRONTEND ----------------
//           return reply.send({
//             message: "CV parsed with AI",
//             data: aiData,
//             // data: extractedText,
//             // fullText: extractedText
//             // preview: extractedText.slice(0, 1000),
//           });
//           console.log("Sent to Frontend also");

//         } catch (err) {
//           return reply.code(500).send({
//             error: "AI extraction failed",
//             details: err.message,
//           });
//         }

//         // Run once to create the collection for the first time
//         // await client.createCollection("cvs", {
//         //   vectors: {
//         //     size: 384, // important for MiniLM
//         //     distance: "Cosine",
//         //   },
//         // });


//         if (!extractedText || extractedText.trim().length === 0) {
//           return reply.code(400).send({
//             error: "No readable text found",
//             message: "There are some issues in the CV/resume",
//           });
//         }

//       } catch (parseError) {
//         app.log.error(parseError);
//         return reply.code(500).send({
//           error: "Parsing failed",
//           message: "There are some issues in the CV/resume",
//           details: parseError.message,
//         });
//       }

//       // ---------------- EXTRACT METADATA ----------------
//       const metadata = extractCVData(extractedText);

//       // normalize experience
//       const expMatch = metadata.experience.match(/\d+/);
//       metadata.experience_years = expMatch ? Number(expMatch[0]) : 0;

//       // const structuredData = extractCVData(extractedText);
//       const structuredData = extractCVData(extractedText);

//     }
//     catch (error) {
//       app.log.error(error);

//       return reply.code(500).send({
//         error: "Upload failed",
//         details: error.message,
//       });
//     }
//   });
// }