# Assignment 1 requirements for the todo application

The six rules the suite in `suite/tests_assignment1.js` is meant to check. Each
broken build in `builds/` breaks exactly one of these.

| ID | Requirement |
|----|-------------|
| REQ-01 | Typing a title into the new-todo field and pressing Enter adds exactly one item to the list, and the input is cleared. Titles do not have to be unique — adding the same title twice gives two items. |
| REQ-02 | Leading and trailing whitespace is stripped from a title before it is stored, so `"  Buy milk  "` is stored as `"Buy milk"`. |
| REQ-03 | A title that is empty, or that is only whitespace, is not added. The list is left unchanged and the input is cleared. |
| REQ-04 | Toggling an item's checkbox marks it complete (the row gets the `completed` class, so the text is struck through) and the counter reports the number of items **still active**, with the correct singular/plural form (`1 item left`, `2 items left`). |
| REQ-05 | Clicking the `x` button on a row deletes **that** item and leaves every other item in place. |
| REQ-06 | The All / Active / Completed filters show, respectively, every item, only the active items, and only the completed items. The filter currently in force is the only one highlighted. |

## Test-to-requirement map

### The original six (`suite/tests_assignment1.js`)

| Test | Requirement |
|------|-------------|
| T1 `addsTodoAndClearsInput` | REQ-01 |
| T2 `trimsLeadingWhitespace` | REQ-02 |
| T3 `rejectsEmptyTitle` | REQ-03 |
| T4 `completingUpdatesRowAndCounter` | REQ-04 |
| T5 `deleteRemovesTodo` | REQ-05 |
| T6 `activeFilterShowsOnlyActiveItems` | REQ-06 |

### The gap-closing tests written in this lab (`suite/tests_gap.js`)

| Test | Requirement | Written because |
|------|-------------|-----------------|
| G1 `trimsTrailingWhitespace` | REQ-02 | T2 only ever checked leading whitespace. |
| G2 `deleteRemovesOnlyTheClickedTodo` | REQ-05 | T5 only ever deleted from a one-item list. |
| G3 `duplicateTitlesAreBothAdded` | REQ-01 | No test ever added the same title twice. |
