---
layout: ../../layouts/BlogPost.astro
title: A Simple, Bootstrap-like Responive Grid
description: "Bootstrap is usually my starting point when I approach a project (and if you have looked at my projects you would see that right away). I use it because it covers pretty much all my CSS bases and that leaves me time to focus on other parts of the project, like the javascript logic or polishing the UI."
pubDate: 2013-10-17T12:00:00Z
category: css
tags: [CSS,Bootstrap]
---

Bootstrap is usually my starting point when I approach a project (and if you have looked at my projects you would see that right away). I use it because it covers pretty much all my CSS bases and that leaves me time to focus on other parts of the project, like the javascript logic or polishing the UI. But a lot of the time what I really need from bootstrap is just the grid. Fortunately its really easy to imitate twitters grid with just a few CSS classes.

Twitter gives you 12 columns by default, today we're making a 3 column layout. Here are our classes:

```css
.col {}
.col-mobile-3 {}
.col-tablet-2 {}
.col-desktop-1 {}
```

As you can see the class names have a nice naming convention. Stlyes in ".col" will apply to all our column classes. "mobile", "tablet", and "desktop" are going to be the devices we write our media queries for. Following the mobile-first approach, we'll write our media queries to "size-up" our content meaning that the mobile layout's CSS will not be in a media query, but the tablet and desktop CSS will be.

```css
/* Mobile stuff */
@media screen and (min-width: 507px) {
/* Tablet Stuff */
}
@media screen and (min-width: 768px) {
/* Desktop Stuff */
}
```

The base ".col" class looks like this:

```css
.col {
    position:relative;
    float: left;
}
```

Then the device specific classes set the width of the elements:

```css
.col-mobile-3 {
    width: 100%;
}
@media screen and (min-width: 507px) {
    .col-tablet-2 {
        width: 50%;
    }
}
@media screen and (min-width: 768px) {
    .col-desktop-1 {
        width: 33%;
    }
}
```

And thats it. To set a div that spans a third of the screen at desktop, half at tablet, and the full screen at mobile apply all classes (and the containing element needs to have a width set also):

```html
<div clsss="col col-mobile-3 col-tablet-2 col-desktop-3">
    I resize!
</div>
```