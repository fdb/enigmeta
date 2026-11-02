---
layout: post
tags: post
title: "NodeBox: Data Visualisation Made in Belgium"
description: "A write-up of my 2019 talk at Dataviz BXL on where NodeBox came from, how its node-based model works, and what students, designers and a newspaper made with it."
bigshot: slide-01.jpg
---

{% assign m = "/media/blog/nodebox-data-visualisation-made-in-belgium" %}

On 26 September 2019 I gave a talk at Dataviz BXL, a data visualisation meetup organised by Digityser in Brussels, on an evening themed "data visualisation made in Belgium". I talked about [NodeBox](https://www.nodebox.net/), the tool we build at [Sint Lucas Antwerpen](https://www.sintlucasantwerpen.be/): where it comes from, how it works, and what people have made with it. This is a cleaned-up version of that talk, with the slides on the left.

<div class="talk">

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-02.jpg" alt="The glass and wood façade of the Sint Lucas Antwerpen building" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

I work at Sint Lucas Antwerpen, an art college where we teach painting, sculpture, photography, graphic design, advertising and illustration. Because it is an academic institution it also does research, and that is where I work, in a research group called EMRG. We develop NodeBox.

</div>
</div>

## NodeBox 1

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-05.jpg" alt="Pages from Design by Numbers by John Maeda (1999), with small programs and their output" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-06.jpg" alt="The Processing editor next to a sketch by Casey Reas and Ben Fry (2001)" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

NodeBox started from software like John Maeda's *Design by Numbers* (1999), made to teach programming to designers. You write very small programs that draw into a square of 100 by 100 pixels. It is an imperative way of programming: each line is a command that does something.

[Processing](https://processing.org/), by Casey Reas and Ben Fry, grew out of the same ideas, and we started NodeBox around the same time.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-07.jpg" alt="NodeBox 1 (2004): a window with a generated composition of circles on the left and Python code on the right" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

NodeBox 1 (2004) works much like Processing. It was built on DrawBot by LettError, which is still active today. The visuals are on one side, the code on the other, and the errors at the bottom, which is where you look most of the time.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/painters-model.gif" alt="Animation of the painter's model: fill, rect, ellipse and fill commands are executed one by one and drawn on top of each other" width="1920" height="1080" loading="lazy">
</div>
<div class="slide-text">

You type a command and it gets painted. This is called the painter's model, and you know it if you have worked with Canvas or OpenGL. A command sets some state, such as the fill colour, and the drawing commands after it use that state.

It works well, but you have to keep the state of the program in your head at every point. If you copy a few lines to another place and forget the `fill` line, the result changes.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-10.jpg" alt="Organic Dots by Veronika Schmidt (2008): dense, hairy circular forms built from small drawn shapes" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

We run a lot of workshops with this software, and none of the students are programmers. They draw basic shapes in Illustrator or elsewhere, bring them into NodeBox and start manipulating them. *Organic Dots* by Veronika Schmidt is an example. These are generative designs rather than data visualisations, and the only data in them is random.

</div>
</div>

<div class="slide-row">
<div class="slides grid-2">
<img src="{{ m }}/slide-12.jpg" alt="The Evil Font parameter panel with a text field and an Evilness slider set to 0" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-14.jpg" alt="The word EVIL with a few blood spatters" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-17.jpg" alt="The word EVIL overgrown with thorns, eyes and pentagrams" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-20.jpg" alt="The word EVIL at full evilness, buried under scribbles, swords and red splatter" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

Some of these programs do take input. The *Evil Font* by Valtteri Vitakoski is a generative typeface with one parameter, evilness. At zero it is a plain sans serif. Add some evil and the letters start sprouting thorns, eyes and swords, until at full evilness the word disappears under them.

What I like about it is that this slider is not one you will find in Illustrator. Students invent their own parameters, make a slider for them, and connect it to whatever they want. People who work in data visualisation know this idea well, but it is still good to see students discover it.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-21.jpg" alt="Spamghetto by TODO: rooms wallpapered with flowing ribbons of text" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-22.jpg" alt="Close-up of Spamghetto wallpaper with lines of spam text inside curving ribbons" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

*Spamghetto*, by the Italian design studio TODO, takes the spam in your mail folder and turns it into wallpaper. You can send them your own spam and they run their NodeBox script on it to make a personal pattern. In the close-up you can read a mail "from the desk of the president of Trump University".

</div>
</div>

## NodeBox 3

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-24.jpg" alt="The NodeBox Live interface: a list of nodes, a network of connected nodes, and a colour wheel made of thousands of points" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

The biggest problem with NodeBox 1 turned out to be the programming. Many of the people we teach are graphic designers and illustrators who have no background in programming and are not much interested in it. We tried teaching them, and it works for some people but not for everybody.

So we tried to turn the model around, and that became NodeBox 3. It is a visual application that requires no programming. You build a visualisation from small building blocks, which we call nodes, and each node does one part of the work. (This screenshot is of NodeBox Live, the later web version, which I come back to below.)

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-25.jpg" alt="A Volkswagen Beetle assembly line" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-26.jpg" alt="A diagram of a path from 'data' to 'visuals' with four intermediate steps" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

Think of a factory assembly line. The cars move down the line and every station does one part of the job.

We are going from data to visuals instead of building cars, and there are intermediate steps on the way. We process the data until it has the right shape. At some point we turn a value into a visual property: the width of a bar in a bar chart, the radius of a circle, a position on a map after a projection.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-27.jpg" alt="A NodeBox network: import CSV, three lookups, convert and multiply, textpath, rect and line angle, colorize and align, merge" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

Here is a simple network. We import a CSV file, and lookup nodes extract the columns we need. The data is rarely in the form we want, so we convert it: we change the range from millions to pixels, or simply multiply. Then we generate shapes from the data, such as text on a path, rectangles or lines, and modify them further by aligning or colouring them. A merge node combines everything into the finished visualisation.

The whole application uses this one consistent system, which makes it easy to learn.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-28.jpg" alt="A grid of eight black and white geometric patterns" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

You don't need to understand the whole process to use it. You can take an existing NodeBox file and start changing its parameters without touching its structure. All of these designs come from the same network; only the parameter values differ.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-29.jpg" alt="Screenshots of NodeBox 2, NodeBox 3 and NodeBox Live side by side" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

There have been several versions. NodeBox 2 worked quite differently and is no longer supported. NodeBox 3 and NodeBox Live share the same evaluation model. NodeBox 3 is an open source desktop application, and NodeBox Live runs in the browser.

</div>
</div>

## Examples

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-30.jpg" alt="Shipwrecks of California by Jan Aulbach (2012): a vertical timeline of shipwrecks, each bar sized by tonnage" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

Jan Aulbach made *Shipwrecks of California* in a data visualisation workshop we gave in The Hague. It is a timeline of the ships that wrecked off the Californian coast, each sized by its tonnage. In the early years there are many wrecks as maritime traffic grows. Later, safety improves and wrecks become rare, but when one happens it is a much bigger ship.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-31.jpg" alt="North Sea Fish by Katju Aro: curved bands for each species of fish, all declining from left to right" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

Katju Aro visualised the declining stock of fish in the North Sea, with a colour for each species. It is a dramatic picture: nearly every band goes down.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-32.jpg" alt="The poster Fifty Years of Film Speech by Jonas Lekevicius and Juste Ziliute" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

*Fifty Years of Film Speech* by Jonas Lekevicius and Juste Ziliute is one of my favourites because it brings everything together. They took the subtitles of the fifty most popular films of each year, over fifty years, and kept the fifty most frequent words. For every word they drew a sound wave that shows how often it is spoken over time.

A lot of data preparation happened before the data reached NodeBox. Not everything can be done inside it.

</div>
</div>

<div class="slide-row">
<div class="slides grid-2">
<img src="{{ m }}/slide-33.jpg" alt="Raw JSON data with word frequencies per year" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-34.jpg" alt="An Excel line chart with all fifty words plotted on top of each other" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-35.jpg" alt="NodeBox with the sound-wave shapes for oh, yeah, look, time and gonna, and the network next to it" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-36.jpg" alt="Close-up of the poster with sound waves for hell, baby, child, dad, mom, wife, gun and other words" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

If you put the raw data into Excel with every word on top of each other, you get the chart on the top right. That is a bit unfair to Excel; you would use small multiples instead.

NodeBox let them build their own visualisation, a sound-wave shape, which suits a project about speech. Like the evilness slider, the sound wave is a custom node: a small network packaged as a single node. You attach data to it and the shape comes out. The last image is a close-up of the words changing over time.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-37.jpg" alt="Off the Staff by Nicholas Rougeux (2016): a circular burst of coloured dots representing a musical score" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-38.jpg" alt="Ten Off the Staff visualisations of pieces by Tchaikovsky, Schubert, Mozart, Beethoven, Vivaldi and Bach" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

Nicholas Rougeux visualises musical scores in a series called *Off the Staff*. Each image is a whole piece: Tchaikovsky's *1812 Overture*, Vivaldi's *Autumn*, a Brandenburg Concerto. He uses NodeBox among other tools, and he writes about his process, which shows that NodeBox gets used outside the classroom too.

</div>
</div>

<div class="slide-row">
<div class="slides grid-2">
<img src="{{ m }}/slide-39.jpg" alt="Nicholas Rougeux's blog post Making of Off the Staff, with the tools of the process" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-40.jpg" alt="Bach's Toccata and Fugue in D minor in MuseScore" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-41.jpg" alt="An online XML to CSV converter" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-42.jpg" alt="The note data in Google Sheets, with columns for duration, octave, note and order" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

His [making-of post](https://www.c82.net/blog/?id=72) explains every step. He opens the score in MuseScore, exports it from MIDI to MusicXML, converts the XML to CSV, and cleans it up in Google Sheets, because no data visualisation project is finished without a spreadsheet. Then it goes into NodeBox.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-43.jpg" alt="NodeBox with an Off the Staff visualisation in the viewer and the network below" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-44.jpg" alt="The Off the Staff network, with groups of nodes numbered 1 to 11" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

He numbered the parts of his network, which makes it a good illustration of the model I described. It starts by importing the CSV. The blue nodes process the data. They compute the current time from the frame number (NodeBox renders video at 30 frames per second and the data is in seconds), a colour per instrument, an angle starting at twelve o'clock, a circle size from the note's duration, and a distance from the centre from its pitch and octave.

From step 10 the nodes turn dark. Those are visual nodes, where numbers become shapes. A `rect` node, for example, has four input ports for x, y, width and height, and what it draws depends on what you connect to each.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-45.jpg" alt="Literary Constellations by Nicholas Rougeux (2017): four circular star charts made from books" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

There is much more on his site, [c82.net](https://www.c82.net/), such as *Literary Constellations* (2017).

</div>
</div>

## List matching

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-47.jpg" alt="A translate node with a list of numbers 0 to 9 and a list of ten dots as input, producing ten numbers" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-48.jpg" alt="A translate node with one triangle and ten dots as input, producing ten triangles" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-49.jpg" alt="A translate node with a triangle and a square and ten dots as input, producing alternating triangles and squares" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

All these examples work on many data points, so where are the loops? NodeBox behaves like a functional programming language. There are no explicit loops; NodeBox loops over everything implicitly, using a system we call list matching.

When a node gets two lists, it pairs them element by element. Say the dots are positions and the numbers are data: the first number goes to the first dot, the second to the second, and so on.

If one list has a single element and the other has many, the single element is repeated. With other lengths, such as two shapes and ten positions, the shorter list wraps around and the shapes alternate. The output is as long as the longest list.

This works well in practice, and it makes it easy to see what every node is doing.

</div>
</div>

## Visual debugging

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/demo-broken.jpg" alt="Photo of the projected demo: NodeBox with a circle of word labels and no lines inside, and the network on the right" width="1280" height="720" loading="lazy">
<img src="{{ m }}/demo-fixed.jpg" alt="Photo of the projected demo after the fix: the circle is filled with coloured lines connecting the words" width="1280" height="720" loading="lazy">
</div>
<div class="slide-text">

Because every node does something concrete, you can always check where things go wrong. We use this when teaching: once students know a bit of NodeBox, we ask them to swap computers with the person next to them and break their network. Then everyone has to find the bug in their own.

In the demo I opened a network that visualises the words used across all Metallica albums. I expected lines inside the circle and saw none. The viewer shows the output of the node at the bottom, a combine node that merges everything. I clicked my way up through the network. The text around the circle was fine, but the coloured lines were missing. Further up, a lookup node that should have returned the list of albums returned nothing, because of a mistake in its settings. After fixing it, I stepped back down node by node, checked the lines, the colours and the combine, and the visualisation appeared.

In an imperative program with loops, a mistake somewhere in the middle is hard to locate. In NodeBox you go up the network one node at a time, compare the data you see with the data you expect, and find the node where they differ.

</div>
</div>

## NodeBox Live

<div class="slide-row">
<div class="slides">
<video src="{{ m }}/dashboard.mp4" poster="{{ m }}/slide-53.jpg" width="1280" height="814" controls muted playsinline preload="none"></video>
</div>
<div class="slide-text">

NodeBox 3 works well, but it cannot do anything interactive. About two years before the talk we made NodeBox Live, which brings the same model to the web.

This demo builds a dashboard widget from tweets about telecom operators. Here they are imported from a file, but NodeBox Live also supports real-time data streams. A scale node maps the earliest and latest dates to pixels, those become points, and the port you connect them to decides whether they drive x or y. A sentiment analysis library splits the tweets into positive and negative. We turn them into ellipses, colour them, add a legend and combine everything.

To put it on a dashboard, we make it smaller, copy a snippet of iframe code and paste it into the dashboard page. The embed stays live, so you can keep adjusting it afterwards. Because the network is a procedure, you can point it at the data of another operator. The other charts on the dashboard, such as the word cloud, are NodeBox Live networks too.

</div>
</div>

<div class="slide-row">
<div class="slides">
<video src="{{ m }}/revolving-door.mp4" poster="{{ m }}/slide-54.jpg" width="1100" height="1376" style="max-width: 26rem" autoplay loop muted playsinline></video>
</div>
<div class="slide-text">

On the web you get everything the web offers, including interactivity, and I like to mix the serious work with less serious student projects. Quinten De Meester was fascinated by how slow the revolving doors in shopping centres are, and wondered what would happen if you could change their parameters.

His *Raging Revolving Door* (2015) lets you set the motor speed, how fast people walk, and how many of them there are, like a busy shopping season versus a normal day. Then you can turn everything up and watch.

</div>
</div>

## De Standaard

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-56.jpg" alt="Cover of the report Jouw gemeente in cijfers, edition 2018, with a municipality sign in tall grass" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-57.jpg" alt="A page from the report: a dense table of demographic figures with a green header" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

Because we work in an academic context, we have to think about how NodeBox can sustain itself, and a commercial version is one option. So we worked with De Standaard on *Jouw gemeente in cijfers* ("your municipality in numbers"), a large dataset the Flemish government publishes about every municipality.

We knew the format in advance but not the data, so we prepared everything and had only a few days once it came out. We worried the report would be so beautiful that we would be out of a job. This is what came out: about 150 pages of tables like this one for every municipality.

</div>
</div>

<div class="slide-row">
<div class="slides grid-2">
<img src="{{ m }}/slide-58.jpg" alt="Welkom in Edegem: a page with a dark blue skyline of Edegem under a large moon" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-59.jpg" alt="Welkom in De Panne, with a skyline of the coast and a boat" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-60.jpg" alt="Welkom in Brugge, with the belfry of Bruges in the skyline" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-61.jpg" alt="A grid of hundreds of thumbnails, one welcome page per municipality" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

We made a day in the life of someone living in each municipality, from Edegem and De Panne to Bruges and every other one, and the illustrated skyline changes with the place.

NodeBox generated everything, including the HTML and the text. It has nodes for working with text, so a sentence like "as for the 21,834 other inhabitants of Edegem, your day begins" comes straight out of the network.

</div>
</div>

<div class="slide-row">
<div class="slides grid-2">
<img src="{{ m }}/slide-62.jpg" alt="Wakker worden, 7.00: an illustrated kitchen with a coffee machine under a lamp" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-63.jpg" alt="Allez, en route, 7.30, for Zoersel: a long queue of cars next to a cyclist" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-64.jpg" alt="Allez, en route, 7.30, for Antwerp: only a few cars next to a cyclist" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-65.jpg" alt="Rows of person icons, a few highlighted, showing that 19.2% of Edegem's inhabitants are of foreign origin" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

Each part of the day has its own visualisations. On the commute, the number of cars on the road follows the data: 75% of people in Zoersel drive to work or school almost every day, against 43% in Antwerp. A row of people shows the share of inhabitants of foreign origin, 19.2% in Edegem.

</div>
</div>

<div class="slide-row">
<div class="slides">
<img src="{{ m }}/slide-66.jpg" alt="NodeBox Live with the network for the foreign-origin section next to its output" width="1200" height="675" loading="lazy">
<img src="{{ m }}/slide-67.jpg" alt="Ontspannen, 20.30: two illustrated faces, a young man and an older woman, under text about cultural facilities" width="1200" height="675" loading="lazy">
</div>
<div class="slide-text">

Every segment is a NodeBox Live network, and the networks are grouped together. It was a fun project, because illustrators, people working on the data and people building the visualisations all worked on the same thing.

</div>
</div>

</div>

## The future of NodeBox

At the time of the talk there were two applications, NodeBox 3 and NodeBox Live. Our plan was to bring them together, with the web version as the standard and something like Electron, which Slack, GitHub Desktop and Spotify use, to run it on the desktop.

We think it matters to have a tool that is open source, freely available and supported by its community. The speaker before me argued that these tools have to last over time, and I agree. Open source means you can keep using them for as long as you need.

You can find NodeBox at [nodebox.net](https://www.nodebox.net/).
