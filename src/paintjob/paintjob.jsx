var React = require('react');
var _ = require('lodash');
var cx = require('classnames');
var css = require('../css.js');

require('./paintjob.jss');


var Header = require('./header/header.jsx');


var Paintjob = React.createClass({
	getDefaultProps: function() {
		return {
			readme      : '',
			name        : '',
			github_url  : '',
			description : '',
			pj          : {},
		};
	},

	componentDidMount: function() {
		if(this.props.pj.icon) this.renderFavicon();
		css.toSheet(css.rewind());
	},

	renderFavicon : function(){
		var link = document.createElement('link');
		link.type = 'image/x-icon';
		link.rel = 'shortcut icon';
		link.href=`http://paulferrett.com/fontawesome-favicon/generate.php?icon=${this.props.pj.icon.replace('fa-', '')}&fg=000`
		document.getElementsByTagName('head')[0].appendChild(link);
	},



	render : function(){
		return <div className='paintjob'>
			<Header {...this.props} />
			{this.props.readme}
		</div>
	}
});

module.exports = Paintjob;
