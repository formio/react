module.exports = function(gulp, plugins) {
  return function() {
    gulp.watch('./src/**/*.html', ['copy']);

    var watcher = plugins.watchify(plugins.browserify({
      entries: ['./src/app.js'],
      transform: [plugins.babelify, plugins.reactify],
      debug: true,
      standalone: 'App',
      cache: {}, packageCache: {}, fullPaths: true
    }));

    return watcher.on('update', function () {
      watcher.bundle()
        .pipe(plugins.source('app.js'))
        .pipe(gulp.dest('dist/src'));
      console.log('Updated');
    })
      .bundle()
      .pipe(plugins.source('app.js'))
      .pipe(gulp.dest('dist/src'));
  };
};
