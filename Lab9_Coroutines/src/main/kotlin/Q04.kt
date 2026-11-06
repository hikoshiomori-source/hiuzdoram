package q04

import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking

// Question 4. Calling suspend from normal code
// The broken version is kept in ../../../broken/Q04_broken.kt, it does not compile.
// Here are the two fixes.

suspend fun loadUser(): String {
    delay(100)
    return "Ada"
}

// Fix 1: the caller becomes a suspend function as well.
suspend fun showProfileFix1() {
    val user = loadUser()
    println("fix 1 (suspend caller) -> $user")
}

// Fix 2: a normal function opens its own coroutine with runBlocking.
// This one blocks the thread it runs on, so it must never touch the Android UI thread.
fun showProfileFix2() {
    val user = runBlocking { loadUser() }
    println("fix 2 (runBlocking) -> $user")
}

fun main() {
    runBlocking { showProfileFix1() }
    showProfileFix2()
}
