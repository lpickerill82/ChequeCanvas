var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    package = require('./package.json');


gulp.task('css', function () {
    return gulp.src('Src/SASS/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 4 version'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('Content/Css'))
        .pipe(cssnano({ zindex: false }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('Content/Css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: "http://localhost/Cheque/"
       //   proxy: " http://localhost:3000/Cheque/"
    });
});

//gulp.task('browser-sync', function () {
//    //browserSync.init(null, {
//    //    server: {
//    //        baseDir: "http://localhost/StyleGuide/"
//    //    }
//    //});
//});
gulp.task('bs-reload', function () {
    browserSync.reload();
});
gulp.task('watch-sass', function () {
    gulp.watch('src/SASS/*/*.scss', ['css', 'bs-reload']);
});



gulp.task('default', ['browser-sync', 'css', 'bs-reload'], function () {
    gulp.watch("Src/SASS/*/*.scss", ['css']);
    gulp.watch("**/*.html", ['bs-reload']);
});
