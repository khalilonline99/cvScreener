import { pipeline } from "@xenova/transformers";

let extractor = null;

async function getEmbedding(text) {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  const output = await extractor(text, { pooling: "mean", normalize: true });
  return output.data;
  
}

export default getEmbedding;

const testText = "This is a test sentence for embeddings.";
// getEmbedding(testText);

(async () => {
  const vector = await getEmbedding(testText);
//   const vector = getEmbedding(testText);
  console.log("Embedding vector:", vector);
})();

console.log("Running test...");
