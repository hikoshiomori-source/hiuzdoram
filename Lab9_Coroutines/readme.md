# Laboratory 9 - Coroutines

Kotlin/JVM, `kotlinx-coroutines-core` 1.10.2, JDK 21.

Every question has its own file and its own package in `src/main/kotlin`, so I
can run them one by one. `Q01.kt` is `q01.Q01Kt`, `Extra1.kt` is
`extra1.Extra1Kt`, and so on:

```
./gradlew run -Pq=q01.Q01Kt
./gradlew run -Pq=extra5.Extra5Kt
```

The two programs that must fail are in `broken/`. They sit outside the source
set, otherwise nothing in the project would build. To get the error text I
copied one of them into `src/main/kotlin`, built once, and deleted it again.

In the error messages below I cut the long absolute path in front of the file
name, the rest is what the compiler printed.

---

## Suspending vs blocking (my own explanation)

```
BLOCKING - Thread.sleep, Thread.join, Future.get()

  main:  [ work ][======== sitting inside sleep(300) ========][ work ]
                 ^ the thread is mine and nobody else can use it
                 one thread = one waiting task
                 three waits of 300 ms = 900 ms

  The thread is alive but useless. It keeps its stack and its registers,
  and the OS is the one who wakes it up.

SUSPENDING - delay, or any suspend function that really suspends

  main:  [ A ][ B ][ C ][ A again ][ B again ][ C again ]
            |    |    |      ^
         suspend points      resumed by the dispatcher
                             three waits of 300 ms = about 300 ms

  Here the thread is not parked. The compiler cut my function into pieces at
  every suspension point. When delay() is reached, the function saves "where
  I was" into its Continuation, gives the thread back, and the dispatcher
  runs somebody else on it. Later a timer calls continuation.resumeWith()
  and my function continues from that point, maybe on another thread.

  blocking   = the thread waits
  suspending = the coroutine waits, the thread goes to work somewhere else

  This is why "suspend" does not mean "background thread". It means "I am
  allowed to pause here without holding the thread". And it is why 100000
  coroutines fit on one thread while 100000 threads kill the machine.
```

---

## Question 1. First coroutine

```
Order accepted
Coffee ready
```

`launch` only creates the coroutine and puts it in the dispatcher queue, it does
not run the body on the spot. So `runBlocking` goes on with its own body and
prints `Order accepted` at once. The coroutine gets the thread when the main
body has nothing left to do, and then it still waits 1 second in `delay(1000)`.
`Coffee ready` is not lost, because `runBlocking` does not finish before its
child.

## Question 2. Three baristas

With `delay`:

```
espresso start
tea start
latte start
tea end
latte end
espresso end
```

With `Thread.sleep`:

```
espresso start
espresso end
tea start
tea end
latte start
latte end
```

With `delay` the thread is given back, so it serves the other two baristas while
the first one waits, and the ends come out sorted by waiting time. With
`Thread.sleep` the thread itself is frozen and can serve nobody, so the three
baristas finish strictly one after another. My teammate is wrong.

## Question 3. Chain of suspend functions

```
login started
step 1: user loaded
step 2: password checked
step 3: profile opened
login finished
```

Each function waits 100 ms and only then calls the next one, and the lines come
out in the order I wrote them. Inside one coroutine the code is still read from
top to bottom. `delay` pauses this coroutine, it does not let `checkPassword()`
overtake `loadUser()`. Concurrency appears when I write `launch` or `async`, not
when I write `suspend`.

## Question 4. Calling suspend from normal code

The broken version is `broken/Q04_broken.kt`. The compiler says:

```
e: Q04_broken.kt:14:16 Suspend function 'suspend fun loadUser(): String' should be called only from a coroutine or another suspend function.
```

`Q04.kt` has both fixes. Output:

```
fix 1 (suspend caller) -> Ada
fix 2 (runBlocking) -> Ada
```

Fix 1: mark the caller `suspend` too. The problem moves one level up, until
somebody up there is a real coroutine.

Fix 2: a normal function opens its own coroutine with `runBlocking { }`.

Fix 2 is the one I would never use on the Android UI thread. `runBlocking`
blocks the thread that called it until everything inside is done, so the
interface would freeze for the whole 100 ms, or for three seconds on a slow
network: no drawing, no touches, and then the ANR dialog. On Android I launch
into a scope that already exists, `lifecycleScope` or `viewModelScope`, which is
fix 1 in practice. `runBlocking` belongs in `main()` and in tests.

