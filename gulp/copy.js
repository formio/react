module.exports = function(gulp, plugins) {
  return function () {
    gulp.src('./src/**/*.html')
      .pipe(gulp.dest('dist/src'));
  }
}