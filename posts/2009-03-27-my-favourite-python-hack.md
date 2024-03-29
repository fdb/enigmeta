---
layout: post
tags: post
title: My Favourite Python hack
bigshot: bigshot.jpg
---

In [NodeBox 1](https://nodebox.net/code/) we have this cool feature that we call "the throttle". It allows you to interactively drag any number in the (Python) script and see the results immediately. Whether it's and X/Y coordinate, the number in "for i in range(10)", or a number in a complicated formula, just dragging the number helps you visualize the effect of it on the overall composition. Here's a movie that demonstrates how this works:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/sCPjlnTcopg"></iframe>
</div>

Today I'd like to talk about the implementation, which works like this:

- Find the character under the cursor.
- Expand until you get the full number (include digits, periods and minus signs)
- Replace it with <code>**magic_var**</code> and add this variable to the locals dictionary
- When the user "drags" the number, replace the value of <code>**magic_var**</code> with an updated value and run the script again.
- When the user releases the mouse, replace the old number in the source file with the new number.

Sounds simple, right? While this approach worked well in 90% of the cases, it broke down when the signs of the number changes from positive to negative or vice versa. Here are the three use cases:

- If an addition goes from positive to negative the sign should change:
  <pre>random(alpha+8) -> random(alpha-8)</pre>
- If a subtraction goes from negative to positive the sign should change as well:
  <pre>random(alpha-8) -> random(alpha+8)</pre>
- _But_ if a negative number turns positive, the sign should disappear:
  <pre>random(-8) -> random(8)</pre>

The difficulty was in finding the difference between the first case and the third case. After a lot of dabbling around with regular expressions, I suddenly had an insight. There is actually a Python module that handles this problem: the Python parser itself.

When Python parses the code, it builds an abstract syntax tree (AST), a tree-like representation of the code. Different nodes are represented by classes in the compiler.ast module. The use cases above are represented by instance of Sub (a two-part subtraction), UnarySub (a negative number), and Addition (a two-part addition).

Note that we replaced the original number with the name <code>**magic_var**</code> in our original source code, and compiled that. After compilation succeeds and returns an AST, a function called <code>checkSigns</code> recursively checks the AST for special sign cases. First, it tries to find the magic variable. Once it has found that, it checks the parent node to see if it encounters any of the special cases, and basically prepares the object for string replacement afterwards.

What I like about this hack is that if it works correctly, you don't even notice it's there.

If you'd like to view the code, it's in the NodeBox source as [ValueLadder.py](https://github.com/nodebox/nodebox-pyobjc/blob/master/nodebox/gui/mac/ValueLadder.py).