## Question 5. Suspend is not a thread

```
thread before the call:   main
thread inside suspend fun: main
```

The belief is wrong. Both names are `main`. `suspend` moved nothing anywhere, it
only gave my function the right to pause. The thread is chosen by the
dispatcher, not by the keyword. For another thread I have to ask, for example
`withContext(Dispatchers.IO) { }`.

The hidden parameter the compiler adds is `Continuation`
(`kotlin.coroutines.Continuation`). It is the bookmark that remembers where the
function stopped. The real signature is in Extra 4.

## Question 6. Ten downloads, one thread

```
download 1 started on main
download 2 started on main
download 3 started on main
download 4 started on main
download 5 started on main
download 6 started on main
download 7 started on main
download 8 started on main
download 9 started on main
download 10 started on main
download 1 finished
download 2 finished
download 3 finished
download 4 finished
download 5 finished
download 6 finished
download 7 finished
download 8 finished
download 9 finished
download 10 finished
```

All ten `started` lines come before the first `finished` line, so no download
waits for another one to end.

This is concurrency, not parallelism. The thread name is `main` in all ten
lines, so there is one thread, and one thread runs one instruction at a time.
Nothing happens at the same physical moment, the coroutines only take turns:
each one runs a bit, hits `delay`, gives the thread back, and the thread picks
the next one. Parallelism needs several threads on several cores, for example
`Dispatchers.Default`, and then the output would show names like
`DefaultDispatcher-worker-1`.

## Question 7. Order of launch

My prediction before running: `1 4 2 5 3`.

```
1
4
2
5
3
```

The prediction was right. `2` does not come right after `1` because `launch`
only schedules the block. The thread is busy with the `runBlocking` body, and a
coroutine cannot take a thread that is already working, it has to wait for a
suspension point. So the body prints `4` and reaches `delay(50)`. There it
releases the thread, the dispatcher takes the waiting coroutine and prints `2`,
and that coroutine hits `delay(100)` and releases the thread as well. At 50 ms
the main body wakes up and prints `5` and ends, `runBlocking` waits for the
child, and at 100 ms the child prints `3`.

## Question 8. Parent waits for child

```
parent body done
child done
report completed
```

The rule is that a parent coroutine always waits for all its children. A
coroutine is not `Completed` when its own body ends, it is only `Completing`. It
is really completed when the last child in its `Job` tree is completed.
`report.join()` waits for that real completion, so `report completed` cannot
come before `child done`, even though the parent body finished 200 ms earlier.

## Question 9. Screen closed, requests cancelled

```
request 1 started
request 2 started
request 1 cleaned up
request 2 cleaned up
end
```

Neither `request 1 finished` nor `request 2 finished` is printed, the coroutines
never reached those lines.

I cancelled only the parent, but cancellation goes down the whole tree:
cancelling a `Job` cancels its children. Every child `Job` is registered in the
parent, so the parent puts them all into `Cancelling`. At the next suspension
point, here `delay(1000)`, each child throws `CancellationException`. `delay` is
cancellable, so the exception passes through my `try`, `finally` runs and prints
the cleanup line, and the coroutine dies. `cancelAndJoin()` also waits until all
of that is over, which is why `end` is the last line.

## Question 10. Profile ready

```
settings loaded
avatar loaded
Profile ready
end of main
one more coroutine done
```

`coroutineScope` is a suspend function. It suspends the caller and returns only
when every coroutine started inside it is finished, so `Profile ready` comes
after both loads without any `join`.

`launch` is a builder. It returns a `Job` at once and the code after it runs
straight away, so `end of main` beats `one more coroutine done`.

The difference: `coroutineScope` waits for its children at the place where it is
written, `launch` only starts a child and leaves the waiting to whoever owns the
scope, here `runBlocking` at the very end.

## Question 11. Reusable counter

```
launched
counter A -> 1
counter B -> 1
counter A -> 2
counter B -> 2
counter A -> 3
both counters are over
```

`launched` is printed before any number, because `startCounter` returns as soon
as `launch` has queued the coroutine.

The `CoroutineScope` receiver is needed because `launch` is an extension
function on `CoroutineScope`. With a plain `fun startCounter(...)` there is no
`this` of that type and the code does not compile, which is exactly the error in
Extra 3. The receiver also decides whose child the new coroutine is: the new
`Job` is attached to the `Job` of the receiver scope. That is how
`coroutineScope { }` in `main` knows it must wait for both counters, and how
cancelling that scope would cancel both of them. With `GlobalScope.launch`
inside the function the counters would belong to nobody, nobody would wait for
them and nobody could cancel them, and that is the leak structured concurrency
is made to prevent.

