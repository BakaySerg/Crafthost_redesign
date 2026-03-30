const gulp = require("gulp"),
	sourcemaps = require("gulp-sourcemaps"),
	sass = require("gulp-sass")(require("sass")),
	browserSync = require("browser-sync"),
	// concat        = require('gulp-concat'),
	// uglify        = require('gulp-uglify'),
	changed = require("gulp-changed"),
	cleancss = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	fileinclude = require("gulp-file-include"),
	svgSprite = require("gulp-svg-sprite"),
	path = require("path"),
	glob = require("glob"),
	replace = require("gulp-replace"),
	// groupMedia        = require('gulp-group-css-media-queries'), //"gulp-group-css-media-queries": "^1.2.2",
	notify = require("gulp-notify");

gulp.task("browser-sync", function (done) {
	browserSync({
		server: { baseDir: "app" },
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
	done();
});

gulp.task("svg-sprite", function () {
	const folders = glob.sync("dev/img/*/");

	const tasks = folders.map((folder) => {
		const folderName = path.basename(folder);

		const config = {
			mode: {
				symbol: {
					sprite: "sprite.svg",
					example: false,
					dest: ".", // убирает папку symbol
				},
			},
			shape: {
				transform: [], // откл минификацию
				id: {
					generator: function (name) {
						return path.basename(name, ".svg");
					},
				},
			},
			svg: {
				pretty: true, // делает код читабельн
			},
		};

		return gulp
			.src(path.join(folder, "*.svg"))
			.pipe(replace(/fill\s*=\s*"(?!none)(.*?)"/gi, 'fill="currentColor"'))
			.pipe(replace(/stroke\s*=\s*"(?!none)(.*?)"/gi, 'stroke="currentColor"'))
			.pipe(svgSprite(config))
			.pipe(gulp.dest(path.join("app/img", folderName)));
	});

	return Promise.all(tasks);
});


gulp.task('layout', function() {
    return gulp.src('dev/*.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(changed('app'),{hasChanged: changed.compareContents})    // Ignore unchanged files (after all @@including)
		.pipe(gulp.dest('app/'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('styles', function() {
	return gulp.src('dev/scss/**/*.scss')
	// return gulp.src('dev/scss/*.scss')
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	// .pipe(rename({ suffix: '.min', prefix : '' }))
	// .pipe(groupMedia())             // before build project for production
	.pipe(cleancss( {level: { 1: { specialComments: 0 }}}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./app/css/'))
	.pipe(browserSync.reload({ stream: true }));
});
// gulp.task('styles-separated', function() {
// 	return gulp.src('dev/scss/pages/*.scss')   	//pages
// 	.pipe(sourcemaps.init({loadMaps: true}))
// 	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
// 	.pipe(rename({ suffix: '.min', prefix : '' }))
// 	.pipe(cleancss( {level: { 1: { specialComments: 0 }}}))
// 	.pipe(gulp.dest('app/css'))
// 	.pipe(sourcemaps.write('./'))
// 	.pipe(gulp.dest('./app/css/'))
// 	.pipe(browserSync.reload({ stream: true }));
// });

gulp.task('scripts', function() {
	return gulp.src([
		'dev/js/*.js', // Always (scripts) at the end
		])
	// .pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Minify js - opt.
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});


gulp.task("watch", function (done) {
	gulp.watch(["dev/**/*.js", "dev/js/main.js"], gulp.parallel("scripts"));
	gulp.watch("dev/**/*.html", gulp.parallel("layout"));
	gulp.watch("dev/scss/**/*.scss", gulp.parallel("styles"));
	done();
});
gulp.task('default', gulp.parallel('layout','styles', 'scripts', 'browser-sync', 'watch'));