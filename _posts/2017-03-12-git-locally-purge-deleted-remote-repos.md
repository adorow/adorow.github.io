---
layout: post
title: Purging local branches that are tracking remotely deleted branches
tags: [git, cli]
---

At work, since we usually use feature branches and pull requests to change the master branche, and then release new features, it often happens that I'll get a few stale local branches for which the remote branch has already been deleted.
In the beginning I was going for the simple and tedious answer, which was pretty much check what's still alive, and delete the other branches manually.
{% highlight shell %}
$ git branch -d branch_name
{% endhighlight %}

Obviously, turns out that that's not very convenient. There's probably a better way of doing this, and possibly with a one-liner.
Sure there is! Some discussion in [StackOverflow](http://stackoverflow.com/questions/17983068/delete-local-git-branches-after-deleting-them-on-the-remote-repo) discusses that also. And comes up with a good solution, but there's still some edge cases.

One of the solutions proposed (with some additions from myself) and I will be deconstructing it below.
{% highlight shell %}
$ git fetch --all --prune && git branch -vv | grep ': gone]' | awk '{ print $1 }' | xargs --no-run-if-empty -n 1 git branch -d
{% endhighlight %}

What is all this doing?
* `git fetch --all --prune`: fetches every remote change, pruning (deleting) remote branches. This does not pull any code change though, so is perfect for this use case;
* `git branch -vv`: displays your branches in a "very verbose" way. Which includes a bracket with the remote branch and some extra info, like " \[origin/feature/abc: gone\]" for when your remote branch has already been deleted;
* `grep ': gone]'`: very simple, display anything containing this text, which means every branch that you have locally, but has been deleted remotely;
* `awk '{ print $1 }'`: prints the first argument of the input;
* `xargs --no-run-if-empty -n 1 git branch -d`: if there are results, run `git branch -d` on the first parameter of input, effectively deleting that branch locally. This command may fail if there are changes locally in this branch, that have not been pushed. To force delete we could use `-D` instead of `-d`.


Creating an alias for this command in your shell is then all you need to reuse this easily in every local repo.