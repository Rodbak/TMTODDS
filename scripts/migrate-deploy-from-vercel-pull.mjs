import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

function loadDotenvFile(filePath) {
  const txt = readFileSync(filePath, "utf8");
  for (const rawLine of txt.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq <= 0) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Don't override values already set in the process environment.
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile =
  process.argv[2] ?? path.join(__dirname, "..", ".env.vercel.pull.production");

loadDotenvFile(envFile);

if (!process.env.DATABASE_URL) {
  console.error(
    `DATABASE_URL missing after loading ${envFile}. Is Neon connected to this Vercel project?`,
  );
  process.exit(1);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
