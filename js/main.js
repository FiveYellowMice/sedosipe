function constructInterface() { return Promise.all([

	new Promise(function(resolve) {
		$("head").append($("<link>")
			.attr("rel", "stylesheet")
			.attr("href", "{{ baseurl }}/bower_components/material-design-icons/iconfont/material-icons.css")
			.on("load", resolve)
		);
	}),

	new Promise(function(resolve) {
		$("head").append($("<link>")
			.attr("rel", "stylesheet")
			.attr("href", "{{ baseurl }}/css/generic.css")
			.on("load", resolve)
		);
	}),

	new Promise(function(resolve) {
		$("body").append(
			// Top bar
			$("<div>").addClass("topbar").append(
				$("<a>").addClass("navigation-menu-button top-bar-button material-icons").html("menu").attr("href", "javascript:void(0)").click(toggleSideBar),
				$("<h1>").addClass("top-bar-heading").text("sedosipE"),
				$("<div>").addClass("top-bar-right-buttons").append(
					$("<a>").addClass("top-bar-button material-icons").html("add").attr("href", "javascript:void(0)"),
					$("<a>").addClass("top-bar-button material-icons").html("search").attr("href", "javascript:void(0)"),
					$("<a>").addClass("top-bar-button material-icons").html("more_vert").attr("href", "javascript:void(0)").click(createMenu([
						{
							name: "{{ refresh }}"
						},
						{
							name: "{{ export }}"
						},
						{
							name: "{{ settings }}"
						}
					]))
				)
			),

			// Side bar
			$("<div>").addClass("sidebar").append(function() {
				var div = $("<div>");
				var names = ["{{ allShows }}", "{{ watchingShows }}", "{{ completedShows }}", "{{ droppedShows }}", "{{ plannedShows }}"];
				var behaviors = [undefined, undefined, undefined, undefined, undefined];
				for (var i = 0; i < names.length; i++) {
					var newItem = $("<a>").text(names[i]).attr("href", "javascript:void(0)");
					if (behaviors[i]) newItem.click(behaviors[i]);
					div.append(newItem);
				}
				return div;
			}),
			$("<div>").addClass("sidebar-outside-catcher").click(function() { toggleSideBar(false); }),

			// Content area
			$("<div>").addClass("main-interface")
		);
		resolve();
	})

]).then(function() { return new Promise(function(resolve) {
	$(".preload").velocity("fadeOut", { duration: 400, easing: "easeInOutCubic" }, resolve);
}); }); }

function toggleSideBar(arg) {
	// Open or close side bar based on a boolean argument, if not, toggle it.
	var sidebar = $(".sidebar");
	var toggle;
	if (typeof arg === "boolean") {
		toggle = arg;
	} else {
		toggle = !sidebar.is(".sidebar-active");
	}
	if (toggle) {
		$(".sidebar-outside-catcher").show();
		sidebar.addClass("sidebar-active");
	} else {
		$(".sidebar-outside-catcher").hide();
		sidebar.removeClass("sidebar-active");
	}
}

function createMenu(list) { return function(event) {
	// Returns a function that shows menu UI component created on a list of objects with compulsory name and optional behavior.
	var div = $("<div>").addClass("menu");
	list.forEach(function(item) {
		var newItem = $("<a>").text(item.name).attr("href", "javascript:void(0)");
		if (item.behavior) newItem.click(destroyMenu).click(behavior);
		div.append(newItem);
	});

	div.css({
		top: (event.pageY - $(document).scrollTop() - 12) + "px",
		left: (event.pageX - 144 + 12) + "px"
	});

	var catcher = $("<div>").addClass("menu-outside-catcher").click(destroyMenu);

	$("body").append(catcher, div);

	function destroyMenu() {
		$(".menu").velocity("fadeOut", { duration: 200, complete: function() {
			$(".menu-outside-catcher").remove();
			$(".menu").remove();
		} });
	}
} }

var db;
var preferences = {};
// Load database from localStorage or other cloud services, or create a new one
function loadDatabase() { return new Promise(function(resolve) {
	var sql = window.SQL;
	if (localStorage.hasOwnProperty("database")) {
		// Load existing
		db = new sql.Database(new TextEncoder("utf-16le").encode(localStorage.getItem("database")));
	} else {
		// Create new
		db = new sql.Database();
		db.run("CREATE TABLE metadata (version int, time_created int, time_modified int)");
		db.run("INSERT INTO metadata (version, time_created, time_modified) VALUES (1, " + Date.now() + ", " + Date.now() + ")");
		saveDB();
	}
	console.log(
		"Database info:\n" +
		"    Format version: " + db.exec("SELECT version FROM metadata")[0].values[0][0] + "\n" +
		"    Creation time: " + new Date(db.exec("SELECT time_created FROM metadata")[0].values[0][0]) + "\n" +
		"    Last modified: " + new Date(db.exec("SELECT time_modified FROM metadata")[0].values[0][0])
	);
	resolve();
}); }

// Function should be run every time DB is modified
function updateDB() {
	db.run("UPDATE metadata SET time_modified = " + Date.now());
	if (preferences.autoSave) saveDB();
}

function saveDB() {
	localStorage.setItem("database", new TextDecoder("utf-16le").decode(db.export()));
}
