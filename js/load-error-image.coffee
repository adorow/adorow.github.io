---
---

this.loadErrorImage = ->
    imgCnt = 6
    rnd = 1 + Math.floor(Math.random() * imgCnt)
    document.body.style.backgroundImage = "url({{ site.baseurl }}/images/errors/" + rnd + ".gif"
