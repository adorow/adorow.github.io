---
layout: post
title: 'Elegant Objects (Volume 1, Chapter 2): a review'
tags: [object-oriented-programming, java, book, review]
---

This is the second post in a series of four, on a look into the book Elegant Objects (Volume 1) by [Yegor Bugayenko](http://www.yegor256.com/).

If you haven't read yet, check out the [Part 1]({{site.baseurl}}/blog/2017/05/28/elegant-objects-volume-1-review-chapter-1) of the series.

## Chapter 2: Education

### 2.1 Encapsulate as little as possible

Here, the author encourages using as few attributes encapsulated per class as possible, arguing that if your class has many, it probably means that some of those properties could be composed into smaller parts, building therefore a tree of objects.

I believe that to be a fair assumption, and it encourages building smaller, more modularized code, that will therefore be easier to maintain and more likely reusable, using aggregation to compose more complex types. You will of course always have use cases where that's not easily accomplished, like when interacting with external systems that have defined their own data structure, but is definitely a good start.

### 2.2 Encapsulate something at the very least

The point here is that, for a class to really have meaning, it needs to encapsulate something. If it doesn't encapsulate anything, it is basically the same as a utility class (which will be discussed later in the book).

Not much to talk about here, the idea makes philosophical sense: if you want to represent something, this thing should have a state to represent it (and not only behavior). 

### 2.3 Always use interfaces

The idea here is something along the lines of: interfaces define behavior (public methods), so if a class has a behavior, it should implement an interface that defines it. And no method in the class can be public without overriding it from an interface.

At a general level this sounds like a good practice, mainly if you are developing  code that someone else will use, like a library. 
If so, you will want the scope of each class to be very well defined, so that you have tight control over how the API you expose can be used.
And you might want your users to be able to modify some of the functionality of the API, by means of implementing one of the interfaces, instead of having to change your code.
But when you're talking about things like microservices, the balance changes a bit.
Adding interfaces to everything can end up creating a plethora of files, for the very limited scope of a service that only has a half dozen files. And you'll see that you are constantly using interfaces that only have a single implementation. 
It can easily turn into over-engineering. 
So, if you're scope is already very limited, and you're not gonna expose any information from your application to anybody else, you should be good with directly defining the classes - this coupling shouldn't be a problem here. Otherwise, go for having well defined interfaces, and it will help in maintainability and extensibility. 

### 2.4 Choose method names carefully

The chapter starts by defining two types of methods:
* Builders: methods that create or build something. Such methods should always return a new object (or primitive type), and are named using nouns, or optionally adjectives + nouns, to give more information about the method;
* Manipulators: methods that change something in the real world. Such methods always return `void`, and are named using verbs, or optionally adverb + verb, for giving more context and information on the name.

First thing that comes to mind, is that this definition is a reimagining of [Functions vs. Procedures](https://stackoverflow.com/questions/721090/what-is-the-difference-between-a-function-and-a-procedure), with a specific definition of how each should be named.

And as we can see, methods that execute changes and also return something, are seen as bad, since following the definitions above, they are being both manipulators and builders at the same time. Let's look at an example, to be more clear. Take the following method:

{% highlight java linenos=table %}
public long save(String text);
{% endhighlight %}

This method is named as a verb, thus it is a manipulator (it is saving the parameter it receives). This method is also a builder though, since it is returning a long, which here could mean the number of bytes written.
For such cases, the book suggests having a class that defines the operation, and that such operation would have two methods, one for applying the change, and another for retrieving the extra data. Or in the book's lingo: one manipulator method, and one builder method. So what I see is that the book suggests something like this:

{% highlight java linenos=table %}
public SaveOperation saveOperation() {
    return new SaveOperation();
}

class SaveOperation {
    
    void save(String text);
    
    long bytesWritten();
    
}
{% endhighlight %}

While the idea of having a different class representing the operations is interesting, I think the way this gets represented doesn't really explain so well what's going on. 
This operation class that was created now has two methods, and they depend on each other. If you call for instance the `save` method twice, what do you expect `bytesWritten` to return? The last result? And aggregation of every call? It is not clear.
So here I would rather expect us to have a log of operations, which contain results of what has happened so far, like something like this:

{% highlight java linenos=table %}
class SaveOperation {
    
    void save(String text);
    
    OperationLog operationLog();

}
class OperationLog {
    List<OperationStats> operations();
    AggregatedStats aggreagatedStatistics();
}
{% endhighlight %}

or just have the save return a set of stats for the operation, which is at least a bit clearer than the long returned initially:
{% highlight java linenos=table %}
OperationStats save(String text);

class OperationStats {
    long bytesWritten();
}
{% endhighlight %}

This approach is very close to the original though, with some more classes, but clearer intents in my opinion. But still against the ideas in the book.


#### 2.4.1 Builders are nouns

This part is in a way a continuation of what has been mentioned on the first part of the [first chapter]({{site.baseurl}}/blog/2017/05/28/elegant-objects-volume-1-review-chapter-1).

Is argued here, that we often keep a procedural mindset when creating and naming an object's behaviour. By giving method names something that resembles "what to do" or "how to do" something, rather than as describing "what we need", ending up with methods that look like functions from procedural languages.

For example, we often give the name _read_ to a method that gets us the contents of a file.
Here it is suggested that we should rather define method names by what we want to get from them, like for example _contents_ in the prior use case.
The idea that I see here is, by naming in this way, we give only a clue of what you want to get as result (which is actually what we care about), instead of hinting into how that should occur. I don't care if you have to _read_ the file contents from the file system, or if you're downloading it from a server, or if it is all cached already, I just want the contents of it and doesn't matter how that's accomplished. 
Is an interesting way to approach it. From a certain perspective, it is a way to decouple the Objects design from the actual implementation details. 

#### 2.4.2 Manipulators are verbs

Here it expands on the previous point, by talking about what is called in this book _manipulators_. By basically mentioning that those should be named with verbs, and not have a return value (therefore a procedure). 

The author mentions here again to be _in general_ against the builder pattern, because it encourages to create bigger, less cohesive and less maintainable classes.
Is a fair point when designing new objects, but you are not always in control of that - often you deal with legacy or integration with other systems. I encourage the use of the builder pattern every time you have a larger object. If you have the control, sure, go and try to refactor and make your objects more cohesive, but otherwise, use a builder so you know exactly what parameters are being passed during creation of an object. Don't have ten parameters in a constructor. JUST DON'T. Especially when you have more than one parameter of the same type. How do you distinguish what is what in a constructor? If your parameters are named (either via language features, like in [Ruby's keyed arguments](https://chriszetter.com/blog/2012/11/02/keyword-arguments-in-ruby-2-dot-0/), or via Builders with methods setting each parameter separately), you know exactly what you're doing, and you are safe from obscure changes in the constructor's parameter order.

#### 2.4.3 Examples of both

Here it simply combines both of the points above, and makes the following example for writing operations (for which we elaborated a similar example on [2.4](#24-choose-method-names-carefully)):

{% highlight java linenos=table %}
class Document {
    OutputPipe output();
}

class OutputPipe {
    void write(InputStream stream);
    int bytes();
    long time();
}
{% endhighlight %}

If you read the book further, you'll see though that this idea goes against what is gonna e said later on [2.6](#26-be-immutable)).
This `OutputPipe` has to keep and update its state to be able to return the results for `bytes` and `time` later on.
And I haven't seen any information yet on why this was done like that, and what would be proposition to change that so that it fits the ideas provided in the book. 

#### 2.4.4 Boolean results

Here the book extends the concept defined as builders, by saying that boolean results are a special case. Methods that return booleans should be named by adjectives, like _empty_, _readable_ or _negative_.

Quite simple and clear. It suggests using names that would read naturally, improving readability. 

### 2.5 Don't use public constants

The point made here is first that, if you have public constants, you will introduce coupling, because other classes will use these public constants, as well as lose cohesion, since they now depend on another source.

Ok. Now, let's say you got two (or more) classes, and they share some common constant, like a line ending string, or a number that describes the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio).
The book suggests you encapsulate the that constant into a small class, with behavior that will do what you want, instead of being just a dumb literal with no behavior.
Let's see what the line ending would look like:

{% highlight java linenos=table %}
class LineEndingString {
    
    LineEndingString(String str) {
        this.str = str;
    }
    
    public String toString() {
        return String.format("%s\r\n", this.str);
    }
    
}

class UseTheString {
    
    String value = <some value>;
    
    void write(Writer writer) {
        writer.write(new LineEndingString(value));
    }
    
}
{% endhighlight %}

I have two points to make here:

One is that this can be a useful trick to turn _dumb_ things into things with behavior. 
And perhaps see some more potential on those things and find more places where they can be used, and find ways of composing those to accomplish more complex behavior.

The second is that I can see this easily growing out of proportion. 
So I believe that before starting to turn every constant into a class, the first thing to do is figure out if those constants are really on the right place.
Maybe the classes that use them are all part of the same domain, and responsibilities can be shifted to a single place, without the need to adding yet another class to your build.

### 2.6 Be immutable

Talks about mutability vs. immutability have increased in recent years, especially with the increase of more functional style of programming being used in languages like [Scala](https://scala-lang.org) and [Kotlin](https://kotlinlang.org/), and also in different frameworks, like Javascript's [Immutable.js](https://facebook.github.io/immutable-js/).

My own opinion is that immutable objects should be used whenever possible, and whenever it does not imply a complete rewrite of big chunks of your system, of course. Always go for small incremental, manageable changes.
Because using immutable objects do bring benefits on use of use and maintainability. 
See for example the improvement that is all the `java.time.*` API over `java.util.Date` and its friends. 

Of course making the classes immutable is only one of the parts of the improvement, other improvements were separating concerns of those dates, having classes to represent [relative dates](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html), [dates with a time zone](https://docs.oracle.com/javase/8/docs/api/java/time/ZonedDateTime.html), [periods](https://docs.oracle.com/javase/8/docs/api/java/time/Period.html), [durations](https://docs.oracle.com/javase/8/docs/api/java/time/Duration.html) and more.
But is clear to see that it is now much easier to modify a date in Java, and be sure that it won't adversely affect other parts of the system because of shared mutable references.

Now actually going back to the book, an example is given here to make a class immutable, this:

{% highlight java linenos=table %}
class Cash {
    
    private final int dollars;
    Cash(int dollars) {
        this.dollars = dollars;
    }
    
    public Cash mul(int factor) {
        return new Cash(this.dollars * factor);
    }
}
{% endhighlight %}

I like the general design of this, but would rather change the method name to something more clear like _multipliedBy_.

### 2.7 Write tests not documentation

The point here is clear from the title. 
The author says that if your code is simple, and well tested, and your code and tests are clear, ou have instructions and a proof of what your code does. 
And in a much more technical and specific language than written text.

Is a good point to make, and I think it enforces the importance of having well written tests, and spending just as much time in writing tests for your code as you do writing the code itself.

But is also important to understand that only tests will not be enough in every project. 
Let's say you are building a library. Your users won't have access to your tests, only to documentation. So here documentation is very important.
Tests serve as good documentation for you and your peer developers, but not to users of your libraries and APIs, or to the business people in your company. So you actually need to think what fits for what.

### 2.8 Don't mock; use fakes

This chapter proposes that, instead of using mocking libraries like [Mockito](https://github.com/mockito/mockito), we should have _fake_ implementations of every class or interface that would otherwise require mocking.
And that this _fake_ should live inside the interface itself, something like this:

{% highlight java linenos=table %}
interface ExchangeApi {
    
    double current(String currency);
    
    class Fake implements ExchangeApi {
        
        public double current(String currency) {
            return 1.42;
        }
           
    }
}
{% endhighlight %}

While this can be useful, I would rather not have such logic into production code, but rather in tests, as some test source, if I'd use that at all.
In the end this is still mocking, is just not using a large mocking library that uses reflection or AOP to make changes to classes. Is plain and simple static code that does the trick.

Another thing in this chapter is that there's an example of a `Cash` class that contains as a member some `Exchange` service, which would be something that  calls some external API.
For this case, I think that the general design is wrong. 
`Cash` is something that looks more like part of your domain, a domain model object. And as such I would have this object coupled with a service. The service can depend on models (in this case `Cash`), but models shouldn't depend on services.
Because like this you need some mocking or fakes for pretty much every test you write. And if they are decoupled, `Cash` doesn't need to know of any service. Which means that if you write a test for any other functionality that `Cash` might have, those tests will be simple, and will rely exclusively on `Cash` itself.
The service would then only be mocked for other component's test that actually use it. Like a larger business logic that relies on currency exchange for example. 

### 2.9 Keep interfaces short; use smarts

Here a _Smart_ is defined as an inner class of an interface, where this inner class defines methods that extends the capabilities of the interface, for example by defining methods with less parameters, defining that the default values are, instead of leaving that for implementers of the interface to decide.

The thinking behind is that doing so is better than defining multiple methods in the interface itself and leaving to the implementations to decide what to do in each case, and risk having different standards defined for each.
Take this for example:

{% highlight java linenos=table %}
interface Exchange {
    
    float rate(String source, Sring target);
    
    class Smart {
        private final Exchange delegate;
        
        public float toUsd(String source) {
            return this.delegate.rate(source, "USD");
        }
        
        public float eurToUsd() {
            return this.toUsd("EUR");
        }
           
    }
}
{% endhighlight %}

As we can see, we're basically extending the functionality of the interface, but via a separate entity (which in this case is living inside the interface).
I like the approach, but I would rather have it in a separate class altogether, since this is a kind of [Facade](https://en.wikipedia.org/wiki/Facade_pattern) for the API. 
It knows how the API works, and applies some specific behavior to it.
Other option, for Java at least, would be to use the _default_ keyword. This should also be used carefully though, because if we add these methods above as default methods in the interface, will be just adding very specific logic, and many implementations might not be interested in that.
One has to understand the scope of the code to see what fits where. 
For example, while having an equality interface have a negation as default implementation makes sense:

{% highlight java linenos=table %}
interface Equality<T> {
    
    boolean equals(T other);
    
    default boolean notEquals(T other) {
        return !equals(other);
    }
    
}
{% endhighlight %}

Having all those extra methods on the Exchange interface wouldn't make sense as default interface methods, they are too specific to certain business cases. 
So those make more sense to live in a separate space. 
And since they are an extension to that, for special business logic, I would prefer to have them in a separate class altogether.


If you are enjoying this review, leave a comment, and keep an eye on for the next two parts!

If you are interested in the book, it is available on [amazon.com](http://amzn.to/2qOrGNj) and [amazon.de](http://amzn.to/2qO5wuI).