---
category: post
layout: post
title: Teaching lists to designers
---
I've been teaching generative design using [NodeBox 1](http://nodebox.net/) since 2004. NodeBox 1 is a [Python](http://www.python.org) IDE for making generative graphics. With my team at [EMRG](http://www.emrg.be/) I've been teaching one- or two-week workshops for graphic designers, resulting in a poster or animation at the end. You can see some of the process / results at the [Workshop Blog](http://workshops.nodebox.net/).

The most important insight I've discovered during the workshops is to **teach people data structures as soon as possible**. Often I teach this before learning about conditions or loops. Data structures are absolutely essential to let students progress from the "beginner" stage to the "competent" stage.

Before, I learned the "building blocks of programming": variables, loops, conditions, functions. But without a way to store and manipulate data, *none of these constructs are useful*.

One week is too short to learn about all data structures so we only teach lists. **Lists can be used for everything:**

- the keywords of a web page
- the points of a path
- the installed fonts
- the images in a folder

All of these require lists. Once we have a list what can we do with it? We can:

## Iterate a list
{% highlight python %}
for pt in path.points:
    ellipse(pt.x + random(-10, 10), pt.y + random(-10, 10), 2, 2)
{% endhighlight %}

## Sort a list

{% highlight python %}
import glob
import Image, ImageStat

def image_brightness(fname):
   img = Image.open(fname).convert('L')
   stat = ImageStat.Stat(img)
   return stat.mean[0]

icon_files = glob.glob('icons/*.png')
sorted_icons = sorted(icon_files, key=image_brightness)
{% endhighlight %}

## Choose elements from the list
     
{% highlight python %}
from random import choice
    all_words = open('/usr/share/dict/web2').readlines()
    old_word = choice(all_words).strip()
    new_word = choice(all_words).strip()
    print '%s is the new %s.' % (old_word.capitalize(), new_word)
{% endhighlight %}

For some students we also teach dictionaries (maps) if they need it to do lookups. But lists are absolutely essential.

Before teaching data structures students were struggling in going from their idea to a solution. By teaching lists we've seen a huge increase in self-reliance. They can now express their ideas in terms of a programming construct. Have a set of Wikipedia articles you want to visualize? Use a list to store them and iterate through them. Have an idea for a font where the points are randomly wiggled? Get the list of points from a glyph shape and add a random value.

I think most designers never learn to program because all the teaching material is about variables, conditions and loops. As programmers we know that programming is fundamentally about manipulating data. But designers don't know this! By teaching data structures as soon as possible they understand why knowing coding can be useful for them as well.