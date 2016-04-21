const gulp = require("gulp");
const gutil = require("gulp-util");
const liquid = require('gulp-liquid');
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const connect = require("gulp-connect");
const fs = require("fs");
const del = require("del");
const yaml = require("js-yaml");
const child = require("child_process");

var liquidFiles = ["**/*.html", "**/*.js", "!node_modules/**", "!_build/**", "!gulpfile.js"];
var sassFiles = ["**/*.scss", "!node_modules/**", "!_build/**"];

gulp.task("serve", ["rebuild"], function() {
	gulp.watch(liquidFiles.concat("strings.yaml"), ["liquid"]);
	gulp.watch(sassFiles, ["sass"]);

	connect.server({
		root: "_build",
		port: 8000
	});
});

gulp.task("liquid", function() {
	gulp.src(liquidFiles)
		.pipe(liquid({
			locals: yaml.safeLoad(fs.readFileSync("strings.yaml", "utf-8"))
		}))
		.pipe(gulp.dest("./_build/"));
});

gulp.task("sass", function() {
	gulp.src(sassFiles)
		.pipe(sass({ outputStyle: "compressed" }).on('error', sass.logError))
		.pipe(autoprefixer({ browsers: ["Chrome >= 38", "Firefox ESR", "iOS >= 8", "Explorer 11", "Android >= 4.4"] }))
		.pipe(gulp.dest("./_build/"));
});

gulp.task("bower", function(cb) {
	child.exec("bower update", function() {
		cb();
	});
});

gulp.task("clean", function() {
	del(["_build/**", "!_build", "!_build/bower_components/**"]);
});

gulp.task("rebuild", ["clean", "sass", "liquid"]);

gulp.task("default", ["rebuild", "bower"]);
