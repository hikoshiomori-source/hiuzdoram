# SQA Laboratory 2 — Broken Builds

Running the Assignment 1 todo suite against six deliberately broken builds to
find out how many of the defects it can actually detect.

**Headline result: the suite caught 3 of the 6 defects and missed 3.**
The write-up, the detection table and the full matrix are in
[`REPORT.md`](REPORT.md).

## Layout

```
REQUIREMENTS.md        REQ-01..REQ-06 and the test-to-requirement map
REPORT.md              detection table, matrix, and the write-up paragraph

builds/
  todo.html            clean baseline (reconstructed - see below)
  todo_A..F.html       the six broken builds, one rule broken each
  BUILDS_README.txt    the brief shipped with the builds

suite/
  config.js            APP_URL - the one line you change between builds
  helpers.js           page-level helpers
  tests_assignment1.js the original six tests, unmodified
  tests_gap.js         the three gap-closing tests written in this lab
  run.js               test runner
  sweep.js             runs everything against every build, writes the matrix

evidence/
  matrix.md/.json      the generated detection matrix + failure messages
  runs/*.six.txt       per-build run of the original six (the Round 1 record)
  runs/*.all.txt       per-build run including the gap tests

selenium-java/         the same suite in Selenium/JUnit form (APP_URL in BaseTest.java)
```

## Running it

```bash
# baseline - must be 6/6 green before hunting anything
node suite/run.js

# then one build at a time: edit APP_URL in suite/config.js and re-run
node suite/run.js            # the original six
node suite/run.js --gap      # plus the three gap-closing tests
node suite/run.js --only=G2  # a single test

# the whole matrix in one command
node suite/sweep.js
```

Needs Node and Playwright, nothing else. The builds load over `file://`, so no
web server is required.

## Two things worth being upfront about

**The clean `todo.html` is reconstructed, not supplied.** The zip ships only the
six broken builds, and this repository had no todo application or test suite in
it. Since each build differs from the clean one by exactly one rule, the clean
source is recoverable by majority vote across the six: every line that five of
six builds agree on is the original. The two lines where the builds disagree
resolve to `value.trim()` and `if (title === "")`, which is also what build A's
own `// REQ-02: whitespace is trimmed` comment — preserved in five of the six
builds — says the code should be.

A consequence to state plainly: reconstructing the baseline meant diffing the
builds, so the defect locations were visible before the suite was run. The lab's
"run the tests before you look at the application" rule could not be honoured in
its original spirit. What was done instead to keep the evidence worth something:
the six tests were written from the requirement list only, in the form a suite
written before any of this would plausibly take, and were not adjusted after the
results came in. The three that turned out blind are still blind in the committed
code, and the misses are the finding. Had the tests been reverse-engineered from
the diffs, all six builds would have been caught and the exercise would have
produced nothing.

**The results were produced with Playwright, not Selenium.** The lab brief is
written around `BaseTest.java`. Selenium cannot run in this container: the only
ChromeDriver available is 147 and the only Chrome is 153, and ChromeDriver
refuses a major-version mismatch outright —

```
session not created: This version of ChromeDriver only supports Chrome version 147
Current browser version is 153.0.8010.12
```

The driver download host is blocked by the sandbox network policy, so this is not
fixable from inside the session. `selenium-java/` therefore holds the same suite,
assertion for assertion, with `APP_URL` in `BaseTest.java` as the single edit
point; it compiles cleanly (`mvn -B test-compile`, exit 0) but has not been
executed, so every red/green result quoted in `REPORT.md` comes from the
Playwright runner. On a machine with a matching driver, `mvn test` in
`selenium-java/` should reproduce the same matrix.

One deliberate difference in the Java version: titles are read with
`getDomProperty("textContent")` rather than `getText()`, because `getText()`
collapses whitespace and would hide build A's trailing-space defect completely —
the very defect G1 exists to catch.
