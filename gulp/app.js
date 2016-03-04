module.exports = function(gulp, plugins) {
  return function () {

    function handleErrors() {
      var args = Array.prototype.slice.call(arguments);
      plugins.notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
      }).apply(this, args);
      this.emit('end'); // Keep gulp from hanging on this task
    }

    return plugins.browserify({
        entries: ['./src/app.js'],
        transform: [plugins.babelify, plugins.reactify]
      })
      .bundle()
      .on('error', handleErrors)
      .pipe(plugins.source('app.js'))
      .pipe(gulp.dest('dist/example'));
  }
}