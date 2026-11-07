package sqa.lab02;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Gap-closing tests, written in Lab 2 for the defects the original six missed.
 *
 * Each one has to pass the two-sided proof the lab demands: red against the
 * build that carries the defect, green against todo.html. A test that is red
 * against both is wrong.
 */
class GapTest extends BaseTest {

    /** Closes build A - trailing whitespace is kept in the stored title. */
    @Test
    @DisplayName("G1 REQ-02 trimsTrailingWhitespace")
    void trimsTrailingWhitespace() {
        addTodo("Buy milk   ");

        // T2 only ever pushed whitespace on the front, so a one-sided strip
        // sailed straight through it.
        assertEquals(List.of("Buy milk"), titles(), "trailing spaces stripped");
    }

    /** Closes build C - delete always removes the first item, not the clicked one. */
    @Test
    @DisplayName("G2 REQ-05 deleteRemovesOnlyTheClickedTodo")
    void deleteRemovesOnlyTheClickedTodo() {
        addTodo("First");
        addTodo("Second");
        addTodo("Third");

        // Delete the middle row. With a one-item list - which is all T5 ever
        // tried - "remove the first item" and "remove the clicked item" are the
        // same thing, which is exactly why T5 was blind.
        destroy(1);

        assertEquals(2, rowCount(), "exactly one row removed");
        assertEquals(List.of("First", "Third"), titles(), "the clicked row is the one gone");
    }

    /** Closes build F - a second item with an existing title is silently dropped. */
    @Test
    @DisplayName("G3 REQ-01 duplicateTitlesAreBothAdded")
    void duplicateTitlesAreBothAdded() {
        addTodo("Buy milk");
        addTodo("Buy milk");

        // Nothing in the original six ever added the same title twice, so a rule
        // the application never had could be bolted on without a single test
        // noticing.
        assertEquals(2, rowCount(), "both items added");
        assertEquals(List.of("Buy milk", "Buy milk"), titles(), "duplicates allowed");
        assertEquals("2 items left", counterText(), "counter sees both");
    }
}
