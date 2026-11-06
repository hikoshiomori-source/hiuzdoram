plugins {
    kotlin("jvm") version "2.1.0"
    application
}

group = "uz.ttpu.lab9"
version = "1.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")
}

kotlin {
    jvmToolchain(21)
}

// ./gradlew run -Pq=q07.Q07Kt picks the question I want to run
application {
    mainClass.set(project.findProperty("q")?.toString() ?: "q01.Q01Kt")
}
