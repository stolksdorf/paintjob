var _ = _ ||{
	extend : function(){
		var result = {};
		for(var i in arguments){
			var obj = arguments[i];
			for(var propName in obj){
				if(obj.hasOwnProperty(propName)){ result[propName] = obj[propName]; }
			}
		}
		return result;
	},
	map : function(obj, fn){
		var result = [];
		for(var propName in obj){
			if(obj.hasOwnProperty(propName)){ result.push(fn(obj[propName], propName)); }
		}
		return result;
	}
};


Paintjob = Object.create(Block).blueprint({
	block : 'project',

	start : function()
	{
		var self = this;
		this.projectData = {};

		this.TestMode = document.URL.indexOf('file') === 0;

		//get user and repo from URL
		if(!this.TestMode){
			var temp = document.URL.split('/');
			this.projectData.user = temp[2].split('.')[0];
			this.projectData.repo = temp[temp.length-2];
		}

		this.urls = {
			prod : {
				repo   : 'https://api.github.com/repos/' + this.projectData.user + '/' + this.projectData.repo,
				readme : 'https://api.github.com/repos/' + this.projectData.user + '/' + this.projectData.repo + '/readme',
				config : 'https://api.github.com/repos/' + this.projectData.user + '/' + this.projectData.repo + '/contents/paintjob-config.json',
				scripts: 'https://api.github.com/repos/' + this.projectData.user + '/' + this.projectData.repo + '/contents/'
			},
			testing : {
				repo   : undefined,
				readme : 'readme.md', //Change to README
				config : 'paintjob-config.json',
				scripts: ''
			},
		};

		$(document).ready(function(){
			self.dom = {
				block : jQuery('[data-block="' + self.block + '"]')
			};
			self.getElements();
			self.fetchRemoteData();
		});
		return this;
	},

	fetchRemoteData : function()
	{
		var self = this;

		var urls = this.urls.prod;
		if(this.TestMode) urls = this.urls.testing;


		this.remoteCall(urls.config, function(config){
			if(config.content) config = Base64.decode(config.content);
			eval("var result = " + config);
			self.projectData = _.extend(self.projectData, result);

			if(self.projectData.scripts){
				self.fetchScripts(urls, self.projectData.scripts);
			}
		});

		this.remoteCall(urls.repo, function(repoData){
			self.projectData.name        = repoData.name;
			self.projectData.github_url  = repoData.owner.html_url;
			self.projectData.description = repoData.description;
		});

		this.remoteCall(urls.readme, function(readme){
			self.projectData.readme = readme;
		});

		return this;
	},

	fetchScripts : function(urls, scripts){
		var self = this;
		for(var i in scripts){
			self.remoteCall(urls.scripts + scripts[i], function(script){
				if(script.content) script = Base64.decode(script.content);
				//try to create script
				var s = document.createElement('script');
				s.type = 'text/javascript';
				s.appendChild(document.createTextNode(script));
				s.text = script;
				document.body.appendChild(s);
			});
		}
		return this;
	},

	remoteCall : function(url, callback){
		if(!url) return this;
		var self = this;
		this.asyncTracking(1);
		$.ajax({
			url : url,
			type : 'GET',
			headers: { 'Accept': 'application/vnd.github.raw' },
			error  : function(result){
				self.asyncTracking(0, result);
			},
			success : function(data){
				callback(data);
				self.asyncTracking(-1);
			}
		});
		return this;
	},

	asyncTracking : function(val, error){
		this.asyncError = this.asyncError || false;
		this.numCurrentCalls = this.numCurrentCalls || 0;

		if(error) {
			this.asyncError = error;
			console.error(error);
			$('.spinner').hide();
			$('.error').show();
		}
		if(this.asyncError)	return this;
		this.numCurrentCalls += val;
		if(this.numCurrentCalls === 0){
			this.render();
		}
		return this;
	},

	render : function(){
		var self = this;
		$('.spinner').hide();

		if(this.projectData.local){
			_.map(['user','repo','name','description'], function(prop){
				self.projectData[prop] = self.projectData[prop] || self.projectData.local[prop];
			});
		}

		this.dom.name.html(this.projectData.name);
		this.dom.description.html(this.projectData.description);

		this.sideBar = Object.create(PaintJob_Block_Sidebar).initialize(this.projectData);
		$('.sideBar').show();

		document.title = this.projectData.name;
		$(window).bind("load", function() {
			FontAwesomeFavicon(self.projectData.icon_class);
		});
		this.buildDocumentation(this.projectData.readme);
		this.buildCodeBlocks();
		this.buildNav();
		this.buildIcons();
		this.buildExample();
		return this;
	},

	buildDocumentation : function(markdown)
	{
		var newHTML = new Markdown.Converter().makeHtml(markdown);
		newHTML = newHTML.replace(/<h1>/g, '</div><div class="docblock"><h1>');

		//Cut out anything above the first header.
		//This allows for a link to the paintjob page on the repo README
		newHTML = newHTML.substring(newHTML.indexOf('<div class="docblock"><h1>'));
		this.dom.documentation.html(newHTML + '</div>');
		return this;
	},

	buildCodeBlocks : function()
	{
		var self = this;

		var lastHtmlCodeblock;
		this.dom.documentation.find('pre code').each(function(index, codeBlock){
			var tempCodeBlock = Object.create(Paintjob_Block_CodeBlock).initialize($(codeBlock), index, self.projectData);

			//If the code block is html, set it up for the next JS code block to use it
			if(tempCodeBlock.isHtml){
				lastHtmlCodeblock = tempCodeBlock;
			} else if(lastHtmlCodeblock){
				tempCodeBlock.setExampleCode(lastHtmlCodeblock);
			}
		});
		return this;
	},

	buildNav : function()
	{
		var self = this;
		var colors = ['teal','orange', 'green','blue','red','purple','steel','yellow'];
		this.dom.documentation.find('.docblock').each(function(index, docBlock){
			var docBlock = $(docBlock);
			var color = colors[index%colors.length];
			docBlock.addClass(color);

			self.sideBar.addNavItem(docBlock.find('h1').html(), docBlock, color);
		});

		return this;
	},

	buildExample : function()
	{
		if(this.projectData.example_image){
			this.dom.example.attr('src', this.projectData.example_image);
		}
		return this;
	},

	buildIcons : function()
	{
		var self = this;
		_.map(this.projectData.icons, function(iconData){
			Object.create(PaintJob_Block_Icon)
				.initialize(iconData)
				.injectInto(self.dom.iconContainer);
		})
		return this;
	},


});
