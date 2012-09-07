---
category: post
layout: post
title: Deconstructing Nature - Day 5
---
*My colleague Werner and I are holding a challenge this week to produce one visual work each day. I'm working around the theme of "Deconstructing Nature".*

[Day 1](/deconstructing-nature-day-1) | [Day 2](/deconstructing-nature-day-2) | [Day 3](/deconstructing-nature-day-3) | [Day 4](/deconstructing-nature-day-4) | [Day 5](/deconstructing-nature-day-5)

For the last day I wanted to do something with *human* nature. And there is no better place on the internet to watch human nature decompose than [4chan](http://www.4chan.org/) (Warning: Not Safe For Work!). The website is a huge image board on a large number of topics ranging from Anime to Politics.

And then there's the "random" image board, also known as /b/, also known as the cesspool of the internet. I wanted to visualize the streams of data coming out of there, and with 4chan recently providing an API to their data, this might actually be feasible.

I use a veritable *potpourri* of Python libraries to bring everything together:

* [requests](http://docs.python-requests.org/en/latest/index.html)
* [BeautifulSoup](http://www.crummy.com/software/BeautifulSoup/)
* [Python Imaging Library](http://www.pythonware.com/products/pil/)
* [pymongo](http://api.mongodb.org/python/current/)
* [virtualenv](http://www.virtualenv.org/en/latest/index.html) | [pip](http://www.pip-installer.org/en/latest/index.html)
* [NodeBox](http://nodebox.net/code/index.php/Home)

In the end, it was very hard to do something with images that are often gross, sometimes shocking and mostly bizarre. So I decided to abstract the representation:

![Deconstructing Nature: Final Work Day #5](/media/deconstructing-nature/day5-final.png)

Again, this is a visualization of the random image board. It would be interesting to see visualizations of the other thematic boars to see if they show different patterns.

Other sketches:
![Other experiment](/media/deconstructing-nature/day5-experiment1.jpg)
![Other experiment](/media/deconstructing-nature/day5-experiment2.jpg)

The source is available in the [Deconstructing Nature GitHub repository](https://github.com/fdb/deconstructing-nature).
