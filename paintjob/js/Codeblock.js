CodeBlockComponent = xo.view.extend({
	schematic : DOM.div( {class:"codeblock"} ,
		DOM.div( {'xo-element':"editor"}),
		DOM.div( {class:"codeblock__output", 'xo-element':"outputContainer", style:"display:none"},
			DOM.div( {'xo-element':"output"}),
			DOM.div( {'xo-element':"outputError", class:"codeblock__output__errorText", style:"display:none"})
		),
		DOM.div( {class:"codeblock__runButton btn green", 'xo-element':"runButton"}, "Run"),
		DOM.div( {style:"clear:both"})
	),


	render : function(preCodeElement, id, projectData){
		var self = this;
		this.id = 'codeblock' + id;
		this.projectData = projectData;

		this.dom = {
			view : $(this.schematic.cloneNode(true))
		};
		var elements = this.dom.view.find('[xo-element]');
		for(var i =0; i < elements.length; i++){
			this.dom[elements[i].getAttribute('xo-element')] = xo.elementWrapper(elements[i]);
		}

		this.code = preCodeElement.text();
		//Check for html
		if(this.code[0] === '<'){
			this.isHtml = true;
		}
		preCodeElement.parent().replaceWith(this.dom.view);


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

		this.editor.setValue(this.code);

		setTimeout(function(){
			this.editor.refresh();
		}.bind(this), 10);

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

	setExampleCode : function(test)
	{
		this.htmlExample = test;
		return this;
	},

	executeCodeBlock : function()
	{
		var self = this;
		this.dom.outputContainer.hide();
		if(this.htmlExample){
			this.createExampleHtml(jQuery('<div>').append(this.htmlExample.editor.getValue()));
		}else{
			this.createExampleHtml(jQuery('<div>'));
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

	createExampleHtml : function(htmlCodeElement)
	{
		if(!this.projectData.show_html_example) return this;
		this.dom.output.replaceWith(htmlCodeElement);
		this.dom.output = htmlCodeElement;
		this.dom.output.show().attr('id', this.id);
		this.dom.outputError.hide()
		this.dom.outputContainer.show();
		return this;
	}


});
