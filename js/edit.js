sedosipe.editItem = function editItem(item) { return new Promise(function(resolve, reject) {
	var id = Number($(item).find(".show-id").text()); // Find ID of the show
	var query = sedosipe.db.exec("SELECT image, title, status, total_episodes, watched_episodes FROM shows WHERE id == " + id)[0].values[0];
	var show = { image: query[0], title: query[1], status: query[2], totalEpisodes: query[3], watchedEpisodes: query[4] };

	$(item).append(
		$("<div>").addClass("show-editing-components").append(
			$("<div>").addClass("show-editing-image").append(
				$("<div>").addClass("show-editing-image-preview").css("background-image", "url(\"" + (show.image || "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=") + "\")"),
				$("<span>").addClass("show-editing-label").text("{{ image }}"),
				$("<input>").addClass("show-editing-image-url show-editing-field").val(show.image || "")
			),
			$("<div>").addClass("show-editing-text").append(
				$("<span>").addClass("show-editing-label").text("{{ title }}"),
				$("<input>").addClass("show-editing-title show-editing-field").val(show.title || ""),
				$("<span>").addClass("show-editing-label").text("{{ status }}"),
				$("<select>").addClass("show-editing-status show-editing-field").append(function() { // Create a drop down menu and select right choice here
					result = [];
					[["watching", "{{ watchingShows }}"], ["completed", "{{ completedShows }}"], ["dropped", "{{ droppedShows }}"], ["planned", "{{ plannedShows }}"]].forEach(function(option) {
						var el = $("<option>").val(option[0]).text(option[1]);
						if (show.status === option[0]) el.attr("selected", "selected");
						result.push(el);
					});
					return result;
				}),
				$("<div>").addClass("show-editing-episodes").append(
					$("<div>").append(
						$("<span>").addClass("show-editing-label").text("{{ watchedEpisodes }}"),
						$("<input>").addClass("show-editing-watched show-editing-field").attr("type", "number").val(show.watchedEpisodes || 0)
					),
					$("<div>").append(
						$("<span>").addClass("show-editing-label").text("{{ totalEpisodes }}"),
						$("<input>").addClass("show-editing-total show-editing-field").attr("type", "number").val(show.totalEpisodes || 0)
					)
				)
			)
		).hide(),

		$("<div>").addClass("show-editing-actions").append(
			$("<a>").addClass("paper-button").text("{{ cancel }}").attr("href", "javascript:void(0)").click(close),
			$("<a>").addClass("paper-button paper-button-primary").text("{{ save }}").attr("href", "javascript:void(0)")
		).hide()
	);

	// Opening animation
	$(item).find(".show-image, .show-title, .show-item-right-part").fadeOut(300, function() {
		$(item).addClass("show-item-editing");
		setTimeout(function() {
			$(item).find(".show-editing-components, .show-editing-actions").fadeIn(300);
		}, 400)
	});

	function close() {
		$(item).find(".show-editing-components, .show-editing-actions").fadeOut(300, function() {
			$(item).removeClass("show-item-editing");
			$(item).find(".show-editing-components, .show-editing-actions").remove();
			setTimeout(function() {
				$(item).find(".show-image, .show-title, .show-item-right-part").fadeIn(300, function() { resolve(false); });
			}, 400)
		});
	}
}); }
