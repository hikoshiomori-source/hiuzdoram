// Lab 2 - the ONE line you change between builds.
//
// This is the Playwright equivalent of BaseTest.java's APP_URL. Point it at a
// build in ../builds/ and re-run the suite. Change NOTHING ELSE between runs:
// if you edit a test to make it pass, you have destroyed the evidence.
//
//   todo.html                   = clean baseline (all six tests must be green)
//   todo_A.html .. todo_F.html  = broken builds, exactly one rule broken each

const path = require("path");

const APP_URL = "file://" + path.join(__dirname, "..", "builds", "todo.html");

// The APP_URL env var is used only by the matrix sweep (sweep.js), so that one
// process can run the suite against every build in turn. Normal lab work edits
// the APP_URL constant above and nothing else.
module.exports = { APP_URL: process.env.APP_URL || APP_URL };
