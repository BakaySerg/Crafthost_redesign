const gulp = require("gulp"),
	sourcemaps = require("gulp-sourcemaps"),
	sass = require("gulp-sass")(require("sass")),
	browserSync = require("browser-sync").create(),
	changed = require("gulp-changed"),
	cleancss = require("gulp-clean-css"),
	fileinclude = require("gulp-file-include"),
	svgSprite = require("gulp-svg-sprite"),
	path = require("path"),
	glob = require("glob"),
	replace = require("gulp-replace"),
	imagemin = require("gulp-imagemin"),
	newer = require("gulp-newer");

// BrowserSync
gulp.task("browser-sync", function (done) {
	browserSync.init({
		server: { baseDir: "app" },
		notify: false,
	});
	done();
});

// SVG sprite (only SVG)
gulp.task("svg-sprite", function (done) {
	const folders = glob.sync("dev/img/**/");
	const tasks = folders.map((folder) => {
		const hasSvg = glob.sync(path.join(folder, "*.svg")).length > 0;
		if (!hasSvg) return Promise.resolve();

		const relativePath = path.relative("dev/img", folder);

		const config = {
			mode: {
				symbol: {
					sprite: "sprite.svg",
					example: false,
					dest: ".",
				},
			},
			shape: {
				transform: [],
				id: {
					generator: function (name) {
						return path.basename(name, ".svg");
					},
				},
			},
			svg: {
				pretty: true,
			},
		};

		const isConst = (file) => file.basename.endsWith("-const.svg");

		return gulp
			.src(path.join(folder, "*.svg"))
			.pipe(replace(/fill\s*=\s*"(?!\s*(?:none|url\(|[a-zA-Z]+))[^"]*"/gi, function (match) {
				return isConst(this.file) ? match : 'fill="currentColor"';
			}))
			.pipe(replace(/stroke\s*=\s*"(?!\s*(?:none|url\(|[a-zA-Z]+))[^"]*"/gi, function (match) {
				return isConst(this.file) ? match : 'stroke="currentColor"';
			}))
			.pipe(svgSprite(config))
			.pipe(gulp.dest(path.join("app/img", relativePath)));
	});

	return Promise.all(tasks).then(() => done());
});

// Images (jpg, png, etc. without SVG)
gulp.task("images", function () {
	return gulp
		.src(["dev/img/**/*", "!dev/img/**/*.svg"], { encoding: false })
		.pipe(newer("app/img"))
		.pipe(
			imagemin([imagemin.mozjpeg({ quality: 75, progressive: true }), imagemin.optipng({ optimizationLevel: 5 })], {
				verbose: true,
			}),
		)
		.pipe(gulp.dest("app/img"))
		.pipe(browserSync.stream());
});

// HTML
gulp.task("layout", function () {
	return gulp
		.src("dev/*.html")
		.pipe(
			fileinclude({
				prefix: "@@",
				basepath: "@file",
			}),
		)
		.pipe(changed("app", { hasChanged: changed.compareContents }))
		.pipe(gulp.dest("app/"))
		.pipe(browserSync.stream());
});

// Styles
gulp.task("styles", function () {
	return gulp
		.src("dev/scss/**/*.scss")
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass({ outputStyle: "expanded", silenceDeprecations: ["legacy-js-api"] }).on("error", sass.logError))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest("./app/css/"))
		.pipe(browserSync.stream());
});

// Scripts
gulp.task("scripts", function () {
	return gulp.src("dev/js/*.js").pipe(gulp.dest("app/js")).pipe(browserSync.stream());
});

// Watch
gulp.task("watch", function (done) {
	gulp.watch(["dev/**/*.js"], gulp.parallel("scripts"));
	gulp.watch("dev/**/*.html", gulp.parallel("layout"));
	gulp.watch("dev/scss/**/*.scss", gulp.parallel("styles"));
	gulp.watch("dev/img/**/*.svg", gulp.parallel("svg-sprite"));
	gulp.watch(["dev/img/**/*", "!dev/img/**/*.svg"], gulp.parallel("images"));
	done();
});

// Default
gulp.task("default", gulp.parallel("layout", "styles", "scripts", "images", "svg-sprite", "browser-sync", "watch"));
