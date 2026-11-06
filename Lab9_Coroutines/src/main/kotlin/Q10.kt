package q10

import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

// Question 10. Profile ready

fun main() = runBlocking {
    coroutineScope {
        launch { delay(200); println("avatar loaded") }
        launch { delay(100); println("settings loaded") }
    }
    println("Profile ready")      // the scope already waited for both

    launch { delay(100); println("one more coroutine done") }
    println("end of main")        // launch did not make me wait
}
