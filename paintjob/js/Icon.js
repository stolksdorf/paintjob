IconComponent = xo.view.extend({
	schematic : DOM.a( {target:"_blank", class:"project__icon card btn hint--bottom"},
		DOM.i( {'xo-element':"iconElement"})
	),

	render : function()
	{
		if(this.model.link){
			if(typeof this.model.link === 'function'){
				this.dom.view.attr('href', this.model.link());
			} else {
				this.dom.view.attr('href', this.model.link);
			}
		}

		if(this.model.tooltip){
			this.dom.view.attr('data-hint', this.model.tooltip);
		}

		if(this.model.color){
			this.dom.view.addClass(this.model.color);
		}
		if(this.model.icon_class){
			this.dom.iconElement.addClass(this.model.icon_class);
		}
		return this;
	},


})