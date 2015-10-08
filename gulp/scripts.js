module.exports = function(gulp, plugins) {
  return function () {
    plugins.browserify({
      entries: ['./src/react-formio.js'],
      transform: [plugins.reactify]
    })
      .bundle()
      .pipe(plugins.source('react-formio.js'))
      .pipe(gulp.dest('dist/build'))
      .pipe(plugins.rename('react-formio.min.js'))
      .pipe(plugins.streamify(plugins.uglify('react-formio.min.js')))
      .pipe(gulp.dest('dist/build'));

  }
}