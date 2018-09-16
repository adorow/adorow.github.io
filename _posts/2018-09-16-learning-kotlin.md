---
layout: post
title: 'Learning Kotlin'
tags: [kotlin, springboot2, introduction-to-algorithms]
---

I've been learning myself some [Kotlin](https://kotlinlang.org/) in the past couple of weeks, and have really enjoyed the journey so far.

I enjoy the syntax, and I enjoy many of the features that the language provides, while keeping pretty much full interoperability with Java.

I might write more in the future about all of it. 
But in the meantime I've been trying to do something to make my learning more applicable.

So far I came up with two small projects to share.

[kotlin-springboot2-example](https://github.com/adorow/kotlin-springboot2-example) is just a basic setup for Kotlin (1.2.61), Maven, Spring Boot 2 and JUnit 5. 
The main driver being how much trouble I had trying to upgrade a Java application with Spring Boot 1.5 to a Kotlin application using Spring Boot 2 (also as an attempt to learn the language).
So in an attempt to help other people not waste time with the boring issues like "JUnit 5 tests are not running properly from Maven", I put a minimalistic package of a very simple webapp that works out of the box, using the tech I mentioned above.

And starting this weekend, I'm creating this [little project](https://github.com/adorow/intro-algorithms-kotlin).
Here my goals is to go through the entire book [Introduction to Algorithms, by Cormen et. al.](https://www.amazon.com/Introduction-Algorithms-International-Thomas-Cormen/dp/0262533057), and implement the algorithms described there in Kotlin, with whatever feature Kotlin might provide.

I own the Third edition of the book for a few years now, and stated reading the book many times, but never really got to read the whole thing. So with this new little project my plan is to go and finally finish reading the book once, and in the meantime learn myself some Kotlin.

I might write a more about the process in the future, but in the meantime I encourage you to check Kotlin out for yourself, as the official website provides some nice [references](https://kotlinlang.org/docs/reference/) for you to do so.
