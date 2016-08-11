var React = require('react');
var _ = require('lodash');
var cx = require('classnames');

require('./header.jss');

var Header = React.createClass({
	getDefaultProps: function() {
		return {
			readme      : '',
			name        : '',
			github_url  : '',
			description : '',
			pj          : {},
		};
	},

	renderIcons : function(){
		return null;
	},

	render : function(){
		return <div className='header'>
			<div className='content'>
				<h1>{this.props.name}</h1>
				<p>{this.props.description}</p>
				{this.renderIcons()}
			</div>
		</div>
	}
});

module.exports = Header;
