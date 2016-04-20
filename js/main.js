function constructInterface(callback) {
	$(".preload").velocity("fadeOut", { duration: 400, easing: "easeInOutCubic" });
	callback();
}
