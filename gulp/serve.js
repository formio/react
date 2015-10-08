module.exports = function(gulp, plugins) {
  return function() {
    var bs = plugins.browserSync.create();

    bs.init({
      notify: false,
      port: 9002,
      server: {
        baseDir: ['dist/src']
      },
      ghostMode: {
        forms: {
          submit: false
        }
      }
    });

    // watch for changes
    gulp.watch([
      'dist/src/*'
    ]).on('change', bs.reload);
  };
};
