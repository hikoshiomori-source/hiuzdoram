package sqa.lab02;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Shared setup for the Lab 2 suite.
 *
 * APP_URL below is the ONE line you change between builds. Point it at a build
 * in ../builds/ and re-run. Change nothing else: if you edit a test so that it
 * passes, you have destroyed the evidence you came here to collect.
 *
 *   todo.html                  - clean baseline, all six tests must be green
 *   todo_A.html .. todo_F.html - broken builds, exactly one rule broken each
 */
public abstract class BaseTest {

    /** <<< CHANGE ONLY THIS LINE BETWEEN BUILDS >>> */
    protected static final String BUILD = "todo.html";

    protected static final String APP_URL = buildUrl(BUILD);

    protected WebDriver driver;
    protected WebDriverWait wait;

    private static String buildUrl(String fileName) {
        Path p = Paths.get("..", "builds", fileName).toAbsolutePath().normalize();
        return p.toUri().toString();
    }

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        driver.get(APP_URL);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("new-todo")));
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // ---------- helpers ----------

    protected void addTodo(String title) {
        WebElement input = driver.findElement(By.id("new-todo"));
        input.clear();
        input.sendKeys(title + "\n");
    }

    protected List<WebElement> rows() {
        return driver.findElements(By.cssSelector("#todo-list li"));
    }

    protected int rowCount() {
        return rows().size();
    }

    /** Visible todo titles, in order. */
    protected List<String> titles() {
        // getText() collapses whitespace, which would hide a trailing-space
        // defect completely, so read the DOM property instead.
        return driver.findElements(By.cssSelector("#todo-list li label"))
                .stream()
                .map(e -> e.getDomProperty("textContent"))
                .toList();
    }

    protected String counterText() {
        return driver.findElement(By.id("todo-count")).getText().trim();
    }

    protected String inputValue() {
        return driver.findElement(By.id("new-todo")).getDomProperty("value");
    }

    protected boolean isCompleted(int n) {
        String cls = rows().get(n).getDomAttribute("class");
        return cls != null && cls.contains("completed");
    }

    protected void toggle(int n) {
        driver.findElements(By.cssSelector("#todo-list li input.toggle")).get(n).click();
    }

    protected void destroy(int n) {
        driver.findElements(By.cssSelector("#todo-list li button.destroy")).get(n).click();
    }

    protected void selectFilter(String name) {
        driver.findElement(By.id("filter-" + name)).click();
        // The app re-renders from the hashchange event, which fires after the
        // click returns. render() sets the list and the selected class in the
        // same pass, so waiting for the class is a sound sync point: without it
        // the assertions race the re-render and the test is flaky against every
        // build, clean included.
        wait.until(ExpectedConditions.attributeContains(By.id("filter-" + name), "class", "selected"));
    }

    protected String selectedFilter() {
        List<WebElement> selected = driver.findElements(By.cssSelector(".filters a.selected"));
        return selected.size() == 1 ? selected.get(0).getText().trim() : null;
    }
}
