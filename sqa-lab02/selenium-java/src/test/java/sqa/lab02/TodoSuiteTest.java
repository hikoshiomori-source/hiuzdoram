package sqa.lab02;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * The original six tests from Assignment 1, one per requirement.
 *
 * Preserved exactly as they were written before the broken builds were opened.
 * Three of them turn out to be weaker than they look; the finding is the point
 * of the lab, so they are not patched here. Fixes live in GapTest.
 */
class TodoSuiteTest extends BaseTest {

    @Test
    @DisplayName("T1 REQ-01 addsTodoAndClearsInput")
    void addsTodoAndClearsInput() {
        addTodo("Buy milk");

        assertEquals(1, rowCount(), "one row in the list");
        assertEquals(List.of("Buy milk"), titles(), "the title as typed");
        assertEquals("", inputValue(), "input cleared after Enter");
    }

    @Test
    @DisplayName("T2 REQ-02 trimsLeadingWhitespace")
    void trimsLeadingWhitespace() {
        addTodo("   Buy milk");

        assertEquals(List.of("Buy milk"), titles(), "leading spaces stripped");
    }

    @Test
    @DisplayName("T3 REQ-03 rejectsEmptyTitle")
    void rejectsEmptyTitle() {
        addTodo("");

        assertEquals(0, rowCount(), "empty title not added");
        assertEquals("", inputValue(), "input cleared");
    }

    @Test
    @DisplayName("T4 REQ-04 completingUpdatesRowAndCounter")
    void completingUpdatesRowAndCounter() {
        addTodo("Task 1");
        addTodo("Task 2");

        assertEquals("2 items left", counterText(), "counter before toggle");

        toggle(0);

        assertTrue(isCompleted(0), "row marked completed");
        assertEquals("1 item left", counterText(), "counter counts active only");
    }

    @Test
    @DisplayName("T5 REQ-05 deleteRemovesTodo")
    void deleteRemovesTodo() {
        addTodo("Buy milk");

        destroy(0);

        assertEquals(0, rowCount(), "row removed");
    }

    @Test
    @DisplayName("T6 REQ-06 activeFilterShowsOnlyActiveItems")
    void activeFilterShowsOnlyActiveItems() {
        addTodo("Still to do");
        addTodo("Already done");
        toggle(1);

        selectFilter("active");

        assertEquals(List.of("Still to do"), titles(), "only the active item");
        assertEquals("Active", selectedFilter(), "Active is highlighted");
    }
}
