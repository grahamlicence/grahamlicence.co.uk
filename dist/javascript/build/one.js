// temp test
(function () {
	var $navLinks = $('.main-nav a'),
		hasHistory = ("pushState" in history),
		page;


	function loadPage (e) {
		e.preventDefault();
		var $main = $('.main-content'),
			$nav = $('.main-nav'),
			link = e.target.href,
			loc = document.location.href;

		if (link === loc) {
			return;
		}

		function setSubNav () {
		}

		$.ajax(
			{url: link}
		).done(function (resp) {
			// console.log(JSON.parse(resp))
			var $resp = $(resp),
				$content = $resp.find('.main-content'),
				title = $resp.filter('title').text();

			// console.log(resp)
			$main.replaceWith($content);
			
			// update page and history
			document.title = title;
			if (hasHistory) {
				history.pushState(null, title, link);
			}
		})

	}

	// add event handlers
	$navLinks.on('click', loadPage);
	$(document).on('click', '.sub-nav a', loadPage);


})();