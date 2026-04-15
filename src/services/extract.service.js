export function extractCVData(text = "") {
  const clean = text.replace(/\n/g, " ").toLowerCase();

  // -------- NAME (very basic heuristic) --------
  const nameMatch = text.split("\n")[0];

  // -------- EMAIL --------
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/
  );

  // -------- PHONE --------
  const phoneMatch = text.match(
    /(\+?\d{1,3}[\s-]?)?\d{10,14}/
  );

  // -------- SKILLS --------
  const skillList = [
    "javascript",
    "react",
    "node",
    "typescript",
    "python",
    "java",
    "html",
    "css",
    "mysql",
    "mongodb",
    "docker",
  ];

  const skills = skillList.filter((skill) =>
    clean.includes(skill)
  );

  // -------- EXPERIENCE --------
  const expMatch = text.match(
    /(\d+)\+?\s*(years|yrs)/i
  );

  // -------- EDUCATION --------
  const eduMatch = text.match(
    /(bsc|msc|bachelor|master|phd)[^.,\n]*/i
  );

  return {
    name: nameMatch || "Not found",
    email: emailMatch ? emailMatch[0] : "Not found",
    phone: phoneMatch ? phoneMatch[0] : "Not found",
    skills,
    experience: expMatch ? expMatch[0] : "Not found",
    education: eduMatch ? eduMatch[0] : "Not found",
  };
}