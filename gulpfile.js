var gulp = require('gulp');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');


gulp.task('compile', function() {
	return browserify({
		standalone : 'run'
	})
		.require('./src/pj.base.js')
		//.transform({global: true}, babelify)
		.transform("babelify", {presets: ["es2015", "react"]})
		.bundle()
		.pipe(source('pj.compile.js'))
		//.pipe(buffer())
		//.pipe(uglify())
		.pipe(gulp.dest('./test/'));
});


gulp.task('watch', function() {
	gulp.watch('./src/**/*.*', ['compile']);
});

gulp.task('test', ['compile', 'watch'])