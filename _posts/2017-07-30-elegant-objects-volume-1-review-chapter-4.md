---
layout: post
title: 'Elegant Objects (Volume 1, Chapter 4): a review'
tags: [object-oriented-programming, java, book, review]
---

This is the third post in a series of four, on a look into the book Elegant Objects (Volume 1) by [Yegor Bugayenko](http://www.yegor256.com/).

If you haven't read yet, check out parts [1]({{site.baseurl}}/blog/2017/05/28/elegant-objects-volume-1-review-chapter-1), [2]({{site.baseurl}}/blog/2017/06/18/elegant-objects-volume-1-review-chapter-2) and [3]({{site.baseurl}}/blog/2017/07/23/elegant-objects-volume-1-review-chapter-3) of the series.

## Chapter 4: Retirement

### 4.1 Never return _NULL_

Here's something that's been discussed a lot in books like [Clean Code](http://amzn.to/2vL89Nb).
And I believe it is now commonly agreed that using _null_ in general makes code less maintainable, by adding extra conditions that make our code harder test and use in general.

One interesting thing in this chapter is that it proposes some alternatives to returning _null_: throwing an exception, returning a collection, and using a [Null Object](https://en.wikipedia.org/wiki/Null_Object_pattern).

I believe that throwing an exception is a sensible approach. 
You document how your method behaves, and the user needs to know how to handle the situation.

Returning a collection in the other hand I find to be a very bad solution in this case, since you are telling your user that your method might return multiple things, while in fact it may return zero or one only.
If you want to express that it returns zero or one things, you already have Optional types for that.

And the Null Object pattern is something that I would discourage most of the time. 
Something similar is OK if you have some _enum_ type, for example, and you define an enum constant for an "unknown" or "invalid" result.
Or if it is being used exclusively for some internal state, and never exposed, that would be fine too, at least you are not poisoning your users behaviour, and you can still refactor this code later.
But I find it definitely a terrible approach to define a null business object (say an employee), that would then contain a multitude of methods that suddenly throw exceptions.
This actually goes against the [fail-fast](https://en.wikipedia.org/wiki/Fail-fast) approach that the book is said to encourage in this same chapter.

Other options discouraged in the book are: 
The use of two distinct methods (one checking for existence, and a second that throws an exception when an object is missing); which I think is fine, but you might want to use some kind of cache, or any other kind of O(1) operation here to avoid processing the same code twice; 
And using Java 8's [Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html), which I would actually encourage in cases where you might be building services, since, as I said before, you make your intent clear that your method will return one or zero results at least.

### 4.2 Throw only checked exceptions

Exception handling is an important part of building robust software. 
In this chapter we are presented with some ideas of what the author believes to be a proper exception handling.

To start the [controversy](https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html), the book proposes to only use checked exceptions. 
I believe this comes from simply wanting to make everything super explicit, and giving the responsibility away to the user to treat issues.
The problem comes when every single of your methods throws some kind of exception, then every method you implement will require a _try-catch_ block, and your code will look ugly and harder to understand.
Or even worst, you will be bubbling up all your exceptions with _throws_, just because you don't know how to deal with them! Then all your methods suddenly declare this exception and you don't really know why, because where it rises and where it gets caught are so far away from your code.

In my view the sensible thing to do is create specific exceptions; you can then group them via inheritance, the same way happens with many exceptions that extend IOException for example.

### 4.3 Be either final or abstract

Here it is suggested to always define every method and class as either _final_ or _abstract_. 
It sounds a bit harsh, but the idea behind this is to avoid having methods that get implemented in some way, and then when a new inheriting class is created, that method gets overriden; and what you have now is one method that has multiple implementations along the inheritance chain, and it gets complicated to understand what should be called when.

It is true that that makes it more difficult. But the whole approach sounds to me just a bit too strict and controlling.
I'd prefer to just use common sense and follow something similar to what is also discussed in the chapter: 
define interfaces to define behaviour, implement those interfaces with the types you need.
If you were overriding one method via inheritance, it basically means that you need _some_ behaviour that was already defined there.
The best approach here would be to create a new class that implements the interface, and uses the other class via composition rather than inheritance.
Then you are simply encapsulating that behaviour and extending it via the well known [Adapter pattern](https://en.wikipedia.org/wiki/Adapter_pattern).

### 4.4 Use RAII 

In this short chapter, the author mentions [this C++ technique](http://en.cppreference.com/w/cpp/language/raii).
RAII is a way to encapsulate resources into classes, and bind the resource's lifetime to the class', where on the constructor the resource is allocated, and on the destructor the resource is freed.

Java does not have a destructor, the closer it has is the _finalize()_ method. Which can be used also, but the resources are only freed then when the object is garbage collected. 
That's still a good option if you are directly encapsulating some resource, but usually that would be done via input and output streams, but you can anyway always add some code to make sure that resources allocated by your object are closed when the object is garbage collected.

In general the good approach in Java is to use _try-finally_ blocks. Or even better, as the book mentions, [try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) which was added in Java 8.


If you enjoyed this review, leave a comment, I would love to know your opinion!

If you are interested in the book, it is available on [amazon.com](http://amzn.to/2qOrGNj) and [amazon.de](http://amzn.to/2qO5wuI).