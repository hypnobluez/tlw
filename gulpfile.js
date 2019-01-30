'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var tailwindcss = require('tailwindcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");

gulp.task('clean', function () {
    return del(['./src/css/temp', './src/css/temp.css']);
});

gulp.task('sass-one', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/temp'));
});

gulp.task('css:minify', function cssMinify() {
    return gulp.src('./src/css/temp.css')
        .pipe(cleanCSS())
        .pipe(rename('theme.css'))
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.stream());
});

gulp.task('tailwind', function () {
    return gulp.src('./src/css/temp/temp.css')
        .pipe(postcss([
            tailwindcss('./tailwind.js'),
            autoprefixer,
        ]))
        .pipe(gulp.dest('./src/css/'))
});
gulp.task('build-css', gulp.series('sass-one', 'tailwind', 'css:minify', 'clean'));

gulp.task('serve', gulp.series('build-css', function () {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });

    gulp.watch("src/scss/**/*.scss", gulp.series('build-css', browserSync.reload));
    gulp.watch("src/**/*.html").on('change', browserSync.reload);
}));




gulp.task('default', gulp.parallel('serve'));

