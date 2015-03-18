// temp test
(function () {
	var $links = $('.main-nav a'),
		page;

	function loadPage (e) {
		e.preventDefault();
		var link = e.target.href,
			loc = document.location.href;

		if (link === loc) {
			return;
		}

		$.ajax(
			{url: link}
		).done(function (resp) {
			console.log(resp)
		})

	}

	$links.on('click', loadPage);


})();