# Intro
Parallax is simple library for doing transitions between elements on your page.

How it works
Parallax is broken into two parts: ViewPorts and Pages. Calling `var myViewport = $('.someElement').parallax()` will create a viewport of that object and each of it's child elements become pages. You can then transition to different pages by calling commands like this, `myViewport.pages.page1.shoveRight()`

# Examples

	$(example).find('.test').html('awesome');
		console.log($(example).find('.test'));
	console.log($(example).html());



# Documentation

## Options

## ViewPort Object
The Viewport is the object that contains all of your pages. Imagine it like it's a window, and your pages move around behind it. Anything outside the window is invisible.


### Attributes
* `element` - jQuery object that is your viewport
* `pages` - a key-value pair list of your pages by id:Page Object
* `options`

### Functions
* `add({{jQuery Object}})` - Adds a new page to the viewport. Will use the elements id as the page id.
* `addChildren()`
* `getPageCount()` - Returns the current number of pages
* `last()`
* `current()`
* `next()`

# Page Object

* `id`
* `element`
* `order`



# Events
Parallax's Viewports and Pages use events over callbacks. This makes your code much cleaner and easier to follow as well as allows multiple methods to be triggered by one event.

* `transition`
* `before_transition`
* `current`





# Advanced Usage
## Writing your own transition functions
Parallax is written so the transition functions are exposed on a global object, `Parallax.transitions`. This allows you to add new transitions if the default ones aren't exactly what you're looking for. Let's take a look at the `shoveRight` transition, and try to write our own called `stageRight`, which will pull the current page off to the right and the new page will enter from the same side.

	Parallax.transition.shoveRight = function(newPage, currentPage, viewPort, options, finished){
		//Parallaxes the background to the right based on the scaling factor
		Parallax.parallaxMethods.right(viewPort, options);

		//Takes the current page and moves if off to the left side of the viewport, then hides the page.
		currentPage.animate({
			left : -viewPort.width()
		}, options.animation_time, //make sure to use the options object
		function(){
			currentPage.hide(); //on complete we hide the page
		});

		//Instantly moves the page to the right side of the viewport, but hidden from view
		//Then animates it into position. When it's done, call the "finished" function to let Parallax know the
		// transition is complete
		newPage.show().css({
			left : viewPort.width(),
			top : 0
		}).animate({
			left : 0
		}, options.animation_time, finished);
	},

Each transition function is passed 5 arguments
* `newPage` - The jQuery object of the new page
* `currentPage` - The jQuery object of the current page
* `viewPort` - The jQuery object of the view port
* `options` - A javascript object of the options set to this view port (reference above)
* `finished` - A function to call when all the animations are completed. Used so Parallax can call events and update accordingly

Using these arguments we can create some really interesting transitions. Let's build `stageRight`.

	//Moves the current page to the right, then brings in the next page from the right
	Parallax.transitions.stageRight = function(newPage, currentPage, viewPort, options, finished){
		//First we animate to the current page off to the right
		currentPage.animate({
			left : viewPort.width()
		}, options.animation_time, function(){
			currentPage.hide();
			//Once that is complete, we start to parallax the background
			Parallax.parallaxMethods.right(viewPort, options);
			//Like in shoveRight, we show the new page and move it off to the side
			newPage.show().css({
				left : viewPort.width(),
				top : 0
			//then animate it in
			}).animate({
				left : 0
			//Once it's done we call the 'finished' function
			}, options.animation_time, finished);
		});
	};

To add new transition functions just modify the `Parallax.transitions` object. Every newly created page will that that transition available to it.

