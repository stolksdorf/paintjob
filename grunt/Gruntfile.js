module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		buildCssFile : 'temp/<%= pkg.name %>.css',
		buildJsFile  : 'temp/<%= pkg.name %>.js',

		concat: {
			css:{
				options: {
					separator: '\n'
				},
				src: [
					'../paintjob/libs/*.css',
					'../paintjob/style/reset.css',
					'../paintjob/style/base.css',
					'../paintjob/style/paintjob.css'
				],
				dest: '<%= buildCssFile %>'
			},
			js : {
				options: {
					separator: ';'
				},
				src: [
					'../paintjob/libs/*.js',
					'../paintjob/block/*.js',
				],
				dest: '<%= buildJsFile %>'
			}
		},

		uglify: {
			dist: {
				src: '<%= buildJsFile %>',
				dest: '<%= buildJsFile %>'
			}
		},

		cssmin: {
			combine: {
				files: {
					'<%= buildCssFile %>': ['<%= buildCssFile %>']
				}
			}
		},

		htmlTemplate : {
			src: '../paintjob/paintjob.tmpl',
			dest: '../paintjob.compiled.html'
		},

		clean: ["temp"]
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask( "htmlTemplate", function() {
		var conf = grunt.config('htmlTemplate');
		grunt.log.writeln(conf.src);
		var tmpl = grunt.file.read(conf.src);
		grunt.file.write(conf.dest, grunt.template.process(tmpl));
	});


	grunt.registerTask('default', ['concat', 'cssmin', 'uglify', 'htmlTemplate', 'clean']);

};