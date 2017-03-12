---
layout: post
title: Untracking .gitignored files
tags: [git, cli]
---

I've been using [Git](https://git-scm.com/) for a few years now. Mostly on my [personal projects](https://github.com/adorow) and more recently also professionally.
After using mostly CVS and SVN for around 8 years, I still had very often issues interacting with the tools - commiting, updating, merging, conflicts everywhere, and had to do most of it manually, the tooling didn't provide proper aid for the more complicated parts of the process. 
Plus we would usually have create multiple branches to try to work on the same project, or keep a lot of work locally and commit a bunch of files at once (forcing someone else to deal with the trouble of merging).
 
    
With Git I actually enjoy handling all the tooling. Forking or cloning a project is easy, I can commit my changes locally, work incrementally, and I know that Git will help me solve most of the problems when there's the need to merge everything. Although I still believe that most of the issues I mentioned before came from the work-modus and architectural model of the time rather than the tools themselves, still Git is much more robust and prepared for how modern teams operate. 
And also, it even helps me deal with some troubles that I create for myself.


One of the troubles I create for myself from time to time is having tracked files that I actually want to ignore. 
This happens usually when I create a new project, setup some files, commit and push everything, then later I add a .gitignore that ignores files that I have already tracked.


As I learned from checking Git's [docs](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository) and [this StackOverflow thread](http://stackoverflow.com/questions/1274057/how-to-make-git-forget-about-a-file-that-was-tracked-but-is-now-in-gitignore), Git continues to keep track of files after you add them to the index, even if you start to ignore them afterwards.
You can think of it as: if I add a file to be tracked, means I want to keep tracking it - at least until I say otherwise. If a file is not been tracked, I might want to track it, unless I say I want to ignore it.

Usually, if you just want to get rid of a file, you would simply remove it:

{% highlight shell %}
$ git rm folder/file.ext
{% endhighlight %}

The issue here is that you would completely remove the file from your working tree as well (and therefore it would be completely deleted locally). 
In some cases, like if you actually modified the file in the meantime, you would also need a _-f_ parameter there as well, to force remove it from your working tree.

While all this would be ok if you are just trying to get rid of some file that is always auto-generated at build time, this might not be what you're looking for if you are trying to untrack some local file of your IDE, or a log file that you are using to troubleshoot some issue, that must not be pushed into the central repository.
 
In such cases what you're looking for is a way to remove the file from the index only. And Git provides you with a way to do that:


{% highlight shell %}
$ git rm --cached folder/file.ext
{% endhighlight %}

With this Git will untrack or unstage your file, effectively removing it from the index, but keeping your local file intact.

The _--cached_ option can also be used on _git diff_, where in that case you can see the differences in the files that you have already staged.


All in all, Git is great, and there is just so much more to learn from it.