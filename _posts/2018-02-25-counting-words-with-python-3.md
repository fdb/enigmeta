---
title: Counting Words with Python 3
pubdate: 2018-02-17
layout: post
---
This post will get you set up to start processing datasets with Python 3. We will learn how to use the terminal, install Python if you don't have it already, and write a simple word-counting script that returns the result in CSV.

A big focus will be on getting you to "Google level experience", meaning that you will know the right things to search for if you want to do something not mentioned in this article, or if you get stuck. Knowing *what* to search for is important to tackle your own data processing jobs.

During the many NodeBox workshops I've given I noticed that students would eventually be able to figure out the visualization on their own, but they had trouble getting the data in the correct shape. Being able to acquire the data (e.g. from an external API), converting it to a format you can use is key to making good visualizations. But first, we need to talk about the terminal.

## The Terminal is Your Friend

You probably already heard this a number of times, but the Terminal, also known as the command line, is an immensely powerful tool that we're going to use.

The command line has been around since the dawn of the computers. Even with all graphical interfaces, people keep coming back to it. The reason is simple: it gives you access to the raw power of your computer. If you want to do something that no one else has done, the terminal is the place to be.

A good way to look at the terminal is as having a chat conversation with your computer. When you start it up it will be waiting for your command. You give it an instruction and press enter, and the terminal will execute it. It's a silent partner: often if the command succeeds it will be silent. It doesn't ask you to brag about the fact you just created a directory to your friends on Facebook.

Fully understanding the command line can take years. Luckily we just need a few very basic commands: how to switch to the right directory, how to install some software, and how to start and stop our scripts.

First we need to *find* the Terminal. On a Mac, the program is called "Terminal" and can be found using Spotlight, or in the Utilities subfolder under the Applications folder. On Windows, you need to install the Bash terminal. Instructions are here.

Once you open the Terminal you will get a blank screen with some text. Again, think of it as a chat conversation, not a text editor. You can't move the cursor to a random position on the screen. Instead you just type a command, press enter, and new text will appear below.

The place where the terminal is waiting for your input is called the *prompt*. After you've executed a command, the terminal will show a new prompt, informing you it's ready for the next command. You don't always have to wait for the previous command to complete though. Often with long-running jobs (like downloading some images) you can just open another terminal tab or window and continue working there.

Let's try our first command. Open the terminal if it's not open already. Then, type `pwd` and press ENTER.

The terminal will print out your *current working directory*. In my case it's `/Users/fdb`. "fdb" is my user name, so yours will probably be somewhat different.

Already there are two important concepts we need to discuss. One, what's a "working directory"? And two, what is *our* working directory (in other words, where are we?)

## Working Directory

Whenever we type a command in the terminal it executed in the *current working directory*. Compare it to a builder constructing a house. If you enter a certain room in the house and execute an operation - say, paint a wall, then that will happen in the room you're currently in. It's the same with the terminal. Instead of being in a room, you're in a certain directory on your file system.

## Finding your way

Modern operating systems try to obscure the directory structure from you but it's actually quite important. Knowing where your files *are* is essential when working in the terminal.

When the terminal starts up it'll be in your *home directory* (the builder analogy is not that far fetched!). In your home directory you Will have subdirectories - rooms - that contain even more subdirectories (ehm, cupboards, in our analogy). The main subdirectories in your home directory will sound familiar: the desktop, your documents, downloads, movies, pictures.

The home directory itself is in a folder called "Users". If you share your computer with other people, they will have *their* home folder under a different user name in the "Users" folder.

The Users folder itself is in the *root* of your computer. In addition to a "Users" folder there is also the "Applications" folders. Applications are shared between all users of the computer: if you install a new app it will be available to everybody using the same computer.

We used the `pwd` command to print the current working directory. Hopefully it's now clear what this prints out:

```
/Users/fdb
```

The root folder contains a directory called "Users". In that directory is a folder called "fdb" (or whatever your user name is). The different directories are separated by slashes ("/").

## Listing a directory

To see which files are in a directory use the `ls` command. Type `ls` and press enter. This will show you a list of files inside of the current (home) folder. Here are mine:

Fixme: file listing

