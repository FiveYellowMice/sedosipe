const gulp = require("gulp");
const liquid = require('gulp-liquid');
const connect = require("gulp-connect");
const fs = require("fs");
const del = require("del");
const yaml = require("js-yaml");
const child = require("child_process");

var liquidFiles = ["**/*.html", "**/*.js", "!node_modules/**", "!_build/**", "!gulpfile.js"];

function build(glob) {
	gulp.src(glob)
	.pipe(liquid({
		locals: yaml.safeLoad(fs.readFileSync("strings.yaml", "utf-8"))
	}))
	.pipe(gulp.dest("./_build/"));
}

gulp.task("serve", ["rebuild"], function() {
	gulp.watch(liquidFiles, function(event) {
		console.log(`'${event.path}' has ${event.type}.`);
		switch (event.type) {
			case "added":
			case "changed":
				build(event.path);
				break;
			case "deleted":
				del(event.path);
				break;
		}
	});
	gulp.watch("strings.yaml", ["rebuild"]);

	connect.server({
		root: "_build",
		port: 8000
	});
});

gulp.task("rebuild", function() {
	del(["_build/**", "!_build", "!_build/bower_components/**"]);
	build(liquidFiles);
});

gulp.task("bower", function(cb) {
	child.exec("bower update", function() {
		cb();
	});
});

gulp.task("default", ["rebuild", "bower"]);
