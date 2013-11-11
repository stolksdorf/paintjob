Paintjob = Object.create(Block).blueprint({
	block : 'project',

	start : function(TestData)
	{
		var self = this;
		this.TestMode = !!TestData;
		this.projectData = TestData || {};

		//get user and repo from URL
		if(!this.TestMode){
			this.projectData.user = document.URL.split('.')[0];
			this.projectData.repo = document.URL.split('/')[1];
		}

		this.urls = {
			prod : {
				repo   : 'https://api.github.com/repos/' + this.projectData.user + '/' + this.projectData.repo,
				readme : 'https://api.github.com/repos/' + this.projectData.user + '/' + this.projectData.repo + '/readme',
				config : 'https://api.github.com/repos/' + this.projectData.user + '/' + this.projectData.repo + 'contents/paintjob.json?ref=master'
			},
			testing : {
				repo   : undefined,
				readme : 'readme.md',
				config : 'paintjob.json'
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
		if(this.TestMode){
			urls = this.urls.testing;
		}

		//called whenever one of the ajax calls finishes
		var finished = function(){


		}



		$.ajax({
			url : urls.config,
			type : 'GET',
			error  : function(result){
				console.error(result.responseText);
				alert('There was an error gathering the repo data\n\n' + result.responseText);
			},
			success : function(data){
				//we might decode

				eval("var result = " + data);
				_.extend(self.projectData, result);
			}
		});



		if(urls.repo){
			$.ajax({
				url : urls.repo,
				type : 'GET',
				error  : function(result){
					console.error(result.responseText);
					alert('There was an error gathering the repo data\n\n' + result.responseText);
				},
				success : function(result){
					self.projectData.name        = result.name;
					self.projectData.github_url  = result.owner.html_url;
					self.projectData.description = result.description;
					if(typeof self.projectData.readme !== 'undefined'){self.render();}
				}
			});
		}


		$.ajax({
			url : urls.readme,
			type : 'GET',
			headers: { 'Accept': 'application/vnd.github.raw' },
			error  : function(result){
				console.error(result.responseText);
				alert('There was an error gathering the repo readme\n\n' + result.responseText);
			},
			success : function(result){
				self.projectData.readme = result;
				//if(typeof self.projectData.name !== 'undefined'){self.render();}
				self.render();
			}
		});
		return this;
	},

	remoteCall : function(url, callback){

		return this;
	},

	render : function(){
		var self = this;
		this.dom.name.html(this.projectData.name);
		this.dom.description.html(this.projectData.description);

		this.sideBar = Object.create(PaintJob_Block_Sidebar).initialize(this.projectData);

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
			if(tempCodeBlock.isHtml){
				lastHtmlCodeblock = tempCodeBlock;
			} else if(lastHtmlCodeblock){
				tempCodeBlock.setHtmlExample(lastHtmlCodeblock);
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
		_.each(this.projectData.icons, function(iconData){
			Object.create(PaintJob_Block_Icon)
				.initialize(iconData)
				.injectInto(self.dom.iconContainer);
		})
		return this;
	},


});
