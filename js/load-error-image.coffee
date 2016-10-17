---
---

this.loadErrorImage = ->
    rnd = 1 + Math.floor(Math.  random() * 3)
    document.body.style.backgroundImage = "url({{ site.baseurl }}/images/errors/" + rnd + ".gif"
