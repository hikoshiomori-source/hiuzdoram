package extra1

import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlin.system.measureTimeMillis

// Extra 1. Delay or sleep: measure it

fun roundToHundreds(ms: Long): Long = (ms + 50) / 100 * 100

suspend fun threeDelays() = coroutineScope {
    repeat(3) { launch { delay(300) } }
}

suspend fun threeSleeps() = coroutineScope {
    repeat(3) { launch { Thread.sleep(300) } }
}

fun main() = runBlocking {
    val withDelay = measureTimeMillis { threeDelays() }
    val withSleep = measureTimeMillis { threeSleeps() }
    println("three delay(300)      took about ${roundToHundreds(withDelay)} ms")
    println("three Thread.sleep(300) took about ${roundToHundreds(withSleep)} ms")
}
