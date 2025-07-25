---
layout: ../../layouts/BlogPost.astro
title: Single Page App with Vanilla ES6 | Part 2
description: In the second installment we will finish rendering the whole app as well as add some basic URL routing to control the state of our app
pubDate: 2016-05-09T12:00:00.000Z
category: javascript
tags: [javascript, es6, gulp, browserify]
---

Find the first installment of this series [here](/posts/2016-05-07-vanilla-es6-spa-1)

When our app is finished we will have forward and backward controls. They wont, however, be buttons that trigger some javascript function. Instead they will be simple links that change the hash of the URL, triggering our app to update with new parameters. Those parameters will be the month and year. So for example we would have a URL like: `http://localhost:8080#/05/2016`. To accomplish this we need to do a few things: First the app needs to be aware that the URL changed. Second the app needs to parse the values. Third the app needs to store those values as state. Lets setup a model that will store the state.

### The Model

The responsibility of the model is to manage our app's data directly. It stores it (known as app state) and provides methods for retrieving, filtering, manipulating it. The basic model will like this:

```javascript
// model.js

import moment from 'moment';

export default class Model {
  constructor() {
    this.now = moment().day(15);
  };
  setDate(month, year) {
    this.now.month(month).year(year);
  };
}
```

We're setting up an instance property called `now` that points to a moment instance. For our use case its safer to default the day of the month to the 15th. This is to avoid a bug that skips a month if the current day of the month is, for instance, the 31st. 

The `setDate` method manipulates our `now` property, setting the moment instance to that month and year. 

In the future we will expand the Model type quite a bit, but this is enough to get us going. Lets now focus on making our app aware of the URL change.

### Utilities

Now is a convenient time to setup our `util.js` file. You could call it `lib.js` as it functions in the same way as a library: you'll see they are somewhat standalone and you could reuse them in many projects. The first util will be `$on`. It will attach a function to an event emitted by a target. I called it "$on" because its a little like jQuery's `on()`. It looks like this:

```javascript
// util.js

const $on = (target, event, handler) => {
  return target.addEventListener(event, handler);
};

export { $on };
```

We can start using this util right away in our `main.js` file:

```javascript
// main.js

import { $on } from './util';

// ...

//window.addEventListener('load', () => app.init());
$on(window, 'load', () => app.init());
```

### The controller

The controller has two main responsibilities. It sends commands to the model to update the data and it sends commands to the view to change the presentation. Usually it just acts as an intermediary between the view and model, and in a simple app like ours you will see that it is a pretty terse module. It will contain the logic that parses the month and year parameters out of the URL hash;

```javascript
// controller.js

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  };
  render(){
    this.view.render(this.model.toJSON());
  };
  setView(hash) {
    var validURL = /^#\/[\d]{2}\/[\d]{4}$/.test(hash);

    if (validURL) {
      var matches = hash.match(/^#\/([\d]{2})\/([\d]{4})$/);
      var month = parseInt(matches[1], 10) - 1;
      var year = parseInt(matches[2], 10);

      this.model.setDate(month,year);
    }

    this.render();
  };
}
```

Again we're using an ES6 class (remember JavaScript doesn't actually have classes) and it store the parameters to the constructor as instance properties so we can reference them in the instance methods. `setView` does the work of parsing the URL hash. If it can validate the parameters are indeed a month and year (though the validation could be more robust) it will call the model's `setDate` method. Ultimately it calls the view's `render` method and notice that its passing in data it gets from the model so we're going to need to give our model a `toJSON` method.

```javascript
// model.json

export default class Model {
// ...
  toJSON() {
    const iso = this.now.toISOString();

    return { iso };
  };
}
```

If you are unfamiliar with the syntax used in the return statement, that is an es6 object shorthand. It essentially says, we have a local variable `iso`, make an object with an `iso` property that has the same value. You can [read more about that here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer). Now that the model is returning an object with an `iso` property, lets modify the view to use that.

```javascript
// view.js
export default class View {
  // ...
  render(data) {
    this.el.innerHTML = controls(data);
  };
}
```

And lets modify the template to accept data from the view.

```javascript
// template.js
const controls = data => {
  const curr = moment(data.iso);
  const next = moment(data.iso).add(1, 'month');
  const prev = moment(data.iso).subtract(1, 'month');
  return html`
    <div id="controls">
      <a class="item" href="#/${prev.format('MM')}/${prev.format('YYYY')}">Back one month</a>
      <p class="item">${curr.format('MMMM')}, ${curr.format('YYYY')}</p>
      <a class="item" href="#/${next.format('MM')}/${next.format('YYYY')}">Forward one month</a>
    </div>
  `;
};
```

The last thing we need to do is setup our controller in `main.js` and add the listener for the URL change. We can use our handy util for that.

```javascript
// main.js

import { $on } from './util';
import View from './view';
import Model from './model';
import Controller from './controller';

class App {
  constructor() {
    const model = new Model();
    const view = new View();
    this.controller = new Controller(model, view);
  };
}

const app = new App();

const setView = () => {
  app.controller.setView(document.location.hash);
}

$on(window, 'load', setView);
$on(window, 'hashchange', setView);
```

Build the app again using `gulp js` (or if you have been running `gulp watch` then you're good to go). Refresh your browser and you should be able to use the controller to move the month forward and backward. 

The last piece to get in place is rendering all of the days for a particular month. We'll need to modify the model to return an array of days, and we'll need to add a template to loop over the array and add a `<li>` for each day. The template should look something like this:

```javascript
// template.js

const controls = data => {
  // ...
};

const day = data => html`
  <li data-iso="${data.iso}">
    <p class="date">${ moment(data.iso).format('D') }</p>
  </li>
`;

const calendar = data => html`
  ${controls(data)}
  <ul id="calendar" class="full-width weeks-${data.weekCount}">
    ${data.days.map(data => day(data))}
  </ul>
`;

export { calendar };
```

`controls` is now a partial that is being called from a wrapper template `calendar`. We are then mapping each of the days by passing it through the `day` template function. We'll need to modify `view.js` to use the new function.

```javascript
// view.js

import { calendar } from './template';

export default class View {
  // ...
  render(data) {
    this.el.innerHTML = calendar(data);
  };
}
```

As for the model, we'll use `this.now` to determine the month, then using the handy methods in momentjs we'll construct an array of days in that month and ultimately return that in our `toJSON` method.

```javascript
// model.js

import moment from 'moment';

export default class Model {
  // ...
  getDays() {
    const days = [];
    const calendarStart = moment(this.now).startOf('month');
    const calendarEnd = moment(this.now).endOf('month');
    const timeRange = calendarEnd.valueOf() - calendarStart.valueOf();
    const daysInView = Math.floor(moment.duration( timeRange ).asDays());

    for (let i = 0; i <= daysInView; i++) {
      days.push({
        iso: moment(calendarStart).add(i, 'days').toISOString()
      });
    };

    return days;
  };
  toJSON() {
    const iso = this.now.toISOString();
    const days = this.getDays();

    return { iso, days };
  };
}
```

Rebuild and refresh. You should see a list of number representing the days in that month. Moving the calendar forward and backward will change the days that show (but most will look pretty identical at this point).

In the part 3 we will add some style to our app using SASS, modify the gulpfile to build our stylesheet, and add appointments.

[Complete Code](https://github.com/robinsr/calendar-tutorial/tree/part-2)