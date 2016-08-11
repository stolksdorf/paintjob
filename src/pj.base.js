var ReactDom = require('react-dom');
var React = require('react');
var Paintjob = require('./paintjob/paintjob.jsx');
var request = require('superagent');

var repo = {
	readme      : null,
	name        : null,
	github_url  : null,
	description : null,
	pj          : null,
};
var openRequests = 0;
var ghRequest = (user, repo, route, cb) => {
	openRequests++;
	return request.get(`https://api.github.com/repos/${user}/${repo}${route}`)
		.end((err, res) => {
			if(err){
				openRequests--;
				return render();
			}
			var data = res.body;
			if(res.body.content) data = atob(res.body.content);
			cb(data);
			openRequests--;
			return render();
		})
}

var render = function(){
	if(openRequests !==0) return;
	ReactDom.render(React.createElement(Paintjob, repo), document.getElementById("app"));
}

module.exports = function(){
	ghRequest(github.user, github.repo, '', (repoData) => {
		repo.name        = repoData.name;
		repo.github_url  = repoData.owner.html_url;
		repo.description = repoData.description;
	});
	ghRequest(github.user, github.repo, '/readme', (readme) => {
		repo.readme = readme;
	});
	ghRequest(github.user, github.repo, '/contents/.paintjob', (pjConfig) => {
		try{
			repo.pj = JSON.parse(pjConfig);
		}catch(e){
			console.erro('Error processing .paintjob file from repo', pjConfig);
		}
	});
}
