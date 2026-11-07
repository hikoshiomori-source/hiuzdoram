# Laboratory 2 — Can Your Tests Catch a Bug?

Evidence for the Assignment 5 hand-in.

All six builds were worked, not the three-build minimum. The suite under test is
the six Assignment 1 tests in `suite/tests_assignment1.js`, one per requirement
in `REQUIREMENTS.md`.

## Baseline

Six tests, six green against the clean `builds/todo.html`
(`evidence/runs/todo.six.txt`):

```
  GREEN T1 addsTodoAndClearsInput (REQ-01)
  GREEN T2 trimsLeadingWhitespace (REQ-02)
  GREEN T3 rejectsEmptyTitle (REQ-03)
  GREEN T4 completingUpdatesRowAndCounter (REQ-04)
  GREEN T5 deleteRemovesTodo (REQ-05)
  GREEN T6 activeFilterShowsOnlyActiveItems (REQ-06)

6/6 green
```

One honest note on the baseline: T6 was red on the first attempt, and the cause
was the test, not the application. The app re-renders from the `hashchange`
event, which fires *after* the click on the filter returns, so the assertions
were racing the re-render. The fix is a sync point in the helper — wait for the
clicked filter to carry the `selected` class — not a weakened assertion. This is
exactly the "if one is red, fix it now" step: a flaky test cannot be used to hunt
bugs, because you can never tell a real red from a timing red.

## Detection table

| BUILD | WHAT THE DEFECT ACTUALLY IS | CAUGHT BY WHICH TEST | IF MISSED — NEW TEST WRITTEN |
|---|---|---|---|
| **A** | REQ-02 broken. The title is stripped with `value.replace(/^\s+/, "")` instead of `value.trim()`, so **leading** whitespace goes but **trailing** whitespace is stored: `"Buy milk   "` is kept verbatim. | **Missed.** All six green. | **G1 `trimsTrailingWhitespace`** — red on A (`expected ["Buy milk"], got ["Buy milk   "]`), green on clean. |
| **B** | REQ-03 broken. The empty-title guard reads `if (title === null)` instead of `if (title === "")`, so a trimmed title never equals `null` and empty / whitespace-only input is added as a blank row. | **T3 `rejectsEmptyTitle`** — `empty title not added: expected 0, got 1`. | — |
| **C** | REQ-05 broken. The delete handler runs `todos = todos.slice(1)`, so clicking any row's `x` removes the **first** item rather than the clicked one. | **Missed.** All six green. | **G2 `deleteRemovesOnlyTheClickedTodo`** — red on C (`expected ["First","Third"], got ["Second","Third"]`), green on clean. |
| **D** | REQ-04 broken. The counter is computed as `todos.length` instead of the number of items with `!t.done`, so completed items are still counted as left. | **T4 `completingUpdatesRowAndCounter`** — `counter counts active only: expected "1 item left", got "2 items left"`. | — |
| **E** | REQ-06 broken. The Active filter predicate is inverted — `if (f === "active") return t.done` — so Active shows the completed items. | **T6 `activeFilterShowsOnlyActiveItems`** — `only the active item: expected ["Still to do"], got ["Already done"]`. | — |
| **F** | REQ-01 broken. An extra rule the application never had: a duplicate-title check (`todos.some(x => x.title === title)`) silently drops any second item whose title already exists. | **Missed.** All six green. | **G3 `duplicateTitlesAreBothAdded`** — red on F (`both items added: expected 2, got 1`), green on clean. |

**Score: the suite caught 3 of 6 defects (B, D, E) and missed 3 (A, C, F).**

## Full matrix

Regenerate with `node suite/sweep.js`. Every cell is a real run;
`evidence/matrix.json` carries the failure messages.

| build | T1 | T2 | T3 | T4 | T5 | T6 | G1 | G2 | G3 |
|---|---|---|---|---|---|---|---|---|---|
| clean | green | green | green | green | green | green | green | green | green |
| A | green | green | green | green | green | green | **RED** | green | green |
| B | green | green | **RED** | green | green | green | green | green | green |
| C | green | green | green | green | green | green | green | **RED** | green |
| D | green | green | green | **RED** | green | green | green | green | green |
| E | green | green | green | green | green | **RED** | green | green | green |
| F | green | green | green | green | green | green | green | green | **RED** |

The matrix is the two-sided proof the lab asks for. Each new test is red against
exactly one build and green against the clean baseline **and** against the other
five — so none of them is a test that is "red against both", and none of them is
catching a defect it was not written for by accident.

Note also what the diagonal shows: each defect is detected by exactly one test.
There is no redundancy anywhere in this suite. Every requirement rests on a
single assertion, so any one blind spot is a total blind spot.

## Which of our tests turned out to be weaker than we thought, and why

Three of the six were blind, and in each case the test was weak for the same
underlying reason: it was written against the *example* in the requirement rather
than against the *rule*.

**T2 (`trimsLeadingWhitespace`)** is the clearest case. REQ-02 says leading and
trailing whitespace is stripped, but the test only ever typed `"   Buy milk"`.
The implementation in build A strips one side correctly, and a one-sided test
cannot tell a one-sided strip from a two-sided one. The test name itself was the
warning sign we ignored: it describes half a requirement, so it could only ever
check half a requirement.

**T5 (`deleteRemovesTodo`)** was weak because it used the smallest possible list.
With one item, "delete the clicked item" and "delete the first item" are
indistinguishable — build C's `slice(1)` is a *correct* implementation of the
test we actually wrote. The assertion was also too coarse: it only counted rows
rather than checking which rows survived, so even on a longer list it would have
missed a defect that removes the wrong item while still removing exactly one. A
delete test needs at least three items and has to assert identity, not count.

**T6 (`activeFilterShowsOnlyActiveItems`)** passed, but not for a good reason. It
caught build E only because the two-item fixture had one active and one completed
item, so the inverted predicate returned the wrong title rather than the right
one by coincidence. Had both items been active, an inverted filter would have
shown an empty list and the test would still have had to notice — it would, as
it asserts titles, but the margin was thinner than it looked.

Build **F** exposes the gap that is not about any individual test's strength at
all: the suite had no test for duplicate titles, because REQ-01's freedom to add
the same title twice is a rule nobody thought to write down as a test. A rule
with no test is not weakly checked, it is unchecked, and an entire extra
validation rule could be added to the application without a single test going
red. That is the most valuable of the three findings, and the cheapest to have
prevented.

The common thread: a passing suite told us the six requirements were covered,
when what it actually told us is that six specific *examples* behaved. Coverage
of a requirement means covering its boundaries — both ends of a trim, a list long
enough for identity to matter, and the cases a requirement permits as well as the
ones it forbids.

## Reproducing this

```bash
# baseline — must be 6/6 green
node suite/run.js

# one build at a time: edit APP_URL in suite/config.js, then
node suite/run.js            # the original six
node suite/run.js --gap      # plus the three gap-closing tests

# the whole matrix in one go
node suite/sweep.js
```

Needs Node and Playwright only; the builds are loaded over `file://`, so nothing
has to be served. `selenium-java/` holds the same suite in the Selenium/JUnit
form the lab brief uses, with `APP_URL` in `BaseTest.java` — see `README.md` for
why the results above were produced with the Playwright runner.
