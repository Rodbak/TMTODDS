import { spawnSync } from "node:child_process";

function run(cmd, args) {
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

// Only migrate on Vercel production builds to avoid accidental cross-env schema changes.
if (process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production") {
  run("npx", ["prisma", "migrate", "deploy"]);
}

run("npx", ["next", "build"]);
