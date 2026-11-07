#!/usr/bin/env node
// Lab 2 test runner.
//
//   node suite/run.js            run the Assignment 1 six against APP_URL
//   node suite/run.js --gap      run the gap-closing tests as well
//   node suite/run.js --only=G2  run one test by id
//
// Only config.js decides which build is under test.

const { chromium } = require("playwright");
const { APP_URL } = require("./config");

const assignment1 = require("./tests_assignment1");
const gap = require("./tests_gap");

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const OFF = "\x1b[0m";

// A failed assertion throws, so the first broken expectation ends the test.
function assertions() {
  return {
    equal(actual, expected, what) {
      if (actual !== expected) {
        throw new Error(`${what}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    deepEqual(actual, expected, what) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`${what}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
  };
}

async function runAll(tests, url, { quiet = false } = {}) {
  const browser = await chromium.launch();
  const results = [];

  try {
    for (const test of tests) {
      const page = await browser.newPage();
      let result;
      try {
        await test.run(page, url, assertions());
        result = { id: test.id, req: test.req, name: test.name, passed: true };
      } catch (err) {
        result = { id: test.id, req: test.req, name: test.name, passed: false, error: err.message };
      }
      await page.close();
      results.push(result);

      if (!quiet) {
        const tag = result.passed ? `${GREEN}GREEN${OFF}` : `${RED}RED  ${OFF}`;
        console.log(`  ${tag} ${result.id} ${result.name} ${DIM}(${result.req})${OFF}`);
        if (!result.passed) console.log(`        ${RED}${result.error}${OFF}`);
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const withGap = args.includes("--gap");
  const only = (args.find((a) => a.startsWith("--only=")) || "").split("=")[1];

  let tests = withGap ? [...assignment1, ...gap] : assignment1;
  if (only) tests = tests.filter((t) => t.id === only);

  console.log(`\nAPP_URL = ${APP_URL}\n`);
  const results = await runAll(tests, APP_URL);

  const red = results.filter((r) => !r.passed);
  console.log(
    `\n${results.length - red.length}/${results.length} green` +
      (red.length ? `, red: ${red.map((r) => r.id).join(", ")}` : "") +
      "\n"
  );

  process.exit(red.length ? 1 : 0);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(2);
  });
}

module.exports = { runAll, assignment1, gap };
