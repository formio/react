/*global -plugins */
'use strict';
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
plugins.source = require('vinyl-source-stream');
plugins.browserify = require('browserify');
plugins.watchify = require('watchify');
plugins.reactify = require('reactify');
plugins.browserSync = require('browser-sync');

gulp.task('clean', require('del').bind(null, ['dist/build']));
gulp.task('copy', require('./gulp/copy')(gulp, plugins));
gulp.task('watch', require('./gulp/watch')(gulp, plugins));
gulp.task('scripts', require('./gulp/scripts')(gulp, plugins));
gulp.task('serve', require('./gulp/serve')(gulp, plugins));
gulp.task('build', ['clean', 'scripts']);

gulp.task('default', ['watch', 'serve']);