var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var addsrc = require('gulp-add-src');
var wrap = require('gulp-wrap');
var elementQuery = require('./tasks/gulp');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('build', function() {
    return browserify({
            entries: 'index.js',
            debug: true,
            transform: [babelify]
        })
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('index.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(''));
});

gulp.task('js', function() {
    return gulp
        .src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/codemirror/lib/codemirror.js',
            'node_modules/codemirror/mode/css/css.js',
            'node_modules/codemirror/mode/xml/xml.js',
            'node_modules/codemirror/mode/htmlmixed/htmlmixed.js'
        ])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
    return gulp.src('./index.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'))
        .pipe(elementQuery())
        .pipe(addsrc.append([
            'node_modules/codemirror/lib/codemirror.css',
            'node_modules/codemirror/theme/base16-light.css',
            'node_modules/codemirror/theme/neat.css'
        ]))
        .pipe(concat('index.css'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(['**/*.js', '!**/*.min.js', '!gulpfile.js', '!node_modules/', '!dist/'], ['build', 'js']);
    gulp.watch(['**/*.scss', '../*.scss', '!node_modules/'], ['css']);
});

gulp.task('default', ['build', 'js', 'css', 'watch']);
