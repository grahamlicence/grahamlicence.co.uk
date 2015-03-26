// temp test
(function () {
	var hasHistory = ("pushState" in history);


	function loadPage (link, newPage) {
		var $main = $('.main-content');

		$.ajax({url: link})
			.done(function (resp) {
				// console.log(JSON.parse(resp))
				var $resp = $(resp),
					$content = $resp.find('.main-content'),
					title = $resp.filter('title').text();

				// console.log(resp)
				$main.replaceWith($content);
				
				// update page and history
				document.title = title;
				if (hasHistory && newPage) {
					history.pushState(null, title, link);
				}
			});
	}

	function linkClick (e) {
		var link = e.target.href;

		// check if external link
		if (e.target.hostname !== document.location.hostname) {
			return;
		}
		e.preventDefault();
		// check if linking to current page
		if (link === document.location.href) {
			return;
		}

		loadPage(link, true);

	}

	function pageChange (e) {
		e.preventDefault();
	    loadPage(document.location.href);
	}

	// add event handlers
	$(document).on('click', 'a', linkClick);
	$(window).bind('popstate', pageChange);


})();