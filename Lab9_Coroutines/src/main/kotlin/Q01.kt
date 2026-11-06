package q01

import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

// Question 1. First coroutine
// The cafe must confirm the order at once, the coffee itself takes 1 second.

fun main() = runBlocking {
    launch {
        delay(1000)                  // making the coffee
        println("Coffee ready")
    }
    println("Order accepted")        // this line does not wait for the coffee
}