You probably recognize some: your desktop, your documents, downloads and so on. All of these are inside our home folder. Note that the desktop is also a directory, just like your downloads directory.

The Finder provides a different, somewhat more user-friendly, view on the same information. If we go to the "Go" menu in the finder and choose "Home", it opens up a window with the same files. It's important to realize that what the Finder shows and what the terminal views are two views on the same information: the files stored in a directory on your hard drive.

## Changing Directories

Your projects are probably saved in the Documents folder, or the desktop, or maybe  the Dropbox folder. Whatever the place we need to switch to that directory before we start executing commands. We'll use the `cd` command, short for *change directory*, for that.

To get to your desktop type the following command and press enter:

```
cd Desktop
```

If we type `pwd` now (don't forget to press enter!) we'll see that the working directory has changed to `/Users/fdb/Desktop`. That means we're in the desktop directory.

Type `ls` to see the files on your desktop:

FIXME: desktop listing

My listing will have very different files from yours. The Desktop starts out empty, and in my case fills up quickly as the deadline approaches!


## Installing Packages with Homebrew

Installing software in the Terminal is done through [Homebrew](https://brew.sh/). The package we'll need right now is Python 3, which is not installed by default on the Mac.

First, let's install Homebrew. Copy and paste the following line of code in your Terminal and press enter:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

First this will ask to confirm the directories, just press enter. Then it will ask for your password and show a small key cursor. Type your password here. *You will not see any letters appear, that's okay.*

If all goes well we should have a working Homebrew install. Type:

```
brew
```

and press enter to see a list of options. You'll type options after the `brew` command, separated by a space. The most important ones are `brew install` and `brew search`.


## Installing Python 3 using Homebrew

Python 3 is not installed by default on your macOS. But maybe you have it through a different installer. Try typing `python3`. If the command line responds with "command not found" you don't have Python installed.

If you *have* Python installed, it will show some text and then the Python `>>>` prompt. Here, type Ctrl-D (not Command) to exit Python.

To install Python 3, type:

```
brew install python3
```

After that, you should be able to type `python3` (and enter) to start Python in what's called *"interactive mode"*. It will show the version number, and then the Python prompt, indicating it's listening to your commands:

```
>>>
```

At this point, you're having a chat conversation with Python. Try typing `3 + 5` (and enter) to let Python calculate something and return a response.


**Press Ctrl-D (not Command) to exit Python.**

The interactive mode is useful for trying out quick things. In general though, we'll run Python by executing a scripts. This is a text file with a `.py` extension that contains a list of commands we want Python to do, like open a file, download a web page, and so on.

## Text Editors and Project Folders

To edit files we need a plain text editor. This is not Word or LibreOffice, but a program like Sublime Text, Atom or [Visual Studio Code](FIXME:link). I prefer the latter since it has an integrated terminal, which will automatically change the directory to the current project path.

Whenever we work on a data processing folder we should create a *project folder*. It's generally a bad idea just to create files randomly on the desktop, but especially for data processing jobs since they can produce many intermediate folders. Also, our editor works at the folder level, automatically helping us find files in the project folder.

Create a project folder on the desktop called "dataproc". You can use the Finder, or you can type the following commands:

```
cd
cd Desktop
mkdir dataproc
```

The first `cd` here has no directory path and conveniently changes the directory to the home directory no matter where we are.

## Our First Python Script

We're going to write a small script that will load a file, count the unique words in the file and save the word count as a CSV file.

First we need to have some content. I'm going to use the American declaration of dependence since it's freely available. You can download it here:

https://gist.github.com/fdb/1c7234fb49757df588c1302f44f0f125

But wait! Since we can now use the command line, we can also download it by using `curl`, a program that can fetch web pages and files from the web.

Make sure we're in the "dataproc" folder (if not use `cd Desktop/dataproc` to navigate to it) then type the following command:

```
curl -O https://gist.githubusercontent.com/fdb/1c7234fb49757df588c1302f44f0f125/raw/bf6e32adb152fada6d08e54447f7d2e9370ea883/declaration.txt
```

The "`-O`" part is important. It's a *flag*: an extra option that indicates to the program we want to do something different from its default operation. By default, curl will *show* the file. By using the -O option, we can instruct curl to download the file. In this case, it will be saved as `declaration.txt`.

Open the project folder in your favorite editor. Make sure to open the whole folder (and not just the declaration.txt file) by clicking the folder and choosing "Open". You will see the list of files in the sidebar.

Let's make a Python script called `count_words.py`. We can create our Python script in this same folder by clicking the "new file" icon in Visual Studio Code, or we can do it from the command line:

```
touch count_words.py
```

The `touch` command is meant to change the date and time the file was last accessed. A side effect of the command is that it will create a new file if it doesn't already exist, which is what we use it for.

We're going to write some very basic Python code to open the file, read it in, then show us the first 10 words of the file. Here's the code:

```python
text = open('declaration.txt').read()
words = text.split()
print(words[:10])
```

This code demonstrates why I like Python: it's terse, and contains just the information we need without being "magic".

The first line opens the file and reads the contents. It stores this in a variable we define called "text". Note that we can call it anything we like, as long as we use the same name to refer to it later.

We didn't specify what *type* the variable has. In Python each variable will have a type when the script is running. Here it's going to be a string: a container that holds text. It also supports Unicode, so we can store complex strings and Emoji's.

The second line takes the text we read in and splits it. Since we didn't tell it on *what* to split, the string will be split on whitespace. The result will be stored in the `words` variable (again, we choose that name ourselves).

The type of the `words` variable is a `list`. It's *the* most useful type in Python: lists are the core of any data processing job. Complex jobs will require us to iterate over lists of directories, which might contain lists of files, where each file is a list of lines each containing lists of words, which consist of a list of characters... Even images can be regarded as a list of numbers defining the red, green and blue values making up the pixels of the image.

We can do a lot with lists. The last line in our script just prints out the first 10 words of the list, using the `[:10]` syntax. This means print from the beginning of the list, until (but not including) the 10th element.

Save the script, then run it by `cd`-ing to the correct directory if you're not there already and typing:

```
python3 count_words.py
```

You should see the following output:

```python
['When', 'in', 'the', 'Course', 'of', 'human', 'events,', 'it', 'becomes', 'necessary']
```

If not, check every letter of the script carefully. If you get a `FileNotFoundError` it means that Python can't find the file. Make sure it is in the same directory and has the same name as written in the script.

To actually *count* the words we need another data structure. We need a way to *map* each word to a value: the number of times we encounter that word in the text. In other words, we want to have something that looks like this:

```
of     78
the    76
to     64
and    55
our    25
their  20
has    20
for    19
in     18
He     18
```

In Python we can use a *dictionary* to contain this mapping. It stores a *key* and an associated *value*. In our case, the key is going to be the word, and the value is going to be our count.

Here's the full code:

```python
text = open('declaration.txt').read()
words = text.split()
word_count = {}
for word in words:
    count = word_count.get(word, 0)
    count += 1
    word_count[word] = count
print(word_count)
```

The initial two lines are the same as before. The third line creates a new variable called `word_count` that is an empty dictionary.

Then we encounter our main loop. This block iterates over each word and increases the count for it. In Python, a block is *indented* (has extra spaces). It's recommended to use 4 spaces. All indented lines are executed in the loop. Note that the print statement at the bottom is not indented. We don't want it to happen after every word, but instead after all words have been counted.

Let's look at the lines in our loop:

```python
count = word_count.get(word, 0)
```

The first line looks up the word in the `word_count` dictionary. To get a value from a dictionary in Python we can also use square brackets (e.g. `word_count[word]`). However, this will fail if the word is not available. That's why we use `get` to provide a default value of 0 if the word can not be found. So after this line, the count is either the number of times we encountered the word, or 0 if we haven't seen it yet.

```python
count += 1
```

This line increases the count by 1. It's shorthand for `count = count + 1`. It takes the count, adds one to it, then stores it back into the count variable.

```python
word_count[word] = count
```

Finally we'll store the updated count back into the `word_count` dictionary, under the key contained in the word.

After the loop is done we print out the list of words. However, you'll see that this format is not really useful:

```python
{'When': 1, 'in': 18, 'the': 76, 'Course': 1, 'of': 78, 'human': 1, 'events,': 1, 'it': 5, 'becomes': 2, 'necessary': 2, 'for': 19, 'one': 1, 'people': 2, 'to': 64, 'dissolve': 1, 'political': 2, 'bands': 1, 'which': 10, 'have': 11, 'connected': 1, 'them': 11, 'with': 9, 'another,': 1, 'and': 55, 'assume,': 1, 'among': 5, 'Powers': 1, 'earth,': 1, 'separate': 1, 'equal': 1, 'station': 1, 'Laws': 6, 'Nature': 1, "Nature's": 1, 'God': 1, 'entitle': 1, 'them,': 3, 'a': 15, 'decent': 1,...
```

The words are ordered not by the count, but by the order in which we encounter them. We'd like to see them in a more useful format, so let's *sort* the dictionary.

Actually, we can't really sort a dictionary. Instead, we can get a representation of the dictionary with the keys, sorted.

Remove the last print statement and replace it with the following code:

```python
word_count_list = sorted(word_count, key=word_count.get, reverse=True)
for word in word_count_list[:20]:
    print(word, word_count[word])
```

The first line here is a bit tricky. `sorted` is a built-in Python operation that sorts the input and returns a list. By default, if we give it a dictionary it will sort the keys alphabetically. Instead, we provide a `key` argument to indicate on what to sort. Here, that is the value of each item, which we can write by asking it to `get` the value for each item.

This would start with the smallest values, so we use `reverse=True` to tell Python to reverse the ordering.

Once we have this list, we print the first 20 words of it. We loop over them, then call print with both the word, and the word count, retrieved by calling `word_count[word]`.

This is what the output looks like:

```
of 78
the 76
to 64
and 55
our 25
their 20
has 20
for 19
in 18
He 18
a 15
these 13
by 13
have 11
them 11
which 10
that 10
all 10
is 10
with 9
```

Obviously English stop words will be the most frequent words appearing in the top of the list. We can filter those out if we want (if we have a list of stop words), or we can just print more of the list (e.g. 50 items) to see more interesting words.

Another issue is that commas and periods will be regarded as part of the word, messing up the count. We want to remove all special characters and only worry about the words. In addition we should consider the *casing*: Python considers the word "People" and "people" as two distinct words. We'll turn everything into lower case so words are countly correctly.

At the top of our file, add the following code:

```python
import string

translator = str.maketrans('','', string.punctuation)
```

This imports an external module called "string" that contains a list of punctuation. The next line creates a *translator* which is a Python construct allowing us to remove all punctuation.

To use this, add the following code right before the `count = word.get` line:

```python
word = word.translate(translator).lower()
```

Give it the same indentation (4 spaces) as the lines below it. This takes the word and removes all special characters.

Run the script again. We'll see that the word "people" is now the most frequent word after all common stop words.

To save this information in a useful format we'll use the `csv.writer` to write out the data as comma-separated values: basically a simple text-based format that we can open in Excel, Google Docs, NodeBox, Processing or D3.

We'll add an import at the top of the file:

```python
import csv
```

Then, add the very end of the file, add the following code:

```python
output_file = open('words.csv', 'w')
writer = csv.writer(output_file)
writer.writerow(['word', 'count'])
for word in word_count_list:
    writer.writerow([word, word_count[word]])
```

This opens a new file, called `words.csv`. Note the extra argument with the `'w'`. This is necessary to tell Python to open the file for writing. This makes sure we have the correct permissions to write to a file.
The next line takes this file (often called the *file handle*) and turns it into a *CSV writer*. This is a special object that has a method called `writerow` allowing us to write CSV data.

CSV files look like this:

```
word,count
of,78
the,77
to,65
and,56
for,28
our,26
their,20
has,20
in,19
```

The CSV writer can output data in this format, making sure that the system doesn't mess up if our actual word contains a comma.

Run the script again. You should now see a `words.csv` file appear. Open it up in your editor and check that it contains the list of words and counts.

Congratulations! You created your first Python data processing job. Here's the [finished Python code](https://gist.github.com/fdb/1c7234fb49757df588c1302f44f0f125), for reference.
