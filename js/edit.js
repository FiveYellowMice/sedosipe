sedosipe.editItem = function editItem(item) { return new Promise(function(resolve, reject) {
	var id = Number($(item).find(".show-id").text()); // Find ID of the show
	console.log(id);

	$(item).append($("<div>").addClass("show-editing-actions").append(
		$("<a>").addClass("paper-button").text("{{ cancel }}").attr("href", "javascript:void(0)").click(cancel),
		$("<a>").addClass("paper-button paper-button-primary").text("{{ save }}").attr("href", "javascript:void(0)")
	).hide());

	// Opening animation
	$(item).find(".show-image, .show-title, .show-item-right-part").fadeOut(300, function() {
		$(item).addClass("show-item-editing");
		setTimeout(function() {
			$(item).find(".show-editing-actions").fadeIn(300);
		}, 400)
	});

	function cancel() {
		$(item).find(".show-editing-actions").fadeOut(300, function() {
			$(item).removeClass("show-item-editing");
			$(item).find(".show-editing-actions").remove();
			setTimeout(function() {
				$(item).find(".show-image, .show-title, .show-item-right-part").fadeIn(300, function() { resolve(false); });
			}, 400)
		});
	}
}); }
