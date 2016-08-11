var _ = require('lodash');

var plugins = {};


var css = {
	cache : {},

	add : (json) => {
		var callLine = new Error().stack.split('\n')[2];
		css.cache = _.assign({}, css.cache, json)
		return json;
	},

	rewind : () => {
		return css.toCSS(css.cache);
	},

	flatten : (json) => {
		var rules = {};
		var add_rule = (scope, media, contents) => {
			var selector = scope.join(' ')
				.replace(' :',':')
				.replace(' &','');

			var queries = '';
			//console.log(scope, media, contents);

			var _media = _.map(media, (vals, name) => {
				return `${name}${vals.join(' and ')}`
			});


			var result = process(scope, media, contents);
			if(!_.isEmpty(result)){
				if(queries){
					rules[queries] = {
						[selector] : result
					}
				}else{
					rules[selector] = result;
				}
			}
		};



		var process = (scope, media, contents) => {
			return _.reduce(contents, (r, val, key) => {


				if(_.isObject(val)){
					var _scope = scope;
					var _media = media;

					if(key[0] !== '@'){
						_scope = _.concat(scope, key);
					} else {
						var name = key.split(' ')[0];
						_media = _.assign({}, media, {
							[name] : _.compact(_.concat(media[name], key.replace(name, '')))
						});
					}


					add_rule(_scope, _media, val);
				}else{
					r[_.kebabCase(key)] = val;
				}
				return r;
			}, {});
		};

		_.each(json, (val, key) => {
			add_rule([key], {}, val);
		});
		return rules;
	},

	toString : (json, pretty) => {
		var newLine = (pretty ? '\n' : '');
		var spacing = (pretty ? '  ' : '');
		return _.map(json, (rules, selector) => {
			var _rules = _.map(rules, (val, prop) =>{
				return `${spacing}${prop}:${val};`
			}).join(newLine);
			return [`${selector}{`, _rules, '}'].join(newLine)
		}).join(newLine);
	},

	toCSS : (json, pretty) => {

		return css.toString(css.flatten(json), pretty);

		/*

		var rules = [];
		var processContents = function(scope, contents){
			return _.reduce(contents, function(result, val, rule){
				if(plugins[rule]){
					return result + processContents(scope, plugins[rule](val));
				}
				if(_.isArray(contents)){
					return result + processContents(scope, val);
				}
				if(typeof val === 'function'){val = val();}
				if(typeof val === 'object' || _.isArray(val)){
					addRule(_.concat(scope, rule), val);
				}
				if(typeof val === 'string'){
					return result + space + _.kebabCase(rule) + ': ' + val + ';\n';
				}
				return result;
			}, '');
		};

		var addRule = function(scope, contents){
			rules.unshift(scope.join(' ')
				.replace(' :',':')
				.replace(' &','')
				+ '{\n' +
				processContents(scope, contents)
				 + '}\n');
		};

		for(var def in json){
			addRule([def], json[def]);
		}
		return rules.join('');
		*/
	},


	toSheet : (obj) => {
		if(!document) return;
		var sheet = (_.isString(obj)? obj : css.toCSS(obj));
		var el = document.createElement("style");
		el.type = "text/css";
		if(el.styleSheet){el.styleSheet.cssText = sheet;}
		else{el.appendChild(document.createTextNode(sheet));}
		document.getElementsByTagName("head")[0].appendChild(el);
		return el;
	}

};


module.exports = css;