const {task, src, dest, watch, series, parallel}  = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");
const del = require('del');
const browserSync = require('browser-sync').create();
const rename = require("gulp-rename");

const cssFiles = [
    './src/css/style2.css',
    './src/css/style1.css'

];

const jsFiles = [
    './src/js/main.js'
];

const styles = () => {
    return src(cssFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('all.css'))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8', level: 2}))
        .pipe(sourcemaps.write())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('./build/css'))
        .pipe(browserSync.stream());
};

const scripts = () => {
    return src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('all.js'))
        .pipe(uglify({toplevel: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('./build/js'))
        .pipe(browserSync.stream());

};

const clean = () => {
    return del(['./build/*', '!./build/img']);
};

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    watch('./src/css/**/*.css', styles);
    watch('./src/js/**/*.js', scripts);
    watch("./**/*.html").on('change', browserSync.reload);
};

task('styles', styles);
task('scripts', scripts);
task('del', clean);
task('watch', watchFiles);

task('build', series(clean, parallel(styles, scripts)));
task('default', series('build', 'watch'));