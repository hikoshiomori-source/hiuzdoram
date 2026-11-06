package q12

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

// Question 12. Returns at once or waits

// helper 1: starts a greeter and gives the Job back immediately
fun CoroutineScope.greetInBackground(name: String): Job = launch {
    delay(300)
    println("Hello, $name")
}

// helper 2: greets everybody and comes back only when all of them are printed
suspend fun greetAll(names: List<String>) = coroutineScope {
    for (name in names) {
        launch {
            delay(100)
            println("Hello, $name")
        }
    }
}

fun main() = runBlocking {
    greetInBackground("Ada")
    println("after helper 1")

    greetAll(listOf("Linus", "Grace"))
    println("after helper 2")
}
