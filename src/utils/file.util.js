import fs from "fs";
import path from "path";

export const uploadDir = path.join(process.cwd(), "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

export async function saveFile(file) {
  const filePath = path.join(uploadDir, file.filename);

  await new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);

    file.file.pipe(stream);

    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return filePath;
}