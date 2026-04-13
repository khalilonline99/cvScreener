export function createEmbedding(text) {
  const vec = new Array(384).fill(0);

  for (let i = 0; i < text.length; i++) {
    vec[i % 384] += text.charCodeAt(i) / 1000;
  }

  return vec;
}