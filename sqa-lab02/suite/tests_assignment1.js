// The original six tests from Assignment 1, one per requirement.
//
// These are preserved exactly as they were written before the broken builds
// were opened. Three of them turn out to be weaker than they look; the point of
// the lab is to find that out from the run results, not to patch them here.
// Fixes live in tests_gap.js.

const h = require("./helpers");

module.exports = [
  {
    id: "T1",
    req: "REQ-01",
    name: "addsTodoAndClearsInput",
    async run(page, url, t) {
      await h.openApp(page, url);
      await h.addTodo(page, "Buy milk");

      t.equal(await h.rowCount(page), 1, "one row in the list");
      t.deepEqual(await h.titles(page), ["Buy milk"], "the title as typed");
      t.equal(await h.inputValue(page), "", "input cleared after Enter");
    },
  },

  {
    id: "T2",
    req: "REQ-02",
    name: "trimsLeadingWhitespace",
    async run(page, url, t) {
      await h.openApp(page, url);
      await h.addTodo(page, "   Buy milk");

      t.deepEqual(await h.titles(page), ["Buy milk"], "leading spaces stripped");
    },
  },

  {
    id: "T3",
    req: "REQ-03",
    name: "rejectsEmptyTitle",
    async run(page, url, t) {
      await h.openApp(page, url);
      await h.addTodo(page, "");

      t.equal(await h.rowCount(page), 0, "empty title not added");
      t.equal(await h.inputValue(page), "", "input cleared");
    },
  },

  {
    id: "T4",
    req: "REQ-04",
    name: "completingUpdatesRowAndCounter",
    async run(page, url, t) {
      await h.openApp(page, url);
      await h.addTodo(page, "Task 1");
      await h.addTodo(page, "Task 2");

      t.equal(await h.counterText(page), "2 items left", "counter before toggle");

      await h.toggle(page, 0);

      t.equal(await h.isCompleted(page, 0), true, "row marked completed");
      t.equal(await h.counterText(page), "1 item left", "counter counts active only");
    },
  },

  {
    id: "T5",
    req: "REQ-05",
    name: "deleteRemovesTodo",
    async run(page, url, t) {
      await h.openApp(page, url);
      await h.addTodo(page, "Buy milk");

      await h.destroy(page, 0);

      t.equal(await h.rowCount(page), 0, "row removed");
    },
  },

  {
    id: "T6",
    req: "REQ-06",
    name: "activeFilterShowsOnlyActiveItems",
    async run(page, url, t) {
      await h.openApp(page, url);
      await h.addTodo(page, "Still to do");
      await h.addTodo(page, "Already done");
      await h.toggle(page, 1);

      await h.selectFilter(page, "active");

      t.deepEqual(await h.titles(page), ["Still to do"], "only the active item");
      t.equal(await h.selectedFilter(page), "Active", "Active is highlighted");
    },
  },
];
