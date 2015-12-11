var gulp      = require('gulp');
var minify    = require('gulp-minify-css');
var uglify    = require('gulp-uglify');
var rename    = require('gulp-rename');

// minify and uglify the raw source JS and CSS
gulp.task('minify', function() {
  gulp.src('./map-compare-widget/map-compare-widget.css')
    .pipe(minify())
    .pipe(rename('map-compare-widget-min.css'))
    .pipe(gulp.dest('./map-compare-widget/'));

  return gulp.src('./map-compare-widget/map-compare-widget.js')
    .pipe(uglify())
    .pipe(rename('map-compare-widget-min.js'))
    .pipe(gulp.dest('./map-compare-widget/'));
});

// put the minified files in the demo directory
gulp.task('bundle-demo', ['minify'], function() {
  return gulp.src('./map-compare-widget/*-min.*')
    .pipe(gulp.dest('./demo/scripts/map-compare-widget/'));
});

// put the minified files in the demo directory
gulp.task('bundle-nemac-demo', ['minify'], function() {
  gulp.src('./map-compare-widget/*.css')
    .pipe(gulp.dest('../css/'));

  return gulp.src('./map-compare-widget/*.js')
    .pipe(gulp.dest('../js/'));
});

// default task does it all
gulp.task('default', ['minify', 'bundle-demo', 'bundle-nemac-demo'], function() {

});

// continuous rebuild during development
gulp.task('watch', function() {
    gulp.watch('./map-compare-widget/**', ['bundle-demo']);
    gulp.watch('./map-compare-widget/**', ['bundle-nemac-demo']);
});
