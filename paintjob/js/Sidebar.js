SidebarView = xo.view.extend({
	view : 'sideBar',

	render : function()
	{
		var self = this;

		this.dom.view.sticky(150);
		this.dom.logo.click(function(){
			$('body').scrollTo();
		});

		this.dom.logo.mouseover(function(){
			if(self.dom.view.hasClass('stuck')){
				self.dom.logoIcon.hide();
				self.dom.logoUp.show();
			}
		}).mouseout(function(){
			self.dom.logoIcon.show();
			self.dom.logoUp.hide();
		});

		this.dom.logo.addClass(this.model.icon_color);
		this.dom.logoIcon.addClass(this.model.icon_class);

		return this;
	},

	addNavItem : function(name, docblock, color)
	{
		var navElement = $('<div></div>').appendTo(this.dom.nav);
		navElement.addClass('sideBar__nav__item').addClass(color).html(name).click(function(){
			docblock.scrollTo();
		});

		$(window).scroll(function() {
			if(docblock.hasScrolledPast()){ navElement.addClass('scrolled'); }
			else { navElement.removeClass('scrolled'); }
		});
		return this;
	},


});