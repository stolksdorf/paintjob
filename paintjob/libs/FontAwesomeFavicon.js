//Takes a Font Awesome class and makes it the favicon
FontAwesomeFavicon = function(iconName){
	//Gets the character code for a given Font Awesome Icon
	var FAtoChar = function(className){
		var selector = '.' + className + '::before';
		var style = 'content';
		for(var i in document.styleSheets){
			var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
			for(var j in rules){
				if(rules[j].selectorText == selector){
					return rules[j].style[style];
				}
			}
		}
	};
	//Converts the fontawesome icon into a canvas, then to a data url
	var charToIconUrl = function(icon){
		var canvas=document.createElement('canvas');
		var ctx=canvas.getContext('2d');
		canvas.width  = 50;
		canvas.height = 50;
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.font      = "50px FontAwesome";
		ctx.textAlign = 'center';
		ctx.fillText(icon, 25, 45);
		return canvas.toDataURL('image/png');
	};

	//Sets the favicon link to the data url
	var iconUrlToFavicon = function(src) {
		var favIcon = document.createElement('link'),
			oldFavIcon = document.getElementById('dynamic-favicon');
		document.head = document.head || document.getElementsByTagName('head')[0];
		favIcon.id = 'dynamic-favicon';
		favIcon.rel = 'shortcut icon';
		favIcon.href = src;
		if (oldFavIcon) document.head.removeChild(oldFavIcon);
		document.head.appendChild(favIcon);
	};


	var timeout = setInterval(function(){
		var iconChar = FAtoChar(iconName);
		if(!iconChar) return;
		var url = charToIconUrl(iconChar);
		iconUrlToFavicon(url);
		clearInterval(timeout);
	}, 10);

};
