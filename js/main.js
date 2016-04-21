function constructInterface() { return Promise.all([

	new Promise(function(resolve) {
		$("head").append($("<link>")
			.attr("rel", "stylesheet")
			.attr("href", "{{ baseurl }}/css/generic.css")
			.on("load", resolve)
		);
	}),

	new Promise(function(resolve) {
		$("body").append(
			$("<div>").addClass("topbar"),
			$("<div>").addClass("main-interface")
		);
		resolve();
	})

]).then(function() { return new Promise(function(resolve) {
	$(".preload").velocity("fadeOut", { duration: 400, easing: "easeInOutCubic" }, resolve);
}); }); }
