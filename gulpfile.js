const gulp = require('gulp');

// stylus
const plumber = require('gulp-plumber');
const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');

// js
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');

// ejs
const ejs = require('gulp-ejs');
const rename = require("gulp-rename");

// imgmin
const imagemin = require('gulp-imagemin');

// clean
const del = require('del');

// hash
const replace = require('gulp-replace');

// *** TASKS *** //
let mode = "develop";

// *** css
gulp.task('css', function () {
	return gulp.src('src/css/all.styl')
		.pipe(plumber())
		.pipe(stylus({ compress: false }))
		.pipe(postcss([autoprefixer({ grid: true })]))
		.pipe(gulpif(mode === 'production', cleanCSS()))
		.pipe(gulp.dest('static/css'));
});

// *** js
gulp.task('js', function () {
	return gulp.src(['node_modules/jquery/dist/jquery.js', 'src/js/**/*.js'])
		.pipe(babel({ presets: ['@babel/preset-env'] }))
		.pipe(concat('all.js'))
		.pipe(gulpif(mode === 'production', uglify()))
		.pipe(gulp.dest('static/js'));

});

// *** ejs
gulp.task('ejs', function () {
	return gulp.src(['src/tpl/**/*.ejs', '!src/tpl/parts/*.ejs'])
		.pipe(ejs({}))
		.pipe(rename({ extname: '.html' }))
		.pipe(gulp.dest('static'));
});

// *** imagemin
gulp.task('min', function () {
	return gulp.src(['src/img/**/*.{jpg,png,gif,svg}', '!src/img/!min/**/*'])
		.pipe(imagemin([
			imagemin.jpegtran({ progressive: true }),
			imagemin.optipng(),
			imagemin.gifsicle(),
			imagemin.svgo(),
		]))
		.pipe(gulp.dest('static/img'));
});

// *** copy images
gulp.task('imgcopy', function () {
	return gulp.src('src/img/!min/**/*')
		.pipe(gulp.dest('static/img'));
});

// *** clean
gulp.task('clean', function () {
	return del('static/');
});

// *** cache
gulp.task('hash', function () {
	let cbString = new Date().getTime();
	return gulp.src(['static/index.html'])
		.pipe(replace(/cb=\d+/g, 'cb=' + cbString))
		.pipe(gulp.dest('static'));
});

// *** DEFAULT
gulp.task('default', function (done) {
	gulp.series('clean', gulp.parallel('css', 'js', 'ejs', 'min', 'imgcopy'), 'hash')(done);
});

// *** PRODUCTION
gulp.task('prod', function (done) {
	mode = 'production';
	gulp.parallel('default')(done);
});

// *** WATCH
gulp.task('watch', function () {
	gulp.watch('src/css/**/*.*', gulp.series('css'));
	gulp.watch('src/js/**/*.js', gulp.series('js'));
	gulp.watch('src/tpl/**/*.ejs', gulp.series('ejs'));
});