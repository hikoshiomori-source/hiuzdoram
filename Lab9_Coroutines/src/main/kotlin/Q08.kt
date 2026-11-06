package q08

import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

// Question 8. Parent waits for child

fun main() = runBlocking {
    val report = launch {
        launch {
            delay(200)            // compressing the attachments
            println("child done")
        }
        println("parent body done")
    }
    report.join()
    println("report completed")
}
