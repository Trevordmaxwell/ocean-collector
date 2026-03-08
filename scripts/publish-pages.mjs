import { cp, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const docsDir = path.join(root, "docs");

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

if (await exists(docsDir)) {
  await rm(docsDir, { recursive: true, force: true });
}

await cp(distDir, docsDir, { recursive: true });
await writeFile(path.join(docsDir, ".nojekyll"), "");

const indexPath = path.join(docsDir, "index.html");
if (await exists(indexPath)) {
  await cp(indexPath, path.join(docsDir, "404.html"));
}

console.log("Published web export into /docs for GitHub Pages.");
