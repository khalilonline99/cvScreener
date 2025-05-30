import { pipeline } from "@xenova/transformers";
import fs from 'fs';
import path from 'path';

let extractor = null;
const jsonFilePath =
  "/home/xp/Documents/projects/cvScreener/uploads/CV_of_Ibrahim_Khalil_Consultant/auto/CV_of_Ibrahim_Khalil_Consultant_content_list.json";

async function getEmbedding(text) {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  const output = await extractor(text, { pooling: "mean", normalize: true });
  return output.data;
}

function loadAndFilterText(filepath) {
  const file = fs.readFileSync(filepath, "utf-8");
  const json = JSON.parse(file);
  
  const keywords = [
    "objective",
    "skills",
    "experience",
    "education",
    "summary",
    "projects",
  ];
  console.log("json parsed file:", json);

  const filtered = json.filter(item=> {
    const lower = item.text.toLowerCase();
    return keywords.some(keyword => lower.includes(keyword)) || lower.length > 40;
  });
  const combinedText = filtered.map(item=> item.text).join('').replace(/\s+/g, '').trim();
  return combinedText;
}

(async () => {
  console.log("⏳ Processing CV...");

  const text = loadAndFilterText(jsonFilePath);
  console.log("✅ Filtered Text:", text);

  const vector = await getEmbedding(text);
  console.log("📌 Embedding Vector (first 5):", vector.slice(0, 5));
  console.log("✅ Embedding generated with dimension:", vector.length);
})();

export default getEmbedding;

// const testText = "This is a test sentence for embeddings.";
// (async () => {
//   const vector = await getEmbedding(testText);
//   console.log("Embedding vector:", vector);
// })();

// console.log("Running test...");
