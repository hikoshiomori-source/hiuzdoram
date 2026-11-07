// Page-level helpers. Kept deliberately thin: the tests do the asserting.

async function openApp(page, url) {
  await page.goto(url);
  await page.waitForSelector("#new-todo");
}

async function addTodo(page, text) {
  await page.fill("#new-todo", text);
  await page.press("#new-todo", "Enter");
}

// Visible todo titles, in order.
function titles(page) {
  return page.$$eval("#todo-list li label", (els) => els.map((e) => e.textContent));
}

function rowCount(page) {
  return page.$$eval("#todo-list li", (els) => els.length);
}

function counterText(page) {
  return page.$eval("#todo-count", (el) => el.textContent.trim());
}

function inputValue(page) {
  return page.$eval("#new-todo", (el) => el.value);
}

// Is the nth row (0-based) rendered as completed?
function isCompleted(page, n) {
  return page.$$eval(
    "#todo-list li",
    (els, i) => (els[i] ? els[i].classList.contains("completed") : null),
    n
  );
}

async function toggle(page, n) {
  const boxes = await page.$$("#todo-list li input.toggle");
  await boxes[n].click();
}

async function destroy(page, n) {
  const buttons = await page.$$("#todo-list li button.destroy");
  await buttons[n].click();
}

async function selectFilter(page, name) {
  await page.click("#filter-" + name);
  // The app re-renders from the hashchange event, which fires after the click
  // returns. render() sets the list and the selected class in the same pass, so
  // waiting for the class is a sound sync point: without it the assertions race
  // the re-render and the test is flaky against every build, clean included.
  await page.waitForFunction(
    (id) => {
      const el = document.getElementById(id);
      return !!el && el.classList.contains("selected");
    },
    "filter-" + name
  );
}

// The label of the single highlighted filter, or null if not exactly one.
function selectedFilter(page) {
  return page.$$eval(".filters a", (els) => {
    const sel = els.filter((e) => e.classList.contains("selected"));
    return sel.length === 1 ? sel[0].textContent.trim() : null;
  });
}

module.exports = {
  openApp,
  addTodo,
  titles,
  rowCount,
  counterText,
  inputValue,
  isCompleted,
  toggle,
  destroy,
  selectFilter,
  selectedFilter,
};
