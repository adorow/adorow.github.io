---
layout: post
title: 'Elegant Objects (Volume 1, Chapter 3): a review'
tags: [object-oriented-programming, java, book, review]
---

This is the third post in a series of four, on a look into the book Elegant Objects (Volume 1) by [Yegor Bugayenko](http://www.yegor256.com/).

If you haven't read yet, check out parts [1]({{site.baseurl}}/blog/2017/05/28/elegant-objects-volume-1-review-chapter-1) and [2]({{site.baseurl}}/blog/2017/06/18/elegant-objects-volume-1-review-chapter-2) of the series.

## Chapter 3: Employment

### 3.1 Expose fewer than five public methods

The point conceived here is that smaller classes are easier to maintain and test. 
Since there are fewer things to test, fewer things to understand, fewer conditions possible.

I can't argue with that. 
The less things a class does, the more cohesive it is, and the more together the things it does belong.
[KISS](http://people.apache.org/~fhanik/kiss.html).

### 3.2 Don't use static methods

In simple words, it is argued that _static_ methods make software less maintainable. The next paragraphs will elaborate parts of this discussion.

One of the arguments is that in OOP we shouldn't use an imperative style, i.e. the code shouldn't look like instructions on how to perform a task, like:

{% highlight java linenos=table %}
public static int max(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}
{% endhighlight %}

but rather have the code look like we're simply defining what it is, in other words, a more functional style. 
The book suggests something like this:

{% highlight java linenos=table %}
class Max extends Number {
    private final Number a;
    private final Number b;
    public Max(Number a, Number b) {
        this.a = a;
        this.b = b;
    }
}
{% endhighlight %}

This type of construct can be useful in some cases.
I think it looks a bit unnatural in here (I mean, Max is not a Number...), but is some direction. I'd personally not make itself a Number, I don't think that makes sense.
A good thing about this though is that it brings a slightly better testability.
From here on we can also make it more extensible. If _Max_ would rather be an interface, we could have it extended with different implementations later, and thus more reusable.


Utility classes (classes that only contain static methods) are specially discouraged here. 
Such as _java.lang.Math_ and many of the [Apache Commons](https://commons.apache.org/) libraries.
While I can see benefit of turning everything into objects, I wouldn't dwell too much on it. 
Static methods can be convenient and good enough for many cases. So my approach would rather be: go with the easy one, and once you need to improve it, refactor.


### 3.3 Never accept _NULL_ arguments

I agree with this one. And this has been discussed extensively in books like [Clean Code](http://amzn.to/2vL89Nb) and [The Pragmatic Programmer](http://amzn.to/2uK8KSk).

There are better design alternatives than handling _null_ in the code. 

The book gives a nice example of a method for returning files in a folder based on a mask. Where the original method had a signature like this:

{% highlight java linenos=table %}
public Iterable<File> find(String mask);
{% endhighlight %}

And with a signature like this, would be common to see some implementation dealing with a _null_ mask in some special way, like returning all files without doing any filter.
Problem is that any special behaviour here is not really intuitive. 
The better approach would be to fail on a _null_ parameter, and have a better design in general to make more obvious what can be expected.
The author proceeds to suggest this new version:

{% highlight java linenos=table %}
interface Mask {
    boolean matches(File file);
}

public Iterable<File> find(Mask mask);
{% endhighlight %}

Now you have something more obvious, where you have something that is a mask (or filter) for files, and you return anything that matches it.
From here on you can make the masks that you want, like a mask that simply returns every file, a mask that takes [glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)) as the original implementation probably expected, or even other filters based on file size or anything else.
The new designed offered many more possibilities of extension, and now a lot more functionality can be added without ever touching the original find method ([Open/closed principle](https://en.wikipedia.org/wiki/Open/closed_principle)).

### 3.4 Be loyal and immutable, or constant

I've got a big concern from this chapter.

Check this example out:

{% highlight java linenos=table %}
class ImmutableList<T> {
    private final List<T> items = new LinkedList<>();
    void add(T number) {
        items.add(number);
    }
    Iterable<T> iterate() {
        return Collections.unmodifiableList(items);
    }
}
{% endhighlight %}

*THIS IS NOT IMMUTABLE*.

Is very simple. Doesn't matter if your fields are _final_ or not. 
Or if the references held by your object are never changed.
If you modify an object that is part of your state, your state changes.
Calling _add_ modifies the list of items that this "immutable" list represents.
Which means that the state of the "ImmutableList" changes.
Which means it is _NOT IMMUTABLE_.

### 3.5 Never use getters and setters

It is mentioned here that getters and setters are a bad idea, because they expose the internal structure of an object, due to the way they are named.

While is true that it is a common practice in many places to define getters and setters for every attribute (and maybe overused), this is not always a bad practice.
Many times it is necessary for frameworks to have objects mutable in this way to track changes done to an instance, like usually happens in Hibernate's cache.

So in the end is important to know the context to know how to approach the design. 
If you need plain old getters and setters, do it.
But is also better to have better control over the objects you create, so is better to keep those POJOs as close to where they are needed as possible.
And beyond that have objects where you can have better control, and that can't be modified by every other user.

### 3.6 Don't use new outside of secondary ctos

The point here is basically using [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection), rather than instantiating dependencies inside the class.
There is not much to discuss here, since this topic has already been extensively [discussed](https://martinfowler.com/articles/injection.html).

### 3.7 Avoid type introspection and casting

This is about avoiding casting and keywords like Java's _instanceof_. 
The reason being that this introspection is actually creating an implicit dependency, a given example is:

{% highlight java linenos=table %}
public <T> int size(Iterable<T> iterable) {
    if (iterable instanceof Collection<T>) {
        return ((Collection<T>) iterable).size();
    }
    int size = 0;
    for (T each : iterable) {
        size++;
    }
    return size;
}
{% endhighlight %}

A better solution would be to actually have this distinction explicit, by overloading the method to have two separate implementations:

{% highlight java linenos=table %}
public <T> int size(Collection<T> collection) {
    return collection.size();
}

public <T> int size(Iterable<T> iterable) {
    int size = 0;
    for (T each : iterable) {
        size++;
    }
    return size;
}
{% endhighlight %}

This way the calling code does not have to be changed, and we make explicit that we do have different implementations for the algorithm based on the types.


If you are enjoying this review, leave a comment, and keep an eye on for the next and final part!

If you are interested in the book, it is available on [amazon.com](http://amzn.to/2qOrGNj) and [amazon.de](http://amzn.to/2qO5wuI).

If you liked this post, check the rest of the series:
* [Part 4]({{site.baseurl}}/blog/2017/07/30/elegant-objects-volume-1-review-chapter-4)