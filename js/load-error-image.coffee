---
---

this.loadErrorImage = ->
    imgCnt = 8
    rnd = 1 + Math.floor(Math.random() * imgCnt)
    document.body.style.backgroundImage = "url({{ site.baseurl }}/images/errors/" + rnd + ".gif"
