---
layout: ../../layouts/BlogPost.astro
title: Beginning Ajax
description: "Ajax is a method of using Javascript to load resources without causing the page to be refreshed. Traditionally when you click a link on a webpage, the browser asks for that page and renders it in place of the previous page. Ajax offers an alternative for situations when page refreshes aren't ideal."
pubDate: 2013-04-06T12:00:00Z
category: javascript
tags: [ajax,javascript]
---

Ajax is a method of using Javascript to load resources without causing the page to be refreshed. Traditionally when you click a link on a webpage, the browser asks for that page and renders it in place of the previous page. Ajax offers an alternative for situations when page refreshes aren't ideal, such as smoothly transitioning from page to page in a web app or loading additional content onto an already loaded page. 
What we're going to build today is a webpages that pieces together modules using ajax.

### Ajax Basics

if you remember nothing from this tutorial except one thing, let it be this: XHRHttpRequest. It's a javascript object that makes HTTP requests without loading the page. it has a few methods that are really important.

*    open()
*    send()
*    onreadystatechange

Ok, technically 'onreadystatechange' isn't a method but an event. But you typically see these method/events used in conjunction. To use them, open a script tag and create an instance of your ajax object like so

```html
<script>
  var ajaxMagic = new XMLHttpRequest();
</script>
```

Next you would use open() to specify three things:

*    The HTTP method, usually either GET or POST
*    The URL where the request is being sent to
*    A true/false to indicate whether this is an asynchronous request (it is)

```html
<script>
  var ajaxMagic = new XMLHttpRequest();
  ajaxMagic.open("GET","/testAjax.txt",true);
  ajaxMagic.send();
</script>
```

Notice we also sent the request using the "send()" method. Also our URL is pointed towards a text file. create that text file in the same directory as the HTML doc your working on and title it obviously 'testAjax.txt'. The request is going to load the content of the file so be sure to put some contents insides such as  "Yes, ajax works!"

Moving along with our function, you need a way of knowing when the request has come back. There's two HTTP conventions to be familiar with here. The first is the HTTP status codes (such as 404 not found and 200 ok).  We want our response to come back '200'. The second is 'readyState' which is a number 0-4 that changes depending on the state of our request. They are


*    0 The request is not initialized
*    1 The request has been set up
*    2 The request has been sent
*    3 The request is in process
*    4 The request is complete

When our ajax request is complete will be at readyState 4 and HTTP status 200. We can detect each time the ready state changes by using the event 'onreadystatechange' to trigger a function.

```html
<script>
  var ajaxMagic = new XMLHttpRequest();
  ajaxMagic.open("GET","/testAjax.txt",true);
  ajaxMagic.send();
  ajaxMagix.onreadystatechange = function(){
    // work with the results here
  }
</script>
```


Our function is going to expect the response to be done, so we need a way of stopping it if the ready state is only 2 or 3.

```html
<script>
  var ajaxMagic = new XMLHttpRequest();
  ajaxMagic.open("GET","/testAjax.txt",true);
  ajaxMagic.send();
  ajaxMagic.onreadystatechange = function(){
    if ((ajaxMagic.readyState == 4) && (ajaxMagic.status == 200)){
      // work with results here
    }
  }
</script>
```

Now to access the results

```html
<script>
  var ajaxMagic = new XMLHttpRequest();
  ajaxMagic.open("GET","/testAjax.txt",true);
  ajaxMagic.send();
  ajaxMagic.onreadystatechange = function(){
    if ((ajaxMagic.readyState == 4) && (ajaxMagic.status == 200)){
      var resultsOfOurRequest = ajaxMagic.responseText;
      console.log(resultsOfOurRequest);
    }
  }
</script>
```

If you check your javascript console you will see the contents of you txt file. From here you can do what you please. Lets try to put the results on the page by creating a paragraph element

```html        
<script>
  var ajaxMagic = new XMLHttpRequest();
  ajaxMagic.open("GET","/testAjax.txt",true);
  ajaxMagic.send();
  ajaxMagic.onreadystatechange = function(){
    if ((ajaxMagic.readyState == 4) && (ajaxMagic.status == 200)){
      var resultsOfOurRequest = ajaxMagic.responseText;
      console.log(resultsOfOurRequest);

      var paragraph = document.createElement('p');
      paragraph.appendChild(document.createTextNode(resultsOfOurRequest);

      document.body.appendChild(paragraph);
    }
  }
</script>
```

In the next article we're going to use these methods to get Flickr img urls and make a HTML page full of pics.