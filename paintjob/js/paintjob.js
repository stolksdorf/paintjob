var _ = _ || {

	map : function(obj, fn){
		var result = [];
		for(var propName in obj){
			if(obj.hasOwnProperty(propName)){ result.push(fn(obj[propName], propName)); }
		}
		return result;
	},
}


Paintjob = xo.view.extend({
	view : 'paintjob',

	render : function(){
		var self = this;
		this.projectData = this.model;
		this.dom.spinner.hide();


		if(this.projectData.local){
			_.map(['user','repo','name','description'], function(prop){
				self.projectData[prop] = self.projectData[prop] || self.projectData.local[prop];
			});
		}

		this.dom.name.html(this.projectData.name);
		this.dom.description.html(this.projectData.description);

		this.sidebar = SidebarView.create(this.projectData);

		if(this.projectData.scripts){
			this.fetchScripts(this.projectData.scripts);
		}

		FontAwesomeFavicon(this.projectData.icon_class);
		document.title = this.projectData.name;

		this.fetchScripts();
		this.buildDocumentation(this.projectData.readme);
		this.buildCodeBlocks();
		this.buildNav();
		this.buildIcons();
		this.buildExample();
		return this;
	},

	fetchScripts : function(){
		var self = this;
		for(var i in this.projectData.scripts){
			$.ajax({
				url : 'https://api.github.com/repos/' + self.projectData.user + '/' + self.projectData.repo + '/contents/' + this.projectData.scripts[i],
				type : 'GET',
				headers: { 'Accept': 'application/vnd.github.raw' },
				success : function(script){
					if(script.content) script = Base64.decode(script.content);
					//try to create script
					var s = document.createElement('script');
					s.type = 'text/javascript';
					s.appendChild(document.createTextNode(script));
					s.text = script;
					document.body.appendChild(s);
				}
			});
		}
		return this;
	},

	buildDocumentation : function(markdown){
		var newHTML = new Markdown.Converter().makeHtml(markdown);
		newHTML = newHTML.replace(/<h1>/g, '</div><div class="docblock"><h1>');

		//Cut out anything above the first header.
		//This allows for a link to the paintjob page on the repo README
		newHTML = newHTML.substring(newHTML.indexOf('<div class="docblock"><h1>'));
		this.dom.documentation.html(newHTML + '</div>');
		return this;
	},

	buildCodeBlocks : function(){
		var self = this;

		var lastHtmlCodeblock;
		this.dom.documentation.find('pre code').each(function(index, codeBlock){
			var tempCodeBlock = CodeBlockComponent.create().render($(codeBlock), index, self.projectData);
			//If the code block is html, set it up for the next JS code block to use it
			if(tempCodeBlock.isHtml){
				lastHtmlCodeblock = tempCodeBlock;
			} else if(lastHtmlCodeblock){
				tempCodeBlock.setExampleCode(lastHtmlCodeblock);
			}
		});
		return this;
	},

	buildNav : function(){
		var self = this;
		var colors = ['teal','orange', 'green','blue','red','purple','steel','yellow'];
		this.dom.documentation.find('.docblock').each(function(index, docBlock){
			var docBlock = $(docBlock);
			var color = colors[index%colors.length];
			docBlock.addClass(color);

			self.sidebar.addNavItem(docBlock.find('h1').html(), docBlock, color);
		});

		return this;
	},

	buildExample : function(){
		if(this.projectData.example_image){
			this.dom.example.attr('src', this.projectData.example_image);
		}
		return this;
	},

	buildIcons : function(){
		var self = this;
		_.map(this.projectData.icons, function(iconData){
			IconComponent
				.create(iconData)
				.appendTo(self.dom.iconContainer);
		})
		return this;
	},


});
