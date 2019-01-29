'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var postcss = require('gulp-postcss');
var tailwindcss = require('tailwindcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('sass', function () {
    return gulp.src('./styles/scss/*.scss')
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./styles/css'));
});

gulp.task('tailwind', function () {
    return gulp.src('./styles/css/main.css')
        .pipe(postcss([
            tailwindcss('./tailwind.js'),
            autoprefixer,
        ]))
        .pipe(gulp.dest('./styles/public/css/'))
});
gulp.task('serve', gulp.series('sass', 'tailwind', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("./styles/scss/*.scss", gulp.series('sass'));
    gulp.watch("./styles/css/*.css", gulp.series('tailwind', browserSync.reload));
    gulp.watch("./*.html").on('change', browserSync.reload);
}));



gulp.task('default', gulp.parallel('serve'));

