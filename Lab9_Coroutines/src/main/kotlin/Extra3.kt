package extra3

import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

// Extra 3. No scope, no launch
// The broken version is in ../../../broken/Extra3_broken.kt, it does not compile.
// Fixed with runBlocking, the builder from the first example of the lecture.

fun main() = runBlocking {
    launch {
        delay(100)
        println("now launch has a scope")
    }
    println("main body of runBlocking")
}
