package q03

import kotlinx.coroutines.delay

// Question 3. Chain of suspend functions
// load the user -> check the password -> open the profile

suspend fun loadUser() {
    delay(100)
    println("step 1: user loaded")
    checkPassword()
}

suspend fun checkPassword() {
    delay(100)
    println("step 2: password checked")
    openProfile()
}

suspend fun openProfile() {
    delay(100)
    println("step 3: profile opened")
}

suspend fun main() {
    println("login started")
    loadUser()
    println("login finished")
}
