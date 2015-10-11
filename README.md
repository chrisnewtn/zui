Zui
===

Zui is a prototype for a [Zooming User Interface][1] concept.

The idea is for an infinitely nested set of iframes, called "Zuis" (or something better.) Each Zui uses a small core set of CSS, JS, as well as a template. The user navigates around by zooming in and out of the Zuis. The nesting, an indication of some relationship between the Zui, its parent Zui, and child Zuis.

As iframes are sandboxed, I imagine communication will be handled either via a worker, or iframe to iframe using the [postMessage][2] API.

The core Zui code should just be responsible for routing and communication, that's it. Everything else is either bespoke or shared only between the Zuis that need them.

I'm going build a bunch of apps for it. Mostly, they'll be there to inform and remind me of events regarding subjects I'm interested in. For example when new comics are released, movies come out, new episodes of TV shows air, etc. Stuff I care about, but tend to forget about.

At the end of it, I intend to have something that can provide me with a constant overview of all the information I tend to scrape and cobble together using public APIs, with the concepts of varying levels of information density, nested relationships and limited user interaction at its core.

### Progress

At the moment, I've just about got the zooming concept more or less down. The next step is sorting out my super flakey, proof-of-concept JavaScript. Then, refining the look and coming up with some common, reusable CSS. Finally, using that core, I'll build out some example Zuis and see if this idea is actually any good or not.

[1]: https://en.wikipedia.org/wiki/Zooming_user_interface
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
