#!/usr/bin/env node
const { execSync } = require("child_process");
const { readFileSync } = require("fs");

const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split("\n")
    .map((l) => l.split("="))
    .filter(([k]) => k && !["PORT"].includes(k))
    .map(([k, ...rest]) => [k, rest.join("=")]),
);

const SKIP = new Set(["PORT"]);
const TARGETS = ["production", "preview", "development"];

for (const [key, value] of Object.entries(env)) {
  if (SKIP.has(key) || !value?.trim()) {
    console.log(`skip  ${key}`);
    continue;
  }
  for (const target of TARGETS) {
    try {
      execSync(`vercel env add ${key} ${target}`, {
        input: Buffer.from(value),
        stdio: ["pipe", "pipe", "pipe"],
      });
      console.log(`add   ${key} @ ${target}`);
    } catch (e) {
      const out = e.stderr?.toString() || "";
      if (out.includes("already exists")) {
        // overwrite with pull then push approach — just note it
        console.log(`exists ${key} @ ${target} (overwrite manually if needed)`);
      } else {
        console.error(`error  ${key} @ ${target}: ${out.slice(0, 100)}`);
      }
    }
  }
}
console.log("\nDone.");
