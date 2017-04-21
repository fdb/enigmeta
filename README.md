Enigmeta is my personal blog.
=============================

It uses [Jekyll][] to transform it into a static site that gets pushed to my server at [Linode][]. It seemed like a good idea at the time.

Installing on Mac
-----------------

    xcode-select --install
    brew install ruby libxml2
    sudo gem update --system
    sudo gem install bundler
    bundle config build.nokogiri --use-system-libraries
    sudo bundle

Installing on Ubuntu
--------------------

    sudo apt-get install ruby rubygems
    sudo gem install rubygems-update
    sudo gem install rake jekyll RedCloth
    sudo easy_install pygments

Installing on Windows
---------------------
* Download and install [Ruby](http://rubyinstaller.org/downloads/).
* Download [Ruby Development Kit](http://rubyinstaller.org/downloads/). Extract it at `C:\RubyDevKit`.

Then open a command prompt and run:

    cd C:\RubyDevKit
    ruby dk.rb init # This will generate the config.yml file. It should note the installed Ruby.
    ruby dk.rb review # Check that the Ruby you just installed is actually there.
    ruby dk.rb install

Fix the [certificate issues](https://gist.github.com/fnichol/867550):
* Download a recent [certificate file](https://curl.haxx.se/ca/cacert.pem).
* Save this file to the Ruby install directory (`C:\tools\ruby23` by default). Make sure you don't add the `.txt` extension.

Install the project dependencies from the `Gemfile`. Open a command prompt, then run:

    cd C:\YourProjectDirectory
    gem install bundler
    bundle


Installing on Termux
--------------------

    apt install ruby ruby-dev make libxslt-dev pkg-config libxml2-dev libffi-dev nodejs
    bundle config build.nokogiri --use-system-libraries
    bundle install

Running
-------
On Windows, make sure Ruby can find the certificates. In every new command prompt, write:

    set SSL_CERT_FILE=C:\tools\ruby23\cacert.pem

To build the website:

    rake

To run the built-in server:

    rake server

License
-------
Text & images on this blog are licensed under the [Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License][cc].

[Jekyll]: http://github.com/mojombo/jekyll
[Linode]: http://www.linode.com/?r=4be4bc35d12677cff12e393c9f4dd167d9eb6dfb
[Xcode]: http://itunes.apple.com/us/app/xcode/id422352214
[cc]: http://creativecommons.org/licenses/by-nc-nd/3.0/
