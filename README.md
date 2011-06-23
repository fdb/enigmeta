Enigmeta is my personal blog.
=============================

It uses [Jekyll][] to transform it into a static site that gets pushed to my server at [Linode][]. It seemed like a good idea at the time.

Installing on Mac
-----------------
Install [Xcode][] first.

  sudo gem update --system
  sudo gem install rake jekyll RedCloth
  sudo easy_install pygments

Installing on Ubuntu
--------------------

  sudo apt-get install ruby rubygems
  sudo gem install rubygems-update
  sudo gem install jekyll
  sudo easy_install pygments

Running
-------

To build the website:

  rake

To run the built-in server:

  rake server
  

License
-------
Content under the directories _posts/ and images/ is copyright Frederik De Bleser.

[Jekyll]: http://github.com/mojombo/jekyll
[Linode]: http://www.linode.com/?r=4be4bc35d12677cff12e393c9f4dd167d9eb6dfb
[Xcode]: http://itunes.apple.com/us/app/xcode/id422352214