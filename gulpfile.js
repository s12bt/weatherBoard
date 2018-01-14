var path = require('path');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync('./package.json'));
var assetsPath = path.resolve(pkg.path.assetsDir);
var sassEntryFile = path.resolve(pkg.path.sassEntryFile);

var gulp = require('gulp');

// sass compiler
var sass = require('gulp-sass');

// add vender prifix
var autoprefixer = require('gulp-autoprefixer');

// error handling
var plumber = require('gulp-plumber');

gulp.task('sass', function() {
    gulp.src(sassEntryFile)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest(assetsPath));
});

gulp.task('default', function() {
    gulp.watch(path.join(assetsPath, '**/*.scss'),['sass']);
});
