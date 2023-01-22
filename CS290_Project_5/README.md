# Assignment 5
**Assignment and Code Blog entry due at 11:59pm on Wednesday, 12/1/2021**<br/>
**Demo due by 11:59pm on Friday 12/10/2021**

The goal of this assignment is to start working with Handlebars and Express.  The code that's currently in this repo implements a site that's served completely statically.  Specifically, there is a directory `public/` that contains a number of static files that are served by a simple Express server in `server.js`.  Your job in this assignment is to templatize this existing site.  Specifically, you must complete the following tasks:

## 1. Implement a post template and use it on the client side

When the user adds a new post using the "+" button in the current site, the client-side code in `index.js` calls a function `insertNewPost()`, which uses native JS methods to construct a DOM element representing a new post based on data passed as arguments to the function and inserts that new post element into the DOM at the appropriate location.

Your first task in this assignment is to write a Handlebars template to represent a single post and then to use that template in `insertNewPost()` instead of the native JS methods currently used to create a new post and insert it into the DOM.  Here are some specific things you'll have to do to make this happen:

  * Implement your post template in its own `.handlebars` file.  You'll use this template in later steps, too.

  * Add to your `package.json` file a new build script that uses `handlebars` to pre-compile your post template into a JS file.  Note that you'll need to install `handlebars` as a dependency of your package in order to do this pre-compilation.  Make sure your server process in `server.js` serves this generated JS file, and make sure to hook your build script up so it's run every time you use `npm start` to start the server, just in case you change your template.

  * Make sure your client-side HTML code includes your generated JS script for the post template.  Also make sure your client-side HTML code includes the [Handlebars runtime library](https://cdnjs.com/libraries/handlebars.js), so it can actually use your template.

  * Replace the native JS functions currently used in `insertNewPost()` to build and insert a new post element with a call to your post template function, making sure to pass the appropriate arguments into the post template function.  Note that your post template function will generate an HTML string, not a DOM element, so you'll have to use a slightly different approach to insert the new post into the DOM.

## 2. Templatize the posts page to replace `index.html`

The current site uses a hard-coded page in `index.html` to display a page containing 8 posts.  Your next task in the assignment is to implement a templatized version of this posts page, and to use data stored on the server side to dynamically generate the posts page on the server side when a client requests it.  Specifically, you are provided with raw data in `postData.json` representing the current set of 8 posts.  You should use that data in conjunction with a set of templates you write to replace the functionality of `index.html`.  Here are some specific things you'll have to do to make this happen:

  * Implement one or more `.handlebars` template files to replicate the structure of `index.html`.
    * Your new set of templates can use a layout template if you'd like.  This isn't strictly necessary here, but you'll have to do it eventually to earn full credit for the assignment.

  * In these new templates, instead of hard-coding the posts to be displayed, use the post template you created in step 1 as a partial to render each post in an array of posts that's passed as a template argument via the template context.

  * In your server process in `server.js`, set up your Express server to use `express-handlebars` as the view engine.  Note that you'll need to install `express-handlebars` as a dependency of your package.

  * Implement a route in your server process for the root path `/`.  Make sure this route's middleware is called before the middleware function that serves `index.html`.  Within this new route, you should respond to the client by using your newly-created template(s) to render the posts page (which should look the same as `index.html`).  In particular, make sure you load the raw post data from `postData.json` and pass all of this post data into your template(s) using the appropriate template argument(s).  When you render the posts page this way, make sure to respond with status 200.

  * Delete `index.html` (or move it somewhere outside of the `public/` directory).  After you've got your templates in place for this part of the assignment, you won't need `index.html` anymore, and you'll want to make sure your site is actually using your templates and not `index.html` to render the site.  The best way to do that is to get rid of `index.html`.

## 3. Templatize the 404 page

The current site contains a route in the server process in `server.js` that responds with a 404 status and an error page hard-coded in `404.html` whenever a client requests an unknown path.  Your next task for the assignment is to turn this 404 page into a template.

There are two ways to do this.  The "easy" way is just to basically copy `404.html` into a new Handlebars template, e.g. `404.handlebars`.  However, if you do this, you'll notice that there is a lot of duplicated code between your 404 template and your posts page template.  To earn full credit, you must templatize all of the elements that are common to both pages and re-use those templates whenever those elements need to be rendered.  Specifically, here are some of the things you'll need to do to accomplish this:

  * Write a layout template that contains the HTML skeleton that's common to both the 404 page and the posts page.  Make sure all of the needed CSS and client-side JS is included in this layout template.  Also make sure you set your server process up to use this layout template.  Remove this HTML skeleton from the 404 and post page templates, and allow it to be provided via your new layout template.

  * Write a partial representing each of the visual elements that are common to both the 404 page and the posts page, e.g. the page header.  Use these partials to render these elements in each page.  You can go even further than this if you like, writing and using a partial for each discrete "component" in the site, e.g. the sell something button/modal and the filter sidebar, but this is not necessary.

  * Modify the current 404 route specification in the server to use your 404 page template.

  * Again, after you get all of this hooked up, you should delete (or move) `404.html` to make sure your site is correctly using your new templates.

## 4. Implement a page to render a single post

Finally, use the post template you implemented in step 1 to create a new route in your Express server that renders a page displaying a single post.  This route should behave as follows:

  * When a client requests a path of the form `/posts/<n>`, where `<n>` is an integer that is within the bounds of the array of posts stored in `postData.json` (i.e. `<n>` is between 0 and 7), you should respond with a page that contains only the corresponding post.  If `<n>` is not within the bounds of the array of posts, or if it's not an integer, you should respond with a 404 status and the 404 page you implemented in step 3.

  * Your single-post page should contain only the site header and the individual post that was requested.  The following things should **not** be displayed or even present in the DOM:
    * Any posts other than the one that was requested.
    * The filter sidebar.
    * The "sell something" button.
    * The "sell something" modal and its backdrop.

  * For full credit, you should use the same template to render both your root path `/` and the `/posts/<n>` path.  You can still earn partial credit by implementing separate templates for each of these paths.

## Code Blog

Add an entry to your Code Blog reflecting on your experience with this assignment and publish the new entry.  Here are some questions you could answer (though these aren't the only ones):

  * What was challenging about the assignment, and what specific kinds of problems did you have.  How did you solve those problems?

  * What did you learn from the assignment?  Were there any special insights you had?  What did you find that you already knew?

  * What kinds of resources were helpful for completing the assignment?  Specific websites?  Lectures?  The class Piazza forum?  The TAs?  How did you use each of these resources?

  * What are one or two things you had to do an internet search for to complete the assignment?

## Submission

As always, we'll be using GitHub Classroom for this assignment, and you will submit your assignment via GitHub.  Just make sure your completed files are committed and pushed by the assignment's deadline to the master branch of the GitHub repo that was created for you by GitHub Classroom.  A good way to check whether your files are safely submitted is to look at the master branch your assignment repo on the github.com website (i.e. https://github.com/osu-cs290-f21/assignment-5-YourGitHubUsername/). If your changes show up there, you can consider your files submitted.

In addition to submitting your assignment via GitHub, you must submit the URL to your code blog entry (e.g. http://web.engr.oregonstate.edu/~YOUR_ONID_ID/cs290/blog.html) via Canvas by the due date specified above.  Please re-submit your code blog URL even if you published your new post at the same URL you've been using for your code blog.

## Grading criteria

The assignment is worth 100 points total:

  * 25 points: the client-side JS uses a pre-compiled post template to insert new posts, as described above

  * 20 points: the server uses your post template as a partial within a larger template to render the page of all posts on the root path `/`, as described above

  * 10 points: the server uses a template to render the 404 page, as described above

  * 25 points: the server renders a page displaying a single post on the path `/posts/<n>`, as described above

  * 10 points: the site is fully templatized, i.e. no HTML code is duplicated; re-used components of the site are written in partials, and the HTML skeleton common to every page is written in a layout

  * 10 points: the same template is used to render both the page displaying all posts (i.e. `/`) and the page displaying a single post (i.e. `/posts/<n>`)

In addition to your programming assignment grade, you will receive a pass/fail grade for your code blog entry, included in the code blog portion of your grade.
