sedosipe.exportDB = function exportDB() { return new Promise(function(resolve) {
	var blob = new Blob([sedosipe.db.export()], { type: "application/octet-stream" });
	if (!window.URL) window.URL = window.webkitURL;
	var url = URL.createObjectURL(blob);
	var el = document.createElement("a");
	el.href = url;
	el.download = "sedosipe.db";
	el.style.display = "none";
	$("body").append(el);
	el.click();
	URL.revokeObjectURL(url);
	el.remove();
	resolve();
}); }

sedosipe.importDB = function importDB() { return new Promise(function(resolve) {
	resolve();
}); }
