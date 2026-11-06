package q14

import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

// Question 14. Job or Deferred

fun main() = runBlocking {
    // launch version: there is no place where the 42 could come out
    var sideResult = 0
    val job = launch {
        sideResult = 6 * 7
    }
    println("launch gave me a ${job::class.simpleName} and a Job has no .await()")
    job.join()
    println("so I had to keep the number in an outside variable: $sideResult")

    // async version: the value comes back through the Deferred
    val deferred = async { 6 * 7 }
    println("async gave me a ${deferred::class.simpleName}")
    println("deferred.await() = ${deferred.await()}")
}
