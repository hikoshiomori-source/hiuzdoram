package q11

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

// Question 11. Reusable counter

fun CoroutineScope.startCounter(name: String, upTo: Int): Job = launch {
    for (i in 1..upTo) {
        delay(100)
        println("$name -> $i")
    }
}

fun main() = runBlocking {
    coroutineScope {
        startCounter("counter A", 3)
        startCounter("counter B", 2)
        println("launched")
    }
    println("both counters are over")
}
