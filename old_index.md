---
layout: default
title: Welcome
bigshot: /media/home/bigshot.jpg
---

<big>I'm a PhD researcher at <a href="http://www.sintlucasantwerpen.be/">Sint Lucas Antwerpen</a>, studying the link between computers and art. I develop <a href="http://nodebox.net/">NodeBox</a>, an app for creating generative design.<br><a href="/about/">Read more</a>.</big>

<ul class="posts">
  {% for post in site.posts %}
    <li>
    	<a href="{{ post.url }}"><img src="{{post.bigshot}}" title="{{ post.title }}">
    	<p>{{ post.title }}</p>
    	<time>{{ post.date | date:"%Y-%m-%d" }}</time></a>
	</li>
  {% endfor %}
</ul>
