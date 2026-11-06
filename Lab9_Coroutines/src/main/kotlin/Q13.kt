package q13

import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

// Question 13. Five builders
// I print the type instead of the whole object, because the object also prints
// a hash code that is different on every run.

fun main() {
    val fromRunBlocking = runBlocking {
        val job = launch { delay(50) }
        println("launch           -> ${job::class.simpleName}, it is a Job")

        val deferred = async { 6 * 7 }
        println("async            -> ${deferred::class.simpleName}, it is a Deferred")

        val fromScope = coroutineScope {
            launch { delay(50); println("child inside coroutineScope done") }
            "a String I returned myself"
        }
        println("coroutineScope   -> $fromScope")

        println("await on Deferred-> ${deferred.await()}")
        "another String I returned myself"
    }
    println("runBlocking      -> $fromRunBlocking")
}
