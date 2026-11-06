package extra5

import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

// Extra 5. Greet everybody

suspend fun greetEverybody(names: List<String>) = coroutineScope {
    for ((index, name) in names.withIndex()) {
        val number = index + 1
        launch {
            delay(number * 100L)
            println("Hello, $name")
        }
    }
}

fun main() = runBlocking {
    println("before")
    greetEverybody(listOf("Ada", "Linus", "Grace"))
    println("after")
}
