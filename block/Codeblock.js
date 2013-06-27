Paintjob_Block_Example = Object.create(Block).blueprint({
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

		var code = preCodeElement.html();
		preCodeElement.parent().replaceWith(this.dom.block);
		this.getElements();


		this.editor = CodeMirror(function(elt) {
			self.dom.editor[0].parentNode.replaceChild(elt, self.dom.editor[0]);
		}, {
			value          : code,
			mode           : 'javascript',
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

		this.dom.output.attr('id', this.id);

		if(!this.projectData.runnable_code_blocks){
			this.dom.runButton.hide();
			this.dom.outputContainer.hide();
			return this;
		}

		this.dom.runButton.click(function(){
			self.executeCodeBlock();
		});
		return this;
	},

	executeCodeBlock : function()
	{
		var self = this;

		codeBlockHtml =jQuery('[data-schematic="code_html"]').html();

		if(codeBlockHtml && codeBlockHtml !== ""){
			this.dom.output.html(codeBlockHtml)
			this.dom.outputContainer.show();
		} else{
			this.dom.outputContainer.hide();
		}

		try{
			eval('(function(){var example = $("#' + this.id + '");'+self.editor.getValue()+'})();');
		}catch(e){
			self.dom.outputContainer.show();
			self.dom.output.html('<div class="codeblock__output__errorText">' + e.toString() + '</div>');
		}

		return this;
	},
});
