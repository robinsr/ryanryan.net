---
layout: ../../layouts/BlogPost.astro
title: Binding a backbone model to the query string
description: "It's very common to use backbone's router to drive application state with the window's url. The basic idea is that popstate or hashchange events are matched to a hash of routes and invoke a handler function. This approach works well for changing views, but not so well for setting application state."
pubDate: 2015-10-21T12:00:00Z
category: javascript
tags: [Backbone,javascript]
---

It's very common to use backbone's router to drive application state with the window's url. The basic idea is that popstate or hashchange events are matched to a hash of routes and invoke a handler function. This approach works well for changing views, but not so well for setting application state. For example, consider these routes:

```js
var routes = {
  '(/)'           : 'index',
  'posts'         : 'showPostList',
  'posts/:postId' : 'showPost'
}
```

This works great if you want to show a list of posts and an individual posts. But what if on the posts list page you want to filter by author. You might be tempted to write a route like this:

```js
var routes = {
  'posts?author=:authorName'
}
```

This wont work. Backbone's router doesn't read query string parameters. To get these values, I suggest making a backbone model that is binds to the query string and automatically updates its attributes on popstate changes. Going a step further, updating the model should update the query string.

While it would be great to use the HTML5 pushState api, its actually "disabled" on iOS. As far as I can tell, this essentially means its not supported at all. So instead of get into the nitty-gritty of hacking a solution for iOS I will just use [this](https://github.com/rackt/history "rackt/history") library for reading and writing to the url.

The basic model looks like this:

```js
var createHhistory = require( 'history' ).createHistory;
var useQueries     = require( 'history' ).useQueries;

var history = useQueries( createHistory )();

var QueryStringModel = Backbone.Model.extend( {
  
  initialize: function ( opts ) {
    // only track attributes configured 
    this.track = opts.track;
    // flag for prevent infinite loops from occurring
    this.isPopstate = false;
    // setup a listener to url changes
    history.listen( this._pop );
    // setup a listener for model changes
    this.listenTo( this, 'change', this._push );
  },
    /**
     * Handles history change events
     */
  _pop: function ( location ) {
    // history will invoke this callback on POP, REPLACE, and PUSH, s
    // so short-circuit on all but POP events
    if ( location.action !== 'POP' ) {
      return;
    }
    // compile an object of attributes to update
    var params = location.query;
    var toUpdate = _.pick( params, this.track );
    // set isPopstate flag to true
    this.isPopstate = true;
    // update the model
    this.set( toUpdate );
    // reset isPopstate flag to false
    this.isPopstate = false;
  },

  _push: function () {
    // short circuit if flag is true (ie, this model change event was
    // triggered by this._pop)
    if ( this.isPopstate ) {
      return;
    }
    // pick the tracked attributes
    var params = _.pick( this.attributes, this.track );
    // push them up
    history.pushState(null, window.location.pathname, params );
  }
} );
```

Using the model would like this:

```js
var myAppModel = new QueryStringModel( {
  page: 1,
  sort: 'date'
}, {
  track: [ 'page', 'date' ]
} );
```

Or as a base model to extend From

```js
var AppModel = QueryStringModel.extend( {
  defaults: {
    page: 1,
    sort: 'date'
  }
} );

var myAppModel = new AppModel( {}, {
  track: [ 'page', 'date' ]
} );
```

Now you can listen to changes on this model and render your views accordingly. 