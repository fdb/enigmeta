---
layout: default
title: Projects
---
<ul class="projects">
{% for post in site.categories.project %}
  <li><a href="{{ post.url }}"><img src="/images/{{ post.thumb }}" alt="{{ post.title }}">{{ post.title }}</a></li>
{% endfor %}
</ul>
