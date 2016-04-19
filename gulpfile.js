const gulp = require("gulp");
const liquid = require('gulp-liquid');
const fs = require("fs");
const rimraf = require("rimraf");
const yaml = require("js-yaml");
const child = require("child_process");

gulp.task("build", function() {
	rimraf.sync("_build/*");
	gulp.src(["**/*.html", "**/*.js", "!bower_components/**", "!node_modules/**", "!_build/**", "!gulpfile.js"])
	.pipe(liquid({
		locals: yaml.safeLoad(fs.readFileSync("strings.yaml", "utf-8"))
	}))
	.pipe(gulp.dest("./_build/"));
});

gulp.task("bower", function(cb) {
	try {
		fs.mkdirSync("_build");
		fs.symlinkSync("../bower_components", "./_build/bower_components");
	} catch (e) {
		if (e.code !== "EEXIST") throw e;
	}
	child.exec("bower update", function() {
		cb();
	});
});

gulp.task("default", ["build", "bower"]);
