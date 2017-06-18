---
layout: post
title: 'Elegant Objects (Volume 1, Chapter 1): a review'
tags: [object-oriented-programming, java, book, review]
---

I have started to read Elegant Objects (Volume 1) by [Yegor Bugayenko](http://www.yegor256.com/) after some colleagues have done the same, and started some interesting discussions about the ideas presented in the book.
As I got curious, I got the book for myself to read, and wanted to express my own opinions about the discussed topics. I'm writing it as I read the book, and I will post them as a series of four posts (one per chapter of the book), and my opinion on things might change as I go, as I'm just human. And as I'm writing as I read the book, I might have some edits later on, or simply have some inconsistencies looking back, as I write about the next chapters.
I'm using these posts as documentation for myself, and I hope it can help someone figure out whether they might want to buy the book for themselves, or give some food for thought and generate some discussion.

I'll basically simplify each point made by the author in the beginning of each section, and go on from that explaining what my own opinion is about it. Feel free to disagree, and would be great to see people wth different opinions commenting about the topic.

## So, what is the book all about?

This book is about Object-Oriented Programming, and about how OOP (or perhaps [OOP languages](https://en.wikipedia.org/wiki/List_of_object-oriented_programming_languages)?) have diverged from its [original conception](https://medium.com/skyfishtech/retracing-original-object-oriented-programming-f8b689c4ce50). 
From there it gives some use cases of commonly seen code, and how it can be adapted to follow the guidelines given in the book.

On what I've seen so far, the most used language for writing examples in the book is Java. And as you'll see, some of the points illustrated in the book go exactly against the use of some of these features that are not purely object oriented.
Since this book is about "doing OOP", I'm not gonna dwell so much on that, and instead just leave my personal note here, that I believe programming languages are just tools, and is up to us to use the features that they have in the best way we can. So even though Java (for example) is not purely object oriented, its features can provide other opportunities, and is up to you to use it the best way you can to achieve what you need (or just go for a different language that meets your needs).

With all that said, let's get started!

## Chapter 1: Birth

This chapter is all about anthropomorphizing objects. Giving it life and meaning. 

### 1.1 Never use -er names

In this chapter it gets mentioned that naming things with -er and -or endings is bad practice (some examples: Reader, Processor, Validator, Formatter), because such names don't convey what these objects are, but rather what they do (their behavior).

While I find this idea interesting, I would argue that the approach taken in the example was not really appropriate:
 
{% highlight java linenos=table %}
class Cash {
    private int dollars;
    Cash(int dlr) {
        this.dollars = dlr;
    }
    public String usd() {
        return String.format("$ %d", this.dollars);
    }
}
{% endhighlight %}

Having a `class Cash` with a method `String usd()` to give out a formatted String in dollars doesn't resonate in me as a good approach in general.
It violates the [Open/Closed principle](https://en.wikipedia.org/wiki/Open/closed_principle), since you'll have to add new methods to be able to format the cash in different currencies. And it is still not very speaking to me, since I don't see it as the `Cash`'s responsibility to format its value into different currencies, formatting is a thing on its own. 
So in this specific point I actually think that the `Formatter` acts better in this area, since you only have to change the "thing who formats" when you want to format something new, and not the `Cash` itself.

Still, I'm not saying that the overall approach of the author is bad. In fact, taking the ideas from the author, we can come up with a solution that can take the best of both worlds:

{% highlight java linenos=table %}
class Cash {
    private int amount;
    Cash(int amount) {
        this.amount = amount;
    }
    public int value() {
        return value;
    }
}

class UsdFormat {
    public String formatted(Cash cash) {
        return String.format("$ %d", cash.value());
    }
}
{% endhighlight %}

Now we have separation of concerns, where `Cash` is just cash, and `UsdFormat` is itself a format, and knows what a format looks like (and can additionally have a state representing it, like which symbols it uses for example). In a certain way this is mostly just the old `Formatter` with a new name following the book's principles.

### 1.2 Make one constructor primary

I agree 100% with the basic idea here: have only a single constructor that _actually_ initializes the state of an object, where others would delegate parameters and define default values to the missing parameters. 
This helps avoid redoing, missing or mixing defaults when having multiple constructors for the same object - and thus avoiding silly bugs. 
And a good rule of thumb here is to make more specific constructors (less parameters) call the more generic ones (more parameters).

Some languages, such as Ruby, support [keyword arguments](https://chriszetter.com/blog/2012/11/02/keyword-arguments-in-ruby-2-dot-0/) in methods, so that you can pass a certain arbitrary parameter to the method or constructor, not necessarily following the order in which it appears in its definition, and giving it its exact name, in this way you are able to define a single constructor for all the different parameters.
That, in conjunction with the ability to define default values to parameters, almost eliminates entirely the need for extra constructors.

One thing I don't agree with this part of the book is the practice of adding logic into the constructor, namely having `Cash` have many constructors, allowing for all kinds of formats, where parsing is required within the constructors. More specifically: constructors shouldn't have logic that may incur heavier hidden processing, like parsing or creating connections, for example. To me these constructors should be as dumb as possible, and only perhaps validate that it's given state is actually valid.

For cases where some extra processing is needed, I believe that the best approach is to either:
    
* have a factory method in charge of creating instances, or 
* have `static` methods in the class with meaningful names, where the extra processing would be done in that method, and the proper parameters would be passed to the real constructor.

An additional benefit of the second one is to have clear names defining, for example, states that an object can have. See for example the snippet below:
 
{% highlight java linenos=table %}
class State {
    public static State success() {
        return new State(true, "");
    }
    public static State failure(String message) {
        return new State(false, message);
    }
    private boolean successful;
    private String message;
    private State(boolean successful, String message) {
        this.successful = successful;
        this.message = message;
    }
}
{% endhighlight %}

It is clear from the name of the method what state will the object have when it is created, and each method only exposes the required parameters, while it takes default values for the ones that are irrelevant for that state.
Note that in this particular example the actual constructor is `private`, and only accessible by the `static` factory methods.

I would take a similar approach instead of the book's example, something like `static Cash fromText(String usdAmount)` could have been added to the Cash class instead of the constructor that requires parsing. 
This idea of using static methods though, and using anything `static` at all, is totally condemned in this book, so what do you think?

### 1.3 Keep constructors code-free

The first thing I see here is some contradiction with the previous chapter. In the previous section there were examples of parsing strings within the constructor, so right now the points are quire confusing.

Apart from that, as I already mentioned before, I agree with the idea of keeping constructors clean and logic-free. The less hidden processes happening on the constructor the better.

Especially interesting is the example of encapsulating the "to be evaluated" parameter of type String, into a type `IntegerAsString`:

{% highlight java linenos=table %}
class StringAsInteger implements Number {
    private int num;
    private StringAsInteger(String txt) {
        this.num = Integer.parseInt(txt);
    }
}
{% endhighlight %}

First of all because, being picky with the author's words, "IntegerAsString" doesn't sound like a thing, it is a way to view something else, an [adapter](https://en.wikipedia.org/wiki/Adapter_pattern) if you may.
On the other hand, it does have its advantages. Having such an abstraction makes it easier to embed functionality later to this class. You can for example start caching these values and reuse later. You can also make your parsing become lazy, by only processing it on a call to `intValue`, if you want to delay some process that might never happen, and you do not have the need to [fail-fast](https://martinfowler.com/ieeeSoftware/failFast.pdf) either.

### What to take from what we've seen so far?

The book has made some good points so far, and also adds some others that are a bit dubious IMO. But overall it does reinforce good practices, and gives some food-for-thought and ideas with opinionated approaches, that can be a useful asset on your design tool belt.

I'm looking forward to reading the next chapters and see what other learnings it can bring.

If you are interested in the book, it is available on [amazon.com](http://amzn.to/2qOrGNj) and [amazon.de](http://amzn.to/2qO5wuI).

If you liked this post, you might want to check out:
* [Part 2]({{site.baseurl}}/blog/2017/06/18/elegant-objects-volume-1-review-chapter-2)
 