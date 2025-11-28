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

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function copyRecursive(from, to) {
  const stat = await fsp.stat(from);
  if (stat.isDirectory()) {
    await ensureDir(to);
    const entries = await fsp.readdir(from);
    for (const entry of entries) {
      await copyRecursive(path.join(from, entry), path.join(to, entry));
    }
  } else {
    await fsp.copyFile(from, to);
  }
}

async function writeDistReadme() {
  const readmeSrc = path.join(projectRoot, 'README.md');
  try {
    await fsp.copyFile(readmeSrc, path.join(distDir, 'README.md'));
  } catch {
    // ignore if README missing
  }
}

async function main() {
  if (!fs.existsSync(srcDir)) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }
  await rmDirIfExists(distDir);
  await ensureDir(distDir);
  await copyRecursive(srcDir, distDir);
  await writeDistReadme();
  console.log('Build complete: dist/');
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});




