package extra3broken

import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// Extra 3. This is the version that does not compile.
// launch is called from a plain main, with no scope at all.

fun main() {
    launch {                     // <-- compile error here
        delay(100)
        println("hello from the coroutine")
    }
}
