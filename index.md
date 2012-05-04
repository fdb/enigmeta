---
layout: default
title: Frederik De Bleser
---
I'm a PhD student at [Sint Lucas Antwerpen][sla], studying the link between computers and art. I also do graphic design commercially. My company is called [Burocrazy][].

Latest Projects
===============
<ul class="projects">
{% for post in site.categories.project %}
  <li><a href="{{ post.url }}"><img src="/images/{{ post.thumb }}" alt="{{ post.title }}">{{ post.title }}</a></li>
{% endfor %}
</ul>

Latest Posts
============
<ul class="posts">
  {% for post in site.categories.post %}
    <li><time>{{ post.date | date_to_string }}</time> &raquo; <a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

Open Source Projects
====================
<ul class="source">
    <li><a href="http://nodebox.net/">NodeBox</a>: an application that lets you create 2D visuals using Python programming code.</li>
</ul>

  
[sla]: http://www.sintlucasantwerpen.be/
[burocrazy]: http://www.burocrazy.com/