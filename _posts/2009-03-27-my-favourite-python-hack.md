---
category: post
layout: post
title: My Favourite Python hack
---
In [NodeBox](http://nodebox.net/) we have this cool feature that we call "the throttle". It allows you to interactively drag any number in the (Python) script and see the results immediately. Whether it's and X/Y coordinate, the number in "for i in range(10)", or a number in a complicated formula, just dragging the number helps you visualize the effect of it on the overall composition. Here's a movie that demonstrates how this works:

<object width="400" height="300"><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=3907211&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1" /><embed src="http://vimeo.com/moogaloop.swf?clip_id=3907211&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="400" height="300"></embed></object>

Today I'd like to talk about the implementation, which works like this:

* Find the character under the cursor.
* Expand until you get the full number (include digits, periods and minus signs)
* Replace it with <code>__magic_var__</code> and add this variable to the locals dictionary
* When the user "drags" the number, replace the value of <code>__magic_var__</code> with an updated value and run the script again.
* When the user releases the mouse, replace the old number in the source file with the new number.

Sounds simple, right? While this approach worked well in 90% of the cases, it broke down when the signs of the number changes from positive to negative or vice versa. Here are the three use cases:

* If an addition goes from positive to negative the sign should change:
  <pre>random(alpha+8) -> random(alpha-8)</pre>
* If a subtraction goes from negative to positive the sign should change as well:
  <pre>random(alpha-8) -> random(alpha+8)</pre>
* *But* if a negative number turns positive, the sign should disappear:
  <pre>random(-8) -> random(8)</pre>


The difficulty was in finding the difference between the first case and the third case. After a lot of dabbling around with regular expressions, I suddenly had an insight. There is actually a Python module that handles this problem: the Python parser itself.

When Python parses the code, it builds an abstract syntax tree (AST), a tree-like representation of the code. Different nodes are represented by classes in the compiler.ast module. The use cases above are represented by instance of Sub (a two-part subtraction), UnarySub (a negative number), and Addition (a two-part addition).

Note that we replaced the original number with the name <code>__magic_var__</code> in our original source code, and compiled that. After compilation succeeds and returns an AST, a function called <code>_checkSigns</code> recursively checks the AST for special sign cases. First, it tries to find the magic variable. Once it has found that, it checks the parent node to see if it encounters any of the special cases, and basically prepares the object for string replacement afterwards.

What I like about this hack is that if it works correctly, you don't even notice it's there.

If you'd like to view the code, it's in the NodeBox source as [ValueLadder.py](https://github.com/nodebox/nodebox-pyobjc/blob/master/nodebox/gui/mac/ValueLadder.py).