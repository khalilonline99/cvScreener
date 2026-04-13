export function scoreCV(text = "") {
  const t = text.toLowerCase();

  let score = 0;

  const rules = [
    ["javascript", 20],
    ["react", 20],
    ["node", 20],
    ["typescript", 15],
    ["docker", 15],
    ["mysql", 10],
  ];

  for (const [key, value] of rules) {
    if (t.includes(key)) score += value;
  }

  return {
    score,
    label:
      score > 70
        ? "Strong Fit"
        : score > 40
        ? "Moderate Fit"
        : "Weak Fit",
  };
}