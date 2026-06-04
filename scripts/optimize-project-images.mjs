import { copyFile, mkdir, readdir, rename, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const oneMb = 1024 * 1024;
const sourceDir = path.join(process.cwd(), "public", "assets");
const optimizedDir = path.join(sourceDir, "optimized");
const originalsDir = path.join(process.cwd(), "assets-originals");

await mkdir(optimizedDir, { recursive: true });
await mkdir(originalsDir, { recursive: true });

const files = await readdir(sourceDir, { withFileTypes: true });
const report = [];

for (const file of files) {
  if (!file.isFile() || !file.name.endsWith(".png")) continue;

  const sourcePath = path.join(sourceDir, file.name);
  const fileStat = await stat(sourcePath);

  if (fileStat.size <= oneMb) continue;

  const originalPath = path.join(originalsDir, file.name);
  const optimizedName = file.name.replace(/\.png$/, ".webp");
  const optimizedPath = path.join(optimizedDir, optimizedName);

  await copyFile(sourcePath, originalPath);

  const originalMeta = await sharp(sourcePath).metadata();

  await sharp(sourcePath)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(optimizedPath);

  const optimizedMeta = await sharp(optimizedPath).metadata();
  const optimizedStat = await stat(optimizedPath);

  await rename(sourcePath, path.join(originalsDir, file.name));

  report.push({
    original: file.name,
    optimized: `optimized/${optimizedName}`,
    originalSize: fileStat.size,
    optimizedSize: optimizedStat.size,
    originalDimensions: `${originalMeta.width}x${originalMeta.height}`,
    optimizedDimensions: `${optimizedMeta.width}x${optimizedMeta.height}`,
  });
}

for (const item of report) {
  const before = (item.originalSize / oneMb).toFixed(2);
  const after = (item.optimizedSize / oneMb).toFixed(2);
  console.log(
    `${item.original} (${item.originalDimensions}, ${before} MB) -> ${item.optimized} (${item.optimizedDimensions}, ${after} MB)`,
  );
}

console.log(`Optimized ${report.length} image(s).`);
