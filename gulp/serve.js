module.exports = function(gulp, plugins) {
  return function() {
    var bs = plugins.browserSync.create();

    bs.init({
      notify: false,
      port: 9002,
      server: {
        baseDir: ['dist/example'],
        routes: {
          "/bower_components": "bower_components",
          "/node_modules": "node_modules"
        }
      },
      ghostMode: {
        forms: {
          submit: false
        }
      }
    });

    // watch for changes
    gulp.watch([
      'dist/example/*'
    ]).on('change', bs.reload);
  };
};
