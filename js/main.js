var sedosipe = {};

sedosipe.db = null;
sedosipe.preferences = {};

sedosipe.doConstruction = function doConstruction() { return Promise.all([

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

	// Interface
	new Promise(function constructInterface(resolve) {
		$("body").append(
			// Top bar
			$("<div>").addClass("topbar").append(
				$("<a>").addClass("navigation-menu-button top-bar-button material-icons").html("menu").attr("href", "javascript:void(0)").click(sedosipe.toggleSideBar),
				$("<h1>").addClass("top-bar-heading").text("sedosipE"),
				$("<div>").addClass("top-bar-right-buttons").append(
					$("<a>").addClass("top-bar-button material-icons").html("add").attr("href", "javascript:void(0)"),
					$("<a>").addClass("top-bar-button material-icons").html("search").attr("href", "javascript:void(0)"),
					$("<a>").addClass("top-bar-button material-icons").html("more_vert").attr("href", "javascript:void(0)").click(sedosipe.createMenu([
						{
							name: "{{ refresh }}"
						},
						{
							name: "{{ export }}",
							behavior: function() {
								if (!sedosipe.exportDB && !sedosipe.importDB) {
									require("{{ baseurl }}/js/backup.js").then(function() { sedosipe.exportDB(); });
								} else {
									sedosipe.exportDB();
								}
							}
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
			$("<div>").addClass("sidebar-outside-catcher").click(function() { sedosipe.toggleSideBar(false); }),

			// Content area
			$("<div>").addClass("main-interface")
		);
		resolve();
	}),

	// Load database from localStorage or other cloud services, or create a new one
	new Promise(function loadDatabase(resolve) {
		var sql = window.SQL;
		if (localStorage.hasOwnProperty("database")) {
			// Load existing
			sedosipe.db = new sql.Database(new TextEncoder("utf-16le").encode(localStorage.getItem("database")));
		} else {
			// Create new
			sedosipe.db = new sql.Database();
			sedosipe.db.run("CREATE TABLE metadata (version int, time_created int, time_modified int)");
			sedosipe.db.run("INSERT INTO metadata (version, time_created, time_modified) VALUES (1, " + Date.now() + ", " + Date.now() + ")");
			sedosipe.db.run("CREATE TABLE shows (id INTEGER PRIMARY KEY, title text NOT NULL, image text, stars int CHECK(stars >= 0 AND stars <= 5), status text, total_episodes int, watched_episodes int, start_date int, finish_date int, comment text)");
			/*
			ID | Title | Image | Stars | Status | Total episodes | Watched episodes | Start date | Finish date | Comment
			*/
			sedosipe.saveDB();
		}
		console.log(
			"Database info:\n" +
			"    Format version: " + sedosipe.db.exec("SELECT version FROM metadata")[0].values[0][0] + "\n" +
			"    Creation time: " + new Date(sedosipe.db.exec("SELECT time_created FROM metadata")[0].values[0][0]) + "\n" +
			"    Last modified: " + new Date(sedosipe.db.exec("SELECT time_modified FROM metadata")[0].values[0][0])
		);
		resolve();
	})

]).then(function showListData() { return new Promise(function(resolve) {
	var list = $("<ol>").addClass("show-list");
	$(".main-interface").append(list);

	var query = sedosipe.db.exec("SELECT id, image, title, status, total_episodes, watched_episodes FROM shows");
	if (query.length === 0) {
		resolve();
		return;
	}
	query[0].values.forEach(function(show) {
		var item = $("<li>").addClass("show-item");
		list.append(item);

		item.append($("<div>").addClass("show-id").text(show[0]));
		item.append($("<div>").addClass("show-image").css("background-image", "url(\"" + (show[1] || "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=") + "\")"));
		item.append($("<div>").addClass("show-title").text(show[2]));

		var rightPart = $("<div>").addClass("show-item-right-part");
		item.append(rightPart);

		rightPart.append($("<span>").addClass("show-item-status").text((function(status, total, watched) {
			// Show info on different statuses
			if (status === "watching") {
				if (total && watched) {
					return watched + " / " + total + " - {{ watchingShows }}";
				} else if (total) {
					return "{{ totalHave }}".replace("$n", String(total)) + " - {{ watchingShows }}";
				} else if (watched) {
					return "{{ numberSoFar }}".replace("$n", String(watched)) + " - {{ watchingShows }}";
				} else {
					return "{{ watchingShows }}";
				}
			} else if (status === "completed") {
				if (total) {
					return total + " - {{ completedShows }}";
				} else {
					return "{{ completedShows }}";
				}
			} else if (status === "dropped") {
				if (total && watched) {
					return total + " / " + watched + " - {{ droppedShows }}";
				} else if (total) {
					return "{{ totalHave }}".replace("$n", String(total)) + " - {{ droppedShows }}";
				} else if (watched) {
					return "{{ numberSoFar }}".replace("$n", String(watched)) + " - {{ droppedShows }}";
				} else {
					return "{{ droppedShows }}";
				}
			} else if (status === "planned") {
				return "{{ plannedShows }}";
			} else {
				return String(status);
			}
		})(show[3], show[4], show[5])));

		if (show[3] === "watching") { // +1 button if watching
			rightPart.append($("<a>").addClass("show-item-button material-icons").html("plus_one").attr("href", "javascript:void(0)"));
		}
		if (show[3] === "planned") { // Start watching button
			rightPart.append($("<a>").addClass("show-item-button material-icons").html("play_arrow").attr("href", "javascript:void(0)"));
		}

		rightPart.append($("<a>").addClass("show-item-button material-icons").html("more_vert").attr("href", "javascript:void(0)").click(sedosipe.createMenu([
			{
				name: "{{ edit }}",
				behavior: function(menuEvent, event) {
					var item = event.target.parentElement.parentElement;
					if (!sedosipe.editItem) {
						require("{{ baseurl }}/js/edit.js").then(function() { sedosipe.editItem(item); });
					} else {
						sedosipe.editItem(item);
					}
				}
			},
			{
				name: "{{ delete }}"
			}
		])));
	});
	resolve();

}); }).then(function() { return new Promise(function(resolve) {
	$(".preload").velocity("fadeOut", { duration: 400, easing: "easeInOutCubic" }, resolve);
}); }); }

sedosipe.toggleSideBar = function toggleSideBar(arg) {
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

sedosipe.createMenu = function createMenu(list) { return function(event) {
	// Returns a function that shows menu UI component created on a list of objects with compulsory name and optional behavior.
	var div = $("<div>").addClass("menu");
	list.forEach(function(item) {
		var newItem = $("<a>").text(item.name).attr("href", "javascript:void(0)");
		if (item.behavior) newItem.click(destroyMenu).click(function(menuEvent) { item.behavior(menuEvent, event); });
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

// Function should be run every time DB is modified
sedosipe.updateDB = function updateDB() {
	sedosipe.db.run("UPDATE metadata SET time_modified = " + Date.now());
	if (sedosipe.preferences.autoSave) saveDB();
}

sedosipe.saveDB = function saveDB() {
	localStorage.setItem("database", new TextDecoder("utf-16le").decode(sedosipe.db.export()));
}
