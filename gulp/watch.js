module.exports = function(gulp, plugins) {
  return function() {
    gulp.watch('./src/**/*.html', ['copy']);

    var watcher = plugins.watchify(plugins.browserify({
      entries: ['./src/Formio.js'],
      transform: [plugins.babelify, plugins.reactify],
      debug: true,
      standalone: 'Formio',
      cache: {}, packageCache: {}, fullPaths: true
    }));

    return watcher.on('update', function () {
      watcher.bundle()
        .pipe(plugins.source('Formio.js'))
        .pipe(gulp.dest('dist/src'));
      console.log('Updated');
    })
      .bundle()
      .pipe(plugins.source('Formio.js'))
      .pipe(gulp.dest('dist/src'));
  };
};
