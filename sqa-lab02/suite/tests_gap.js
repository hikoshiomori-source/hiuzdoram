// Gap-closing tests, written in Lab 2 for the defects the original six missed.
//
// Each one has to pass the two-sided proof the lab demands:
//   red against the build that carries the defect, green against todo.html.
// A test that is red against both is wrong, and the matrix in REPORT.md is
// there to show that this is not the case for any of them.

const h = require("./helpers");

module.exports = [
  {
    id: "G1",
    req: "REQ-02",
    name: "trimsTrailingWhitespace",
    closes: "build A - trailing whitespace is kept in the stored title",
    async run(page, url, t) {
      await h.openApp(page, url);
      await h.addTodo(page, "Buy milk   ");

      // T2 only ever pushed whitespace on the front, so a one-sided strip
      // sailed straight through it.
      t.deepEqual(await h.titles(page), ["Buy milk"], "trailing spaces stripped");
    },
  },

  {
    id: "G2",
    req: "REQ-05",
    name: "deleteRemovesOnlyTheClickedTodo",
    closes: "build C - delete always removes the first item, not the clicked one",
    async run(page, url, t) {
      await h.openApp(page, url);
      await h.addTodo(page, "First");
      await h.addTodo(page, "Second");
      await h.addTodo(page, "Third");

      // Delete the middle row. With a one-item list - which is all T5 ever
      // tried - "remove the first item" and "remove the clicked item" are the
      // same thing, which is exactly why T5 was blind.
      await h.destroy(page, 1);

      t.equal(await h.rowCount(page), 2, "exactly one row removed");
      t.deepEqual(await h.titles(page), ["First", "Third"], "the clicked row is the one gone");
    },
  },

  {
    id: "G3",
    req: "REQ-01",
    name: "duplicateTitlesAreBothAdded",
    closes: "build F - a second item with an existing title is silently dropped",
    async run(page, url, t) {
      await h.openApp(page, url);
      await h.addTodo(page, "Buy milk");
      await h.addTodo(page, "Buy milk");

      // Nothing in the original six ever added the same title twice, so a rule
      // the application never had could be bolted on without a single test
      // noticing.
      t.equal(await h.rowCount(page), 2, "both items added");
      t.deepEqual(await h.titles(page), ["Buy milk", "Buy milk"], "duplicates allowed");
      t.equal(await h.counterText(page), "2 items left", "counter sees both");
    },
  },
];
