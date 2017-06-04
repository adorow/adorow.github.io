---
layout: post
title: Adding currying to Java 8
tags: [java, jcurry, open-source, functional-programming]
---

One of my favorite things to ever been added to Java was the more functional-style of libraries and data structures introduced in [1.8](http://www.oracle.com/technetwork/java/javase/8-whats-new-2157071.html).
Java had been craving for something like that in the core language features for a while. And Java 8 came with some much needed refreshment.

People have complained about the verbosity of Java for a very long time, and although is not like Java is now the shiniest and slimmest language of them all, it did became much cleaner and nicer in the eyes of a coder. 

Some of the most important improvements that I would cite were: 
* The addition of Streams as a form of (or abstraction for) lazy lists, lazy processing, generators;
* Functional interfaces as a form of functions as higher order citizens;
* Lambda expressions as simplification for anonymous Java classes;
* Optionals as a form of avoiding _null_ and expressing intent of optional data;

One of the reasons why I liked all those changes so much also comes from my interest in functional programming, and more specifically in [Haskell](https://www.haskell.org/). And is nice to see that some of the things I learned from studying FP are now much closer and simpler to achieve in Java. No more creating weird verbose anonymous classes for menial tasks!

And even though a lot of things improved, there were still things that were very helpful in Haskell that I still could not see in Java, even with the new updates. 
So I went researching and found some things. Like [Javaslang](http://www.javaslang.io/) and [jOOλ](https://github.com/jOOQ/jOOL), who introduce things like [Either](http://www.javaslang.io/javaslang-docs/#_either), [Tuples](http://www.javaslang.io/javaslang-docs/#_tuples) and [zipping functions](http://www.javaslang.io/javaslang-docs/#_seq), which are also super useful in the functional programming world. 
Still I couldn't find some other features, like [Currying](https://en.wikipedia.org/wiki/Currying) and [partial application](https://en.wikipedia.org/wiki/Partial_application) (which are implemented to a certain, very limited extent, in Java 8), and decided to do it myself.

First of all, to whomever is unfamiliar with currying, I would define it as:
> Currying is taking a function that takes multiple arguments, and turning it into a chain of one argument functions that return another function with the next argument.

For example take the following Java method:
{% highlight java linenos=table %}
int addThenSubtract(int first, int second, int third) {
    return first + second - third;
}
{% endhighlight %}

it is the same as the following lambda:
{% highlight java linenos=table %}
(int first, int second, int third) -> first + second - third;
{% endhighlight %}

And deconstructed as a series of one argument functions:
{% highlight java linenos=table %}
(int first) -> 
    (int second) ->
        (int third) -> first + second - third;
{% endhighlight %}

Which in Java, could be typed something like:
{% highlight java linenos=table %}
Function<Integer, <Function<Integer, <Function<Integer, Integer>>>>>
{% endhighlight %}

Looks complicated, right?
Well, it shouldn't be. If you take a closer look, you'll notice that this is a function that takes an argument (`int first`) and returns a function that takes another argument (`int second`) and returns a function that takes yet another argument (`int third`) and returns an `int`. Which means you can apply only part of the arguments of the function, and pass that function along.
This can be very useful to, for example, compose smaller functions for libraries that require so, or create `Supplier`s from existing `Function`s, and pass them along to libraries that require `Supplier`s, between others. Basically, you can compose new functions or functionalities from a smaller functionality that you already have. 

With that in mind I started to work on a small project that I called jcurry (I know, not a very creative name).

## So, what is jcurry?

jcurry is basically a small library with a main entry point, a class called `Currying`, with multiple static methods that simple serve to wrap around the existing Java functional interfaces.
This wrapping is basically simply another functional interface with the same name, prefixed with `Currying`. This interface adds some extra methods that are not built-in in the JDK.

## Currying in action

First a disclaimer: Although methods `andThen` and `compose` have been added to more interfaces in jcurry, I will not discuss them here, since the functionality already exists in the JDK, namely in the `Function` interface, and I will just assume here that the functionality there is well understood. 

Now, I will show some of the things that can be done with currying. 

### 1. curry()

This was the main point behind doing this small project, and how it works is very simple: you pass an argument to a function, and it will return you the version of that function that contain on less argument.
In other words, let's say you have a function that takes two parameters (a `java.util.function.BiFunction`); you would pass to `curry` one parameter, and get back an interface equivalent to a single parameter function (`java.util.function.Function`). Or, if you have a single parameter function, you will get back a no-argument function (`java.util.function.Supplier`) back.

Let's see some examples:

{% highlight java linenos=table %}
CurryingFunction<Integer, Integer> minimumOne =
    Currying.biFunction(Integer::max)
        .curry(1);

CurryingFunction<Integer, Integer> maximumFive =
    Currying.biFunction(Integer::min)
        .curry(5);

Function<Integer, Integer> betweenOneAndFive = 
    minimumOne.andThen(maximumFive);

Stream.of(2, 0, -5, 100)
    .map(betweenOneAndFive)
    .forEach(System.out::println);
/* prints:
2
1
1
5 */
{% endhighlight %}

Here we have the JDK functions `Integer.max` and `Integer.min`, and we use them to define a new function, that also takes a single argument, and returns the number, if it is between 1 and 5, or the closes boundary otherwise.
Note that `max` and `min` are `BiFunction`s that have been curried (becoming `Function`s), and the method `andThen` is used to compose the two together. Resulting in comparing the single given parameter to the minimum and maximum values allowed.

{% highlight java linenos=table %}
CurryingSupplier<Integer> boundedRandomGenerator =
    Currying.intFunction(new Random(12345)::nextInt)
        .curry(10);

Stream.generate(boundedRandomGenerator)
    .limit(4)
    .forEach(System.out::println);
/* prints:
1
0
1
8*/
{% endhighlight %}

In the example above we got a `Random`, created with the seed 12345, and then we're encapsulating the `nextInt` method into jcurry's decorator. 
The `nextInt` method has two versions: one without parameters, and one with one parameter which defines the upper bound of the resulting values. We are taking the latter here.
We're currying the value `10`, and getting back a `Supplier`. This supplier is exactly what we need to generate an infinite stream of values using `Stream.generate`. 
So we're doing exactly that - and limiting the number of results of course, because our time in this planet is finite, and we want to finish this post.

### 2. flip()

This one is a very simple, yet quite useful function to have. The only thing it does is exchange the order of two parameters in a BiFunction, BiPredicate or BiConsumer.
Let's take a look.

{% highlight java linenos=table %}
int dividend = 7; int divisor = 5;

CurryingIntBinaryOperator remainderUnsigned =
    Currying.intBinaryOperator(Integer::remainderUnsigned);

System.out.println(
    remainderUnsigned
        .applyAsInt(dividend, divisor)); // prints 2
        
System.out.println(
    remainderUnsigned
        .flip()
        .applyAsInt(dividend, divisor)); // prints 5
{% endhighlight %}

In the above example we take a simple operation, the remainder of two `int`s. And as you can see, there are two separate calls of the function, one with, and the other without `flip`, and as you can see, the order of parameters has changed after flip was called.

We can also use `curry` and `flip` in the same chain of calls:

{% highlight java linenos=table %}
int dividend = 7; int divisor = 5;

CurryingIntBinaryOperator remainderUnsigned =
    Currying.intBinaryOperator(Integer::remainderUnsigned);

System.out.println(
    remainderUnsigned
        .curry(dividend)
        .applyAsInt(divisor)); // prints 2

System.out.println(
    remainderUnsigned
        .flip()
        .curry(dividend)
        .curry(divisor)
        .getAsInt()); // prints 5
{% endhighlight %}

As you can see, currying or not, the results are the same. On a real use case you would of course not be just currying every parameter, that makes no sense, this is just to illustrate how it works.
And I hope that with this it is visible what you can gain with such an approach. Composing small parts of code to build bigger and more complex things is what software is all about. 
It can enable reuse, and an easier adaptation of code between APIs. 

On the downside, this is still not a very simple idiom, and is miles away from what you can see in Haskell, for example. After all, the structure of Java was not built for functional programming. But still, this can bring some other advantages, and maybe spark new thoughts.

## More about the project

The project is super simple, and probably too simple at this point to be of great value in any project. But the ideas are expressed there, and hopefully can be useful to someone stumbling upon them.

The project can be found on my [GitHub](https://github.com/adorow/jcurry) and also on [Maven Central](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22jcurry%22).
