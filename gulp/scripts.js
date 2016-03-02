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

    gulp.src('./src/Formio.js')
      .pipe(plugins.react())
      .pipe(gulp.dest('dist/lib'));

    plugins.browserify({
      entries: ['./src/Formio.js'],
      transform: [plugins.babelify, plugins.reactify]
    })
      .external('react')
      .bundle()
      .on('error', handleErrors)
      .pipe(plugins.source('Formio.js'))
      .pipe(gulp.dest('dist/build'))
      .pipe(plugins.rename('Formio.min.js'))
      .pipe(plugins.streamify(plugins.uglify('Formio.min.js')))
      .pipe(gulp.dest('dist/build'));

    plugins.browserify({
      entries: ['./src/app.js'],
      transform: [plugins.babelify, plugins.reactify]
    })
      .bundle()
      .on('error', handleErrors)
      .pipe(plugins.source('app.js'))
      .pipe(gulp.dest('dist/src'));
  }
}