## Question 12. Returns at once or waits

```
after helper 1
Hello, Linus
Hello, Grace
after helper 2
Hello, Ada
```

`greetInBackground("Ada")` is the extension on `CoroutineScope`. `after helper 1`
is printed immediately, so this one returns at once, and its greeting appears at
the very end, 300 ms later.

`greetAll(listOf("Linus", "Grace"))` is the suspend function with
`coroutineScope`. Both greetings appear before `after helper 2`, so this one
waits for its children.

## Question 13. Five builders

```
launch           -> StandaloneCoroutine, it is a Job
async            -> DeferredCoroutine, it is a Deferred
child inside coroutineScope done
coroutineScope   -> a String I returned myself
await on Deferred-> 42
runBlocking      -> another String I returned myself
```

I print the class name and not the object itself, because the object also prints
a hash code like `StandaloneCoroutine{Active}@4f3f5b24`, which changes on every
run.

Cheat sheet:

| builder | returns | blocks the thread? | waits for children? | where I can call it |
|---|---|---|---|---|
| `runBlocking { }` | the last expression of the block (`T`) | yes, the calling thread sits here until everything inside is done | yes | from normal code: `main`, tests |
| `launch { }` | `Job`, no value | no, returns at once | no, but the scope does | needs a `CoroutineScope` receiver |
| `async { }` | `Deferred<T>`, a `Job` with a result | no, returns at once | no, `.await()` is what waits | needs a `CoroutineScope` receiver |
| `coroutineScope { }` | the last expression of the block (`T`) | no, it suspends the caller | yes, that is what it is for | only from a suspend function or a coroutine |
| `withContext(ctx) { }` | the last expression of the block (`T`) | no, it suspends the caller | yes, it is a scope too | only from a suspend function or a coroutine |

How I remember it: `runBlocking` is the bridge from normal code and the only one
that really blocks a thread. `launch` and `async` start something and come back
at once, the first without a result and the second with one. `coroutineScope`
and `withContext` start something and wait for it, and `withContext` is
`coroutineScope` plus "do it on this dispatcher".

## Question 14. Job or Deferred

```
launch gave me a StandaloneCoroutine and a Job has no .await()
so I had to keep the number in an outside variable: 42
async gave me a DeferredCoroutine
deferred.await() = 42
```

`launch` cannot give a result because it returns a `Job`, and `Job` carries no
value. The block is typed `suspend CoroutineScope.() -> Unit`, so the `6 * 7`
inside it is thrown away. `job.join()` returns `Unit`: it tells me when the work
is over, not what came out of it. The only way to get the number is a side
effect like the `sideResult` variable above, which is ugly and not thread safe.

`Job` is the handle of a coroutine as a task. It knows the lifecycle
(`isActive`, `isCompleted`, `isCancelled`), it can be cancelled with `cancel()`
and waited for with `join()`, and it is the node that holds the parent-child
tree together. It has no result.

`Deferred<T>` is a `Job` plus a promised value: `interface Deferred<out T> : Job`.
It has everything a `Job` has and `await()` on top, which suspends until the
value is ready and then returns it, or rethrows the exception that killed the
coroutine.

So I use `launch` for work I only need done, and `async` for work whose answer I
need.

## Question 15. Three exports in a scope

```
Start
Y
Z
X
All done
```

This is the required order. There is no `join` and no `delay` in the main body,
`coroutineScope` is the only thing that waits, because it does not return before
X, Y and Z are all finished. The three exports run concurrently on one thread,
so they print in the order of their waiting times (Y 100 ms, Z 200 ms, X
300 ms), not in the order I wrote them.

---

# Extra questions

## Extra 1. Delay or sleep: measure it

```
three delay(300)      took about 300 ms
three Thread.sleep(300) took about 900 ms
```

The project manager is wrong. It is the same single thread in both
measurements, but the two waits are different things.

`delay(300)` suspends: the coroutine registers a wake-up in the dispatcher timer
and gives the thread back. Coroutine 1 says "wake me at 300" and leaves, then
coroutine 2 and 3 do the same, all three inside a fraction of a millisecond. The
three timers run together and at 300 ms all three are resumed, so about 300 ms
in total.

