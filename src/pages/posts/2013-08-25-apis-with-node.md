---
layout: ../../layouts/BlogPost.astro
title: APIs with Node
description: "With a little work, node can be used as a complete web server, but it's probably something you shouldn't do. Node's speed is limited when it comes to traditional web-server applications because it runs inside an interpreter (like all javascript) and just wont be as as fast at things like reading from disk."
pubDate: 2013-08-25T12:00:00Z
category: node
tags: [javascript,api,node]
---

With a little work, node can be used as a complete web server, but it's probably something you shouldn't do. Node's speed is limited when it comes to traditional web-server applications because it runs inside an interpreter (like all javascript) and just wont be as as fast at things like reading from disk. So instead of putting the workload of static file requests on node we should instead us it for something that it excels at; compiling and serving JSON docs. You can leave the rest to Nginx, Apache or whatever web server program you like.


### Web APIs

"Web API" is usually a synonym for web service which differs dramatically from a web site. It boils down to this: a web-site offers a complete application (think, www.facebook.com, www.twitter.com, etc) whereas a web-service offers data (raw Facebook feeds or raw twitter feeds). The format is usually JSON but not uncommonly XML.


For [TinyBudget](href="http://demos.ethernetbucket.com/TinyBudget"), I designed the application to use a single, static html file that was populated with a user's data using KnockoutJS' MVVM pattern. The data that knockout uses is requested via ajax and is in JSON format. A typical request would be to get all of a user's items for a particular month. This is how I handled that:

### Defining the Request

Like everything in life, web APIs function becaue of social contract, and by that I mean beacuse we've already aggreed on the rules. In this case the rules governed how the API is to be talked to. Web APIs must be shown proper respect, anything less and you will surely suffer burning hell fire. To please the API, follow the documentation carefully. But since this article is about making an API you can craft your psuedo-god into whatever you want. (But this reminds of a very important rule to follow while programming: document everything. Otherwise debugging is absolutely terrible). So I've documented my API call like this:


| Method | Requires | Optionsl | Returns | Example Call | 
| ------------- | ------------- | ------------- | -------------- | -------------- | 
| getMonth    | name, sess, year, month | none      | JSON Object: { items:array }      | getMonth?name=cary&amp;sess=3a987f1b8bf87f1e990e6272c0b51960&amp;month=4&amp;year=2013 | 


This doc outlines the name of the method, what parameters are required or optional, what the return object will look like, and what an example call looks like. This API takes all the parameters in the URI string (which isn't a great idea as its less secure, but hey, this is for demonstration)


### Making the Call

Using jQuery, you can make your ajax call like so:

```javascript
function getMonth (year, month, name, sessionId){
   var error = null;
   var reqUrl = [
      "getMonth?name=",
      name,
      "&sess=",
      sessionId,
      "&month=",
      month,
      "&year=",
      year
   ];
   $.ajax({
       url: reqUrl.join(''),
       type: 'GET',
       error: function(){
          error = true;
       },
       complete: function(data){
          console.log(error,data.status,data.responseText);
       }
   });
}
```

### Handling the call

On the server side, we need to build a function that handles the request. To see how to handle an HTTP request, read <a title="Demos Ethernet Bucket - HTTP Hanlder Function" href="httphandlerfunction">this</a>. The basic concept is you can match the req to a function based on its URL and then pass the request and response objects to the function on invocation. So our function will be called &quot;getMonth&quot;

```javascript
var databaseUrl = "yourdatabase"
  , collections = ["users", "items","sessions"]
  , db = require("mongojs").connect(databaseUrl, collections)
  , nodeurl = require('url')
  , qs = require('qs')
  , async = require('async');

function getMonth(req, res) {
    var query = qs.parse(nodeurl.parse(req.url).query);
    var return_ob = []
    var args = {
        owner:query.name,
        year:parseInt(query.year),
        month:parseInt(query.month)
    }
    db.items.find(args,function(err,pointers){
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database Error');
        } else {
            async.each(pointers,function(thisPointer,cbb){
                console.log('finding '+thisPointer.itemid);
                db.items.findOne({itemid:thisPointer.itemid},function(err,thisItem){
                    thisItem.amt = (thisItem.amt/100).toFixed(2);
                    return_ob.push(thisItem)
                    cbb(null);
                })
            },function(){
                 res.writeHead(200, { 'Content-Type': 'application/json' });
                 res.end(JSON.stringify({items: return_ob}));
            })
        }
    })
}
```

After our HTTP handler calls this function (passing along the request and response objects), I parsed the request URL using the built in URL module and the extra QS (querystring) module. This gives my the request parameters in a javascript object. I then set up two objects; one will be what I eventually pass back to the client, the other is arguments to give to MongoDB (where the user's data is stored, obviously) that include parts of the query parameters. It's worth mention that you should probably do something to limit the size of the request parameters or escape them so as to prevent malicious queries on your database. The database either errs out or returns a list of items. If there is an error we can respond to the client using the request object

```javascript
res.writeHead(500, { 'Content-Type': 'text/plain' });
res.end('Database Error);
```

If there is no error, using Async I can make database queries for each item and add them one-by-one to the return object by using &quot;push&quot; (Side note: since for this application we're getting a user's expenditures and since MongoDB doesn't support the decimal data-type, items' monetary values are store as integers and then converted to decimal after being pulled from the database).

After all the items are loaded into the return object, I use the response object's method writeHead to configure the response's HTTP code. Finally, the requested is ended with the requested data nicely stringified for the client to use. 