var PROJECT = {
	user :'stolksdorf',
	repo :'parallaxjs',

	logo_class : 'icon-exchange',
	logo_color : 'blue',

	icons : [
		{
			icon_class : 'icon-code-fork',
			color      : 'green',
			link       : function(){return 'https://github.com/' + PROJECT.user + '/' + PROJECT.repo + '/fork';},
			tooltip    : 'Fork on Github'
		},
		/*{
			icon_class : 'icon-star',
			color      : 'yellow',
			link       : 'https://github.com/stolksdorf/Parallaxjs/star',
			tooltip    : 'Star on Github'
		}, */
		{
			icon_class : 'icon-code',
			color      : 'steel',
			link       : 'https://raw.github.com/stolksdorf/Parallaxjs/master/parallax.js',
			tooltip    : 'View raw'
		},
		{
			icon_class : 'icon-home',
			color      : 'red',
			link       : 'https://github.com/stolksdorf',
			link       : function(){return 'https://github.com/' + PROJECT.user;},
			tooltip    : 'Check out more cool things'
		}

	],

	use_local : true,


	/* Side Example */

	example_html  : '<div class="test2">Test 2</div><div class="test1">Test 1</div>',
	example_start_function : function(){

		$('.test2').hide();

		var flip = true;

		setInterval(function(){
			if(flip){
				$('.test2').hide();
				$('.test1').show();
			} else {
				$('.test1').hide();
				$('.test2').show();
			}

			flip = !flip;
		}, 2000)
	},


	/* Code Blocks */

	runnable_code_blocks : true,
	code_block_html : '<div class="test" style="color:blue">sadasd</div>'


};


