Paintjob_Block_CodeBlock = Object.create(Block).blueprint({
	schematic : 'code_block',

	initialize : function(preCodeElement, id, projectData)
	{
		var self = this;
		this.id = 'codeblock' + id;
		this.projectData = projectData
		this.super('initialize');

		this.dom = {
			block : this.getSchematic()
		};

		this.code = preCodeElement.text();
		//Check for html
		if(this.code[0] === '<'){
			this.isHtml = true;
		}
		preCodeElement.parent().replaceWith(this.dom.block);
		this.getElements();


		this.editor = CodeMirror(function(elt) {
			self.dom.editor[0].parentNode.replaceChild(elt, self.dom.editor[0]);
		}, {
			value          : self.code,
			mode           : (self.isHtml ? 'htmlmixed' : 'javascript'),
			viewportMargin : Infinity,
			lineNumbers    : true,
			matchBrackets  : true,
			tabMode        : 'indent'
		});

		this.render();
		return this;
	},
	render : function()
	{
		var self = this;
		if(!this.projectData.runnable_code_blocks || this.isHtml){
			this.dom.runButton.hide();
			this.dom.outputContainer.hide();
			return this;
		}

		this.dom.runButton.click(function(){
			self.executeCodeBlock();
		});
		return this;
	},

	setHtmlExample : function(test)
	{
		this.htmlExample = test;
		return this;
	},

	executeCodeBlock : function()
	{
		var self = this;
		var codeBlockHtml        = jQuery('[data-schematic="code_html"]');
		var codeBlockHtmlElement = jQuery(jQuery('<div>').append(codeBlockHtml.clone().removeAttr('data-schematic')).html());

		this.dom.outputContainer.hide();

		if(this.htmlExample){
			//console.log(this.htmlExample.editor.getValue());
			this.setExampleHtml(jQuery('<div>').append(this.htmlExample.editor.getValue()));
		} else if(codeBlockHtmlElement && codeBlockHtmlElement !== ""){
			this.setExampleHtml(codeBlockHtmlElement);
		}

		try{
			eval('(function(){var example = $("#' + self.id + '");'+self.editor.getValue()+'})();');
		}catch(e){
			self.dom.outputContainer.show();
			self.dom.output.hide();
			self.dom.outputError.html(e.toString()).show();
		}

		return this;
	},

	setExampleHtml : function(htmlCodeElement)
	{
		this.dom.output.replaceWith(htmlCodeElement);
		this.dom.output = htmlCodeElement;
		this.dom.output.show().attr('id', this.id);
		this.dom.outputError.hide()
		this.dom.outputContainer.show();
		return this;
	},


});
