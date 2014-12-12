inscribe.js
===========

**Just do this:**

```javascript
inscribe.store(['/', '/users']);
```

And then you get *100%* decrease in page load times:

Wait what?! Let me explain.

Inscribe is a script that helps you serve up your web pages from the client's storage. Doing so, will minimize the HTTP requests to an **absolute zero**. All the resources needed for the webpage is stored in the user's browser, ready for use at the click of a link.

This is NOT a single page application generator or anything like that. It's almost the opposite. Inscribe is best used with sites that use server-side rendering.

Take a look at the demo for a better understanding.

####The nitty-gritty details

Basically, when passed an Array of urls, Inscribe will make ajax requests to them, compress the HTML fetched and store them.

The transactions to storage are handled by [localForage](https://github.com/mozilla/localForage). Inscribe then adds listeners to the corresponding links on the page. These listeners when activated, will call the function to bring out the HTML from storage and render it. `history.pushstate` is used to manage the browser url.

As for all the external assets, such as images, stylesheets and scripts, they are all embedded into the returned HTML to decrease the need for making web requests at all.

This:

```html
<link rel="stylesheet" type="text/css" href="/asset/css/style.css">
<img src="/asset/img/image.jpg"></img>
<script src="/asset/js/script.js"></script>
```

Will be converted to this:

```html
<style>
.nav {
  background-color: red;
  color: black;
}
</style>

<img src="data:image/jpg;base64,R0lGODlhEAAQAMQAAOR..."></img>

<script>
console.log('hellooo');
</script>
```

Tada! All links that are passed into Inscribe will render at magical speeds when clicked.

####Dependencies
**jQuery** is a dependency of inscribe.js.

jQuery is used in making Ajax requests and DOM manipulation. There will be future releases without it. But for now, just stick to jQuery. :grin:

Just do this:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> <!-- include this first -->
<script src="/path/to/inscribe.js"></script>
```

####A glance at the API

```javascript
inscribe.this();
```
Stores current page user is at into client storage and listen for link clicks.

```javascript
inscribe.store(['/', '/user']);
```
Passed an `Array` of `urls`. These urls are then used to fetch the HTML into the client side storage.


```javascript
inscribe.render('/');
```
Render a page from storage based on `url`.

####inscribe.js is still unstable. Feel free to make pull requests.

