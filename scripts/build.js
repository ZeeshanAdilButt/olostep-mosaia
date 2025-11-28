import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const distDir = path.join(projectRoot, 'dist');

async function rmDirIfExists(dir) {
  try {
    await fsp.rm(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fsp.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  if (!fs.existsSync(srcDir)) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }
  await rmDirIfExists(distDir);
  await copyDir(srcDir, distDir);
  console.log('Build complete: dist/');
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
