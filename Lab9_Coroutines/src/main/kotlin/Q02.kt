package q02

import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

// Question 2. Three baristas
// espresso 300 ms, tea 100 ms, latte 200 ms, all on one thread.

suspend fun withDelay(): Unit = coroutineScope {
    launch { println("espresso start"); delay(300); println("espresso end") }
    launch { println("tea start"); delay(100); println("tea end") }
    launch { println("latte start"); delay(200); println("latte end") }
}

suspend fun withThreadSleep(): Unit = coroutineScope {
    launch { println("espresso start"); Thread.sleep(300); println("espresso end") }
    launch { println("tea start"); Thread.sleep(100); println("tea end") }
    launch { println("latte start"); Thread.sleep(200); println("latte end") }
}

fun main() = runBlocking {
    println("=== version with delay ===")
    withDelay()
    println("=== version with Thread.sleep ===")
    withThreadSleep()
}
