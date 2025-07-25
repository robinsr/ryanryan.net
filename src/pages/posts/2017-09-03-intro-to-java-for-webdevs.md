---
layout: ../../layouts/BlogPost.astro
title: An Introduction to Java for WebDevs
description: "This tutorial is intended to give webdevs a quick introduction to Java as it is relevant in many of our day-to-day lives. I'll be explaining basic concepts that can be built on later as one's Java experience grows. We'll be covering creating and running a basic command line program, working with files and directories, working with Java Collections via ArrayList and the stream API, and spawning child processes"
pubDate: 2017-09-03T12:00:00Z
category: java
tags: [java]
---

This tutorial is intended to give webdevs a quick introduction to Java as it is relevant in many of our day-to-day lives. I'll be explaining basic concepts that can be built on later as one's Java experience grows. We'll be covering creating and running a basic command line program, working with files and directories, working with Java Collections via ArrayList and the stream API, and spawning child processes. 

***

Let's write a quick Java program that will walk a directory of source coffeescript files and convert them to Javascript. We'll be using an npm module called `decaffeinate` which we'll run as a sub process of our Java program. First let's install the module globally:

```
npm install -g decaffeinate
```

You can then invoke it on a coffeescript file in your terminal with `decaffeinate somefile.coffee`. We're also interested in keeping things node 6 compliant so we'll want to keep the commonJS style requires. Our command will look more like `decaffeinate somefile.coffee --use-js-modules`. One complication to this process is that decaffeinate only works on files in the current working directory, so we'll have to manage that as well.

To get started, create a new java class `Decaf.java`. You can build and run this file in your terminal with `javac Decaf.java && java Decaf`. The first command compiles your java file to a class file and the second command runs it in the JVM. The basic java program looks like this:

```java
// Decaf.java
public class Decaf {
  public static void main(String[] args) {
    System.out.println("Hello");
  }
}
```

Some things to note about this basic program:

* `public class Decaf`. Pretty much everything in Java is going to be in a class, simple command line programs are no exception. You need to name the class the same name as the filename or you will get a compile error. Finally you need to make this class public so that the JVM can invoke it. If it were private then you would get another compile error. You might ask _if it has to be public then why have the access modifier at all?_ The answer is there are many ways Java could be less verbose, but its not, so just go with it.
* `public static void main(String[] args)`. It's also required that you have a `main` method in your program somewhere. The signature `String[] args` is an array of strings passed into the program when invoked. This method also has to be public so that it can be invoked outside of this file. It also has that `static` keyword meaning that you don't need to make an instance of `Decaf` to access that method (ie `Decaf decafInstance = new Decaf()`). Finally there's `void`. This is the return type of this method. Every method in Java has one return type and its required.
* `System.out.println`. This is equivalent to `console.log`. Also note that strings have to have double quotes. Single quotes are used for something else.

OK, so the basic flow of our program is going to look like this:

1. Scan directory for files
2. For each file:
  A. If it is a directory, scan it too (we'll use recursion)
  B. If it is a file, is it a coffeescript file?
    1. Only if yes, run the `decaffeinate` command

So looking at what our program is going to do, we'll need a way of reading a directory, distinguishing files from directories, checking the file type, and running a system command. We'll also make use of recursion so we need a method we can invoke with a path. We also need a starting point in our filesystem. Java exposes this through `System.getProperty("user.dir")`. Our main method will call our recursive method with that starting point. Let's add that

```java
private static void scan(String path) {}

public static void main(String[] args) {
    String dir = System.getProperty("user.dir");
    System.out.println("Working Directory = " + dir);
    scan(dir);
}
```

We are going to assume that `scan` is only called with a directory path and not a filepath. Now we need to scan the directory for its files. To do this we need to make a `File` object and call `listFiles()`. This returns an array of string paths.

Before we continue I'm going to add a bit of a complication just because I want to. We could get our array of paths and iterate over it using a traditional `for` loop or something. I want to use Java 8's stream API because its a bit more functional looking and we as webdevs are into that. It's done purely for style and readability, not efficiency. Javascript gives us array methods like `forEach` and `map` that take functions are arguments. Arrays in Java dont, but it has this similar thing called "Collections". We can convert our array into a type of collection and then foreach it. The relevant collection object here is `Arraylist`. Creating an array list from our string array is pretty simple:

```java
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;

private static void scan(String path) {
  File folder = new File(path);
  ArrayList<File> files = new ArrayList<>(Arrays.asList(folder.listFiles()));
}
```

More things to note:

* `import`. Just like nodeJS, Java requires you import your modules (or I should say, "classes"). By default Java automatically imports `java.lang` so that's why there are global-like objects such as `System` and `String` (and further down we'll see `Process` and `Runtime`).
* `File folder = new File(path);`. Basic constructor stuff here.
* `Arrays.asList(folder.listFiles())`. We're using the `listFiles()` method and passing the resulting string array to `Arrays.asList`. This handy util method is necessary because the ArrayList constructor doesn't take an array as an argument, but rather it needs an collection. `asList` does the conversion for us.
* `ArrayList<File> files`. The angle brackets here are important. They're called generics and it's used here because ArrayList needs to know what type of thing it's working with, in this case we'll have an ArrayList of File objects.

