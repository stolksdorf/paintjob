var css = require('../css.js');





module.exports = css.add({
	body : {
		'font-family' : "'Lato',sans-serif",
		'line-height': '1',
		'color': '#000',
		'background': '#fff',
		'#app' : {
			'max-width': '960px',
			'margin-right': 'auto',
			'margin-left': 'auto',
			'padding-bottom': '100px',
		},
	},
	'.test' : {
		padding : '4px'
	}
})