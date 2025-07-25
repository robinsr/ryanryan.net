---
layout: ../../layouts/BlogPost.astro
title: HTML5 Dataset
description: "Dataset allows for valid use of custom HTML attributes, prefixed with \"data-\" Before HTML5 you could use custom attributes at will but it would not be valid HTML. One of the things dataset does is make this practice pass validators and it allows for more easy access of custom attributes with javascript."
pubDate: 2013-03-01T12:00:00Z
category: html
tags: [HTML5,dataset,javascript]
---

Dataset allows for valid use of custom HTML attributes, prefixed with "data-" Before HTML5 you could use custom attributes at will but it would not be valid HTML. One of the things dataset does is make this practice pass validators and it allows for more easy access of custom attributes with javascript.

They look like so:

```html
<p data-excitement="boring"> This is a boring paragraph </p>
<p data-excitement="exciting"> This is an exciting paragraph! </p>
```

You can set and retrieve them using "setAttribute" or "getAttribute" as you normally would to retrieve any attribute.

```javascript
var paragrapghs = document.getElementByTagName('p');
paragraphs[0].setAttribute( "data-excitement","boring" );
paragraphs[0].getAttribute( "data-excitement" ) // returns 'boring'
```


But the better way is to use the dataset object.

```javascript
var paragrapghs = document.getElementByTagName('p');
paragraphs[1].dataset.excitement = "exciting";
paragraphs[1].dataset.excitement // returns 'exciting'
```

Very cool. This spec is really useful for storing data about elements that can be easily accessed by Javascript.