Now we need to iterate over these File objects and determine if they are files or directories.

```java
// #scan()
files.stream().forEach(file -> {
  if (file.isDirectory() {
    scan(file.getAbsolutePath());
  }
});
```

You can see that the Collection's Stream API looks and feels similar to Javascript's Array methods like `foreach` and `map`, only we had to go through the extra effort of converting the array to an ArrayList. Like I said, this is for readability (and fun), not for efficiency. The `File` methods used here are pretty self explanatory, bit its worth pointing out that because we gave `ArrayList` a type (`ArrayList<File>`) we know that when we iterate with `forEach` we will be working with a `File` object. And notice we are sticking to our above agreement that `scan()` can only be called with a directory path.

We can now assume our `File` object is pointing to an actual file (not a directory), but we still need to check if its a coffeescript file. Java itself doesn't provide a way of just getting the file extension, though many libraries do. Let's just regex it using `String#match()`

```java
// #scan()
files.stream().forEach(file -> {
  String fullPath = file.getAbsolutePath();
  if (file.isDirectory() {
    scan(fullPath);
  } else if (fullPath.matches(".*\\.coffee$")) {}
});
```

More things to note:

* `fullPath.matches(".*\\.coffee$")`. Normal regular expressions rules apply but regexs are written in strings and backslashes for character literals need to be escaped.

Now we have a coffeescript file, we need to decaffeinate it which means spawning a sub process. Similar to NodeJS's `child_process` modules, Java provides `Runtime`. Once you have the runtime object of your current program, you can start creating sub processes through it's `exec()` method. `exec()` will even let us specific environment args (which will just be `null` for now) and a cwd.

```java
// #scan()
try {
  File directory = new File(file.getParent());
  Process subDecaf = Runtime.getRuntime().exec("echo 'Hi'", null, directory);
  subDecaf.waitFor();
  System.out.println("Process exited with: " + subDecaf.exitValue());
} catch (Throwable t) {
  t.printStackTrace();
}
```

More things to note:

* `File directory = new File(file.getParent());`. To be used as our CWD of the process. `exec()` expects a file, not a string, so we have to create one for it.
* `subDecaf.waitFor();`. `waitFor()` is required before we can get the exit value of our subprocess otherwise the process will not have exited and we'll get a NullPointerException.

The only thing left to do is create our actual command.

```java
String fileName = file.getName();
String command = String.format("decaffeinate %s --use-js-modules", fileName);
```

Altogether the Java class looks like this:

```java
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;

public class Decaf {
    private static void scan(String path) {
        File folder = new File(path);
        ArrayList<File> files = new ArrayList<>(Arrays.asList(folder.listFiles()));

        files.stream().forEach(file -> {
            String fullPath = file.getAbsolutePath();
            if (file.isDirectory()) {
                scan(fullPath);
            } else if (fullPath.matches(".*\\.coffee$")) {
                String fileName = file.getName();
                String command = String.format("decaffeinate %s --use-js-modules", fileName);
                File directory = new File(file.getParent());
                System.out.println(String.format("Executing command `%s` at dir (%s)",
                  command, directory.getPath()));

                try {
                    Process subDecaf = Runtime.getRuntime().exec(command, null, directory);
                    subDecaf.waitFor();
                    System.out.println("Process exited with: " + subDecaf.exitValue());
                } catch (Throwable t) {
                    t.printStackTrace();
                }
            }
        });
    }

    public static void main(String[] args) {
        String dir = System.getProperty("user.dir");
        System.out.println("Working Directory = " + dir);
        scan(dir);
    }
}
```

Interestingly enough, doing the same thing in NodeJS poses a different challenge. Since everything is asynchronous in NodeJS, we would run into the problem of spawning potentially hundreds of sub processes of `decaffeinate` and then exiting before they complete (and I believe node would kill them at that point). So to get around this you would have to use a library like `async` and manage the asynchronous control flow carefully.

So there it is, a quick intro to Java. We covered creating and running a basic command line program, working with files and directories, working with Java Collections via ArrayList and the stream API, and spawning child processes. 

Here's all the methods we used:

* `java.lang.System.getProperty`
* `java.lang.System.out.println`
* `java.lang.String.matches`
* `java.lang.String.format`
* `java.lang.Runtime.getRuntime`
* `java.lang.Runtime#exec()`
* `java.lang.Process#waitFor()`
* `java.lang.Process#exitValue()`
* `java.utils.Arrays.toList`
* `java.utils.ArrayList#forEach()`
* `java.io.File#getAbsolutePath()`
* `java.io.File#isDirectory()`
* `java.io.File#getName()`
* `java.io.File#getParent()`
* `java.io.File#getPath()`
