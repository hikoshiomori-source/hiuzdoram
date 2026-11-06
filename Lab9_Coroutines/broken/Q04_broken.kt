package q04broken

import kotlinx.coroutines.delay

// Question 4. This is the version that does not compile.
// A normal (not suspend) function tries to call a suspend function.

suspend fun loadUser(): String {
    delay(100)
    return "Ada"
}

fun showProfile() {
    val user = loadUser()        // <-- compile error here
    println(user)
}
