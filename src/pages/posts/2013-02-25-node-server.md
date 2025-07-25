---
layout: ../../layouts/BlogPost.astro
title: Node Server
description: As a web developer, building a node server has a lot of value not only in terms of gaining node programming skill, but also in understanding how web servers and fundamental web technologies such as HTTP work.
pubDate: 2013-02-25T12:00:00Z
category: node
tags: [node, server, HTTP, modules, javascript, require]
---

As a web developer, building a node server has a lot of value not only in terms of gaining node programming skill, but also in understanding how web servers and fundamental web technologies such as HTTP work. I found myself building features for my server that I took for granted using server software such as Apache. For example, the most basic feature of a web server, serving static files, involves receiving the HTTP request, interpreting that request, finding the right directory, setting up the response headers with content-type and the like, then sending the file; at least five steps whereas in Apache it's automatic.

Then there are the more advanced features that also have to be built such as error handling, creating activity logs, running scripts, database access, and security.

The payoff with using a custom built node server is that you know exactly how it works and building one only requires knowledge of Javascript and an open mind (you'll soon see why). So lets start.

```javascript
var http = require('http').createServer(handle);

function handle(req, res){
  // insert server code here...
}
http.listen(8080);
```

## Require? Whats that?

`require` is built into Node and is used to load modules, each of which has unique capabilities. `http` is the node module that supports the functionality of HTTP so that you can send and receive data over the internet.

The first thing we do with it is to use the method `.createServer(handle)` which does exactly what is sounds like. This method opens an access point for HTTP data into our script. "handle" is the function that is called when there is an HTTP request.

`function handle(req, res)` has two arguments, one for `request` which has all of the request data such as `url` and `headers` that we can access to help interpret the intent of the request. They are stored in the request object and accessible through normal dot notation (ie `req.url = "whatever/the/url/uis/html"`). `res` is the response object that we will use top send data back to whomever sent the HTTP request. It's more important methods are "req.writeHead" and "req.end()."

`http.listen(8080)` tells node to listen on a certain port (8080) for incoming requests.

## Made the connection, now do work

```javascript
var http = require('http').createServer(handle);

function handle(req, res){
  res.writeHead(200, {'Content-Type' : 'text/plain'});
  res.end('Hey, you connected to our Node server. Good Job!');
}
http.listen(8080);
```

This is where knowledge of HTTP comes in to play. What the first line of code is doing is writing the content type HTTP headers. Don't know anything about HTTP headers? That's ok, in building a Node server you will become pretty familiar with different types.

The second line of code is ending the HTTP response and as you can see it takes a string as an argument which it sends with the response. This is normally where we would attach some sort of content like HTML or binary data that can make up images, etc. To keep it simple, there's just a string there for now. If you boot up Node, run this Javascript file, and navigate to "http://localhost:8080" you would see our string display in your browser. 