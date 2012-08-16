---
category: post
layout: post
title: Starting web projects using Flask, virtualenv, pip
---
[Flask](http://flask.pocoo.org) is an awesome framework for building lightweight Python web-apps using a minimal amount of boilerplate. This tutorial discusses how to start a new Flask project and how to deploy it on a server.

These instructions are tested on Mac OS X 10.8. All code is available under the [GitHub helloflask project](https://github.com/fdb/helloflask).

# Bootstrapping your project

One server can host multiple running web applications, and they probably all use different versions of the underlying frameworks. To manage these dependencies, we'll create a *virtual environment* where we install the dependencies locally, together with the project instead of globally. In Python, we'll do this using virtualenv and pip. These tools provide a clean way to manage the dependencies of different Python projects.

## Install virtualenv

Virtualenv creates the virtual environment. Initializing a virtual environment automatically installs pip as well, which does the Python package installs. We'll install virtualenv locally, and again on the server. But first, let's install it on your machine:

    sudo easy_install virtualenv

## Setup a new project using virtualenv.

To start our new project, we're going to use virtualenv to setup the directory for us:

    virtualenv helloflask

This creates a folder "helloflask" that includes an isolated Python install. This project will not look at global site-packages, and packages installed there don't affect the global Python install. Hence the "isolated".

## Start working on your project

Each time you work on this project, you need to *activate* the virtual environment. From a new Terminal window:

    cd helloflask
    source bin/activate

You can check that your environment is active because virtualenv puts the name of the app before the 

Any packages you install now using pip or easy_install get installed into helloflask/lib/python2.7/site-packages.

## Install Flask

We've activated our virtual environment. This environment is devoid of any installed packages, so let's install Flask:

    # Make sure you've done "source bin/activate" first
    pip install flask

This installs Flask, Werkzeug (a utility library) and Jinja (a templating framework).

## Write some code

Create a file helloflask.py that contains the following application:

    from flask import Flask
    app = Flask(__name__)
    
    @app.route("/")
    def hello():
        return "Hello World!"
    
    if __name__ == "__main__":
        app.run()

Run the application:

    python helloflask.py

You should be able to surf to [http://127.0.0.1:5000](http://127.0.0.1:5000) and see a cheery "Hello World!" message.

To stop the server process, press control-C.

## Learn Flask

Browse through the excellent [Flask documentation](http://flask.pocoo.org/docs/) for more information on how to build the actual application. This is not covered here.

## List your requirements

When deploying to a webserver it is important to register which requirements we need. To do this we *freeze* the installed packages and store this setup in a `requirements.txt` file:

    pip freeze > requirements.txt

This writes a plain text file that contains the names of the required Python packages and their versions, for example `Flask==0.9`. We'll use this file later when we're setting up our server.

## The WSGI script

When we're running our application on a browser, we'll need a "run script" that tells the server how to setup your application. In other words, the webserver doesn't run your application directly like we did from the terminal, but uses WSGI to load the application into a separate process. In this WSGI script we can tell the server to use virtualenv to load our setup.

Create a new file called `application.wsgi` with the following contents:

    import os, sys

    PROJECT_DIR = '/www/helloflask.enigmeta.com/helloflask'

    activate_this = os.path.join(PROJECT_DIR, 'bin', 'activate_this.py')
    execfile(activate_this, dict(__file__=activate_this))
    sys.path.append(PROJECT_DIR)

    from helloflask import app as application

Note that this file refers to a (non-existent) `/www/helloflask.enigmeta.com` directory. We'll create this directory on the server in a minute.

## Version your files

To make development and deployment easier we should really use version control. Here, we'll use [Git](http://git-scm.com/) to manage our files. You should already have a working Git install. At the very least, make sure you've configured your full name and email address:

    git config --global user.name "Your Name"
    git config --global user.email "your.email@example.org"

Initialize Git in our project directory:

    git init

Because virtualenv installs a lot of unneeded files, we should ignore them. We need .gitignore to do this for us. Because .gitignore is a hidden file, we could use an editor like nano to change it:

    nano .gitignore

An initial .gitignore file should look like this:

    # Virtualenv
    .Python
    bin
    lib
    include

    # Mac OS X custom attribute files
    .DS_Store

Now add everything to your initial commit:

    git add .
    git status

Git status should list all files. This should be `helloflask.py`, `application.wsgi`, `.gitignore` and `requirements.txt`. With those three files added to the Git index, let's commit them:

    git commit -m "Initial commit."

## Store the project in a central repository

In this example we'll use [GitHub](http://github.com) to store our project. This gives us a central place where we can push files to (our machine &rarr; GitHub) and pull files from (GitHub &rarr; webserver). You can use [BitBucket](http://bitbucket.com) which provides unlimited private repositories, or a custom setup using the webserver itself.

Create a GitHub account if you don't have one yet. Then [create a new project](https://github.com/new). Call it "helloflask". Then, to push to this application, setup GitHub as the origin:

    git remote add origin git@github.com:USERNAME/helloflask.git
    git push -u origin master

This is all we need to do on the client side. Let's look at the server for now.

## Setup the server

In this example we're using Apache 2 as the web server.

We're going to assume we're running our app on its own domain or subdomain. This means we'll use a virtual host with its own configuration.

This is on a virtual private server (VPS), such as from [Linode](http://www.linode.com/?r=4be4bc35d12677cff12e393c9f4dd167d9eb6dfb) (referral link).

Let's set up the directory structure first. It will look like this:

    /www                         # Root of all sites on this machine
        helloflask.example.org   # Your full domain and subdomain
            helloflask           # Python project folder
            logs                 # Server access and error logs

To set up this directory structure:

    # Install virtualenv
    sudo su # You probably need to be root to do this.
    apt-get install python-virtualenv

    # Create the directory structure
    mkdir -p /www/helloflask.example.org
    cd /www/helloflask.example.org
    mkdir logs

    # Clone the project
    git clone git@github.com:USERNAME/helloflask.git

    # Initialize virtualenv and install dependencies
    virtualenv helloflask
    cd helloflask
    pip install -r requirements.txt

Here's a complete template Apache site configuration that can go in /etc/apache2/sites-available/helloflask.example.org (change the last part to reflect your domain):

    <VirtualHost *>
      ServerName helloflask.enigmeta.com

      WSGIDaemonProcess helloflask user=www-data group=www-data threads=5
      WSGIScriptAlias / /www/helloflask.enigmeta.com/helloflask/application.wsgi

      <Directory /www/helloflask.enigmeta.com/helloflask>
        WSGIProcessGroup helloflask
        WSGIApplicationGroup %{GLOBAL}
        Order deny,allow
        Allow from all
      </Directory>
      LogLevel warn
      ErrorLog /www/helloflask.enigmeta.com/log/error.log
      CustomLog /www/helloflask.enigmeta.com/log/access.log combined
    </VirtualHost>

Activate the virtual host:

    a2ensite helloflask.example.org
    service apache2 reload

You should now have the site running under helloflask.example.org (replace this with your domain).

## Automate deployments using Fabric

Manually re-uploading the code and restarting the server gets tedious after a while. Instead, we can automate this by using Fabric.

[Fabric](http://docs.fabfile.org/) is a command-line utility that runs a `fabfile` containing instructions on how to deploy to a server. It can automate *any* server task, not just deployment.

Install Fabric using:

    pip install Fabric

Here's an example Fabric script (change the relevant variables at the top of the script):

    from fabric.api import env, run, cd

    USERNAME = 'root'
    SERVER = 'helloflask.example.org'
    APP_NAME = 'helloflask'
    PROJECT_DIR = '/www/%s/%s' % (SERVER, APP_NAME)
    WSGI_SCRIPT = 'application.wsgi'

    env.hosts = ["%s@%s" % (USERNAME, SERVER)]

    def deploy():
        with cd(PROJECT_DIR):
            run('git pull')
            run('bin source/activate')
            run('pip install -r requirements.txt')
            run('touch %s' % WSGI_SCRIPT)


Let's go over the commands we're running:

    git pull # Get the new source code from GitHub
    bin source/activate # Activate the virtual environment (needed for the next step)
    pip install -r requirements.txt # Check if there are new required packages and install them.
    touch helloflask.py # Let Apache reload your application.

Save this in a file called `fabfile.py` in the root of your project and add it to version control:

    git add fabfile.py
    git commit -m "Add deployment automation script."

Subsequent deployments can be done using:

    fab deploy

Fabric shows the output of the server so you can check when things go wrong.

## Update workflow

Now that you have a fully working install, you can keep updating the application with a minimum of effort:

* Run the server locally.
* Change helloflask.py locally and go to http://localhost:5000 to see the results.
* If you're happy with the results you can commit the changes and push them to GitHub.
* Run `fab deploy` to update the application on the server.

In a next post, I'll discuss creating REST API's using Flask.

