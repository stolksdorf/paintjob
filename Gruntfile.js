module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		allCss : 'template/<%= pkg.name %>.css',
		allJs :	'template/<%= pkg.name %>.js',


		concat: {
			css:{
				options: {
					separator: '\n'
				},
				src: [
					'paintjob/libs/*.css',
					'paintjob/style/reset.css',
					'paintjob/style/base.css',
					'paintjob/style/paintjob.css'
				],
				dest: '<%= allCss %>'
			},
			js : {
				options: {
					separator: ';'
				},
				src: [
					'paintjob/libs/*.js',
					'paintjob/block/*.js',
					'paintjob/paintjob.js'
				],
				dest: '<%= allJs %>'
			}
		},

		uglify: {
			dist: {
				src: '<%= allJs %>',
				dest: '<%= allJs %>'
			}
		},

		cssmin: {
			combine: {
				files: {
				'<%= allCss %>': ['<%= allCss %>']
				}
			}
		},

		index: {
			src: 'template/pj.tmpl',	// source template file
			dest: 'template/index.html'	// destination file (usually index.html)
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask( "index", "Generate index.html depending on configuration", function() {
			var conf = grunt.config('index'),
				tmpl = grunt.file.read(conf.src);
			grunt.file.write(conf.dest, grunt.template.process(tmpl));
		});


	grunt.registerTask('default', ['concat', 'cssmin', 'uglify', 'index']);

};