`Thread.sleep(300)` blocks: the coroutine holds the thread while it sleeps. The
dispatcher has no thread left for coroutine 2, so coroutine 2 starts at 300 ms
and coroutine 3 at 600 ms, which gives 900 ms. Three waits of 300 ms cost 900 ms
only when the waits are blocking ones.

## Extra 2. Three levels of coroutines

```
child 1 done
child 2 done
grandchild done
scope done
```

The tree:

```
runBlocking
└── coroutineScope          suspends main until the whole subtree is done
    ├── child 1             no delay in the body, prints at once
    │   └── grandchild      delay(200), prints third
    └── child 2             delay(100), prints second
```

`child 1 done` is first because child 1 has no `delay` at all: it queues the
grandchild and prints immediately. `child 2 done` comes at 100 ms and
`grandchild done` at 200 ms.

`scope done` is last because of two rules together. Child 1 is not completed
when its body ends, it stays `Completing` until the grandchild is done, so the
tree is only finished at 200 ms. And `coroutineScope` is a suspend function that
does not return before its whole subtree is completed, so the line after it
cannot run earlier. Completion walks up from the leaves: grandchild, child 1,
scope, my print.

## Extra 3. No scope, no launch

The broken version is `broken/Extra3_broken.kt`. The compiler says:

```
e: Extra3_broken.kt:10:5 'fun launch(context: CoroutineContext = ..., start: CoroutineStart = ..., block: suspend CoroutineScope.() -> Unit): Job' is deprecated. 'launch' can not be called without the corresponding coroutine scope. Consider wrapping 'launch' in 'coroutineScope { }', using 'runBlocking { }', or using some other 'CoroutineScope'.
```

1.10.2 keeps a deprecated stub of `launch` without a receiver, with level
`ERROR`, only to print this readable text instead of `Unresolved reference`. The
build fails on it anyway, because the level is `ERROR` and not a warning.

`Extra3.kt` fixes it with `runBlocking`, the builder from the first example of
the lecture:

```
main body of runBlocking
now launch has a scope
```

`runBlocking` takes the current thread over and blocks it. It creates a
`BlockingCoroutine` with an event loop on this very thread, runs the block
there, and then keeps the thread spinning that loop and resuming whatever is
ready, until the block and all of its children are completed. Only then it
returns and the thread goes on with the next statement. So it is the bridge
between blocking code and suspending code, and the one builder that must never
run on a UI thread.

## Extra 4. What the compiler sees

The Kotlin source:

```kotlin
suspend fun loadUserById(id: Int): User {
    delay(100)
    return User(id, "user-$id")
}
```

What `Tools > Kotlin > Show Kotlin Bytecode > Decompile` shows, the same thing
`javap -p -s` prints on the compiled class:

```java
public static final Object loadUserById(int id, Continuation<? super User> $completion)

// descriptor: (ILkotlin/coroutines/Continuation;)Ljava/lang/Object;
```

The extra parameter is `Continuation<? super User> $completion`, called
`$continuation` or `$completion` in the decompiled code. The return type is no
longer `User`, it is `java.lang.Object`.

The extra parameter carries the state of the function. The compiler rewrote my
function into a state machine: an inner class `loadUserById$1` extending
`ContinuationImpl`, with an `int label` field and fields for my locals. At every
suspension point the function stores `label` and the locals into that object and
returns the marker `COROUTINE_SUSPENDED`. That is why the return type became
`Object`, the method can return either the real `User`, when it managed to
finish without suspending, or that marker. When the 100 ms are over, whoever was
waiting calls `$completion.resumeWith(Result.success(...))`, the method is
entered again, `switch (label)` jumps to the piece after `delay` and the rest of
my code runs. So `Continuation` is the bookmark and the return address of a
suspend function, and that is also why a suspend function can only be called
from another suspend function or a builder: only they have a `Continuation` to
hand over.

Output of `Extra4.kt`:

```
User(id=7, name=user-7)
```

## Extra 5. Greet everybody

```
before
Hello, Ada
Hello, Linus
Hello, Grace
after
```

Ada is name number 1 and waits 100 ms, Linus 200 ms, Grace 300 ms, so here the
greetings come out in list order.

`after` is last because `greetEverybody` is a suspend function whose whole body
is a `coroutineScope`. The three `launch` calls return immediately, but
`coroutineScope` does not: it suspends `main` and resumes only when all three
children are completed, at about 300 ms. Only then `greetEverybody` returns and
`main` can print `after`. With `GlobalScope` instead, or with no scope at all,
`after` would be printed first and the greetings would probably never appear,
because nobody would wait for them.
