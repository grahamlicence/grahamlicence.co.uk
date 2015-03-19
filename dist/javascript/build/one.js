// temp test
(function () {
	var $links = $('.main-nav a'),
		hasHistory = ("pushState" in history),
		page;

	function loadPage (e) {
		e.preventDefault();
		var $main = $('.main-content'),
			link = e.target.href,
			loc = document.location.href;

		if (link === loc) {
			return;
		}

		$.ajax(
			{url: link}
		).done(function (resp) {
			// console.log(resp)
			var $resp = $(resp),
				$content = $resp.find('.main-content'),
				title = $resp.find('title').text;

			console.log($content)
			$main.replaceWith($content);

			// update page and history
			document.title = title;
			if (hasHistory) {
				history.pushState(null, title, link);
			}
		})

	}

	$links.on('click', loadPage);


})();