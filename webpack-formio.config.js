var uglify = require('gulp-uglify');

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

        return gulp.src('./src/Formio.js')
            .pipe(plugins.webpack({
                output: {
                    filename: "Formio.min.js"
                },
                module: {
                    loaders: [
                        {
                            test: /require\.js$/,
                            loader: "exports?requirejs!script"
                        },
                        {
                            test: /\.jsx?$/,
                            loader: 'babel',
                            exclude: /node_modules/,
                            query: {
                                presets: ['react', 'es2015']
                            }
                        }
                    ],
                    resolve: {
                        extensions: ['', '.js', '.jsx'],
                        alias: {
                            requirejs$:  "./dist/build/"
                        },
                    },
                    noParse: [
                        /node_modules\/formiojs\//,
                    ],

                }
            }))
            .pipe(plugins.streamify(plugins.uglify()))
            .pipe(gulp.dest('./dist/build/'));
    }
}
