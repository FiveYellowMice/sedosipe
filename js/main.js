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
					$("<a>").addClass("top-bar-button material-icons").html("search").attr("href", "javascript:void(0)"),
					$("<a>").addClass("top-bar-button material-icons").html("more_vert").attr("href", "javascript:void(0)").click(function() {
						console.log("show menu");
						$(".topbar").append(createMenu("top-bar-menu", [
							{
								name: "{{ refresh }}"
							},
							{
								name: "{{ settings }}"
							}
						]));
					})
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

function createMenu(className, list) {
	// Returns a jQuery object of menu UI component created on a list of objects with compulsory name and optional behavior.
	var div = $("<div>").addClass(className + " menu");
	list.forEach(function(item) {
		var newItem = $("<a>").text(item.name).attr("href", "javascript:void(0)");
		if (item.behavior) newItem.click(behavior);
		div.append(newItem);
	});
	div.mouseleave(function() {
		$(".menu").velocity("fadeOut", { duration: 200, complete: function() {
			$(".menu").remove();
		} });
	});
	return div;
}
