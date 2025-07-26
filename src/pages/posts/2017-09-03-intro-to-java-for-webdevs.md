---
layout: ../../layouts/BlogPost.astro
title: "Java for Web Engineers: Recursively Decaffeinating a Codebase"
pubDate: 2017-09-03T12:00:00Z
category: backend-tools
description: "You're a frontend engineer. You're used to Node and TypeScript. But the backend is written in Java — and it's time to get your hands dirty. This post walks through a practical Java program that scans directories and runs decaffeinate on old CoffeeScript files."
tags: [java, backend, webdev, tooling, recursion, subprocess]
---

## Java for Web Engineers: Recursively Decaffeinating a Codebase

You’re a frontend developer. You write in TypeScript, React, maybe some Node. But the service behind that app — the one you need to integrate with or debug — is written in Java.

This happens a lot.

And when it does, it helps to know just enough Java to be dangerous.

In this post, we’ll write a Java program that:

- Walks a directory tree
- Finds `.coffee` files
- Runs [`decaffeinate`](https://decaffeinate-project.org/) on each

It’s a nice excuse to learn:

- How to read and recurse through directories in Java
- How to check file types
- How to spawn subprocesses (like Node’s `child_process.exec`)
- And how to write Java that feels at least somewhat ergonomic

---

## What We’re Building

We want to write a command-line program that looks at your current working directory and finds every `.coffee` file under it. For each file, it will:

- Spawn a `decaffeinate` subprocess in the file’s directory
- Run `decaffeinate somefile.coffee --use-js-modules`
- Print the exit status

The catch: decaffeinate wants to be run from the directory that holds the file — so we’ll need to manage CWDs as we go.

---

## Getting Started

Install decaffeinate globally:

```bash
npm install -g decaffeinate
```

Create a new file: `Decaf.java`

You can compile and run it with:

```bash
javac Decaf.java && java Decaf
```

Let’s start with a minimal skeleton:

```java
public class Decaf {
  public static void main(String[] args) {
    System.out.println("Hello from Java");
  }
}
```

Yes, everything in Java is in a class. And yes, the filename and class name have to match. Roll with it.

---

## Reading the Current Working Directory

Java exposes environment info through `System.getProperty()`.

```java
String dir = System.getProperty("user.dir");
System.out.println("Working Directory = " + dir);
```

We’ll pass that to a recursive `scan()` function that does all the real work.

---

## Recursively Scanning Directories

To scan a directory, we’ll:

- Turn the path into a `File`
- Get the list of files using `.listFiles()`
- Convert that array into a `Stream` via `Arrays.asList()` → `ArrayList`

```java
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;

private static void scan(String path) {
  File folder = new File(path);
  ArrayList<File> files = new ArrayList<>(Arrays.asList(folder.listFiles()));

  files.stream().forEach(file -> {
    String fullPath = file.getAbsolutePath();
    if (file.isDirectory()) {
      scan(fullPath);
    } else if (fullPath.matches(".*\\.coffee$")) {
      runDecaffeinate(file);
    }
  });
}
```

We’re using Java 8’s stream API here because it’s a bit more expressive — closer to JavaScript’s `forEach`. This is purely for readability. You could just as easily use a `for` loop.

---

## Spawning Subprocesses (the Good Stuff)

Here’s the code to spawn `decaffeinate` on each file:

```java
private static void runDecaffeinate(File file) {
  String fileName = file.getName();
  String command = String.format("decaffeinate %s --use-js-modules", fileName);
  File directory = new File(file.getParent());

  System.out.println(String.format("Executing: %s in %s", command, directory.getPath()));

  try {
    Process subDecaf = Runtime.getRuntime().exec(command, null, directory);
    subDecaf.waitFor();
    System.out.println("Exit code: " + subDecaf.exitValue());
  } catch (Throwable t) {
    t.printStackTrace();
  }
}
```

Java’s `Runtime.getRuntime().exec()` is basically its version of `child_process.exec`. It’s clunky but works.

Important bits:

- We pass the file’s parent directory as the working directory
- We use `waitFor()` before asking for the exit code
- We catch and print any exceptions

---

## Putting It All Together

```java
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;

public class Decaf {
    public static void main(String[] args) {
        String dir = System.getProperty("user.dir");
        System.out.println("Working Directory = " + dir);
        scan(dir);
    }

    private static void scan(String path) {
        File folder = new File(path);
        ArrayList<File> files = new ArrayList<>(Arrays.asList(folder.listFiles()));

        files.stream().forEach(file -> {
            String fullPath = file.getAbsolutePath();
            if (file.isDirectory()) {
                scan(fullPath);
            } else if (fullPath.matches(".*\\.coffee$")) {
                runDecaffeinate(file);
            }
        });
    }

    private static void runDecaffeinate(File file) {
        String fileName = file.getName();
        String command = String.format("decaffeinate %s --use-js-modules", fileName);
        File directory = new File(file.getParent());

        System.out.println(String.format("Executing: %s in %s", command, directory.getPath()));

        try {
            Process subDecaf = Runtime.getRuntime().exec(command, null, directory);
            subDecaf.waitFor();
            System.out.println("Exit code: " + subDecaf.exitValue());
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }
}
```

---

## Final Thoughts

Java’s not glamorous. But it’s sturdy. And knowing just enough to recurse over a filesystem, run a CLI, and work with the Stream API can save you a ton of pain when backend services don't speak your preferred language.

I wrote this around the time I was promoted from WDE to SDE II at Amazon, and I’ve since lost count of how many frontend engineers I've seen benefit from a working knowledge of "boring old Java."

Hopefully this gives you a good jumpstart.
