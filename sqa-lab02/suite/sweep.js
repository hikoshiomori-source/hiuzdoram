#!/usr/bin/env node
// Runs every test against the clean build and all six broken builds, and prints
// the detection matrix. This is a reporting convenience only: it exists so the
// evidence in REPORT.md can be regenerated in one command. The lab work itself
// is done one build at a time by editing APP_URL in config.js.

const path = require("path");
const fs = require("fs");
const { runAll, assignment1, gap } = require("./run");

const BUILDS = ["todo.html", "todo_A.html", "todo_B.html", "todo_C.html", "todo_D.html", "todo_E.html", "todo_F.html"];
const LABEL = { "todo.html": "clean" };

function labelFor(file) {
  return LABEL[file] || file.replace("todo_", "").replace(".html", "");
}

async function main() {
  const tests = [...assignment1, ...gap];
  const table = {};
  const errors = {};

  for (const file of BUILDS) {
    const url = "file://" + path.join(__dirname, "..", "builds", file);
    const results = await runAll(tests, url, { quiet: true });
    const key = labelFor(file);
    table[key] = {};
    errors[key] = {};
    for (const r of results) {
      table[key][r.id] = r.passed ? "green" : "RED";
      if (!r.passed) errors[key][r.id] = r.error;
    }
    const red = results.filter((r) => !r.passed).map((r) => r.id);
    console.log(`${key.padEnd(6)} red: ${red.length ? red.join(", ") : "(none)"}`);
  }

  // Markdown matrix
  const ids = tests.map((t) => t.id);
  const header = "| build | " + ids.join(" | ") + " |";
  const sep = "|---" .repeat(ids.length + 1) + "|";
  const rows = Object.keys(table).map((build) => {
    const cells = ids.map((id) => (table[build][id] === "RED" ? "**RED**" : "green"));
    return `| ${build} | ${cells.join(" | ")} |`;
  });
  const md = [header, sep, ...rows].join("\n");

  const out = path.join(__dirname, "..", "evidence");
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "matrix.md"), md + "\n");
  fs.writeFileSync(path.join(out, "matrix.json"), JSON.stringify({ table, errors }, null, 2) + "\n");

  console.log("\n" + md + "\n");
  console.log("written: evidence/matrix.md, evidence/matrix.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
