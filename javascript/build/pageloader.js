(function () {
	var hasHistory = ('pushState' in history);

    /**
     * Loads page via agax
     * @private
     * @param {Sring} link - href of page to load
     * @param {Boolean} newPage - if a new page has been loaded add to history
     */
	function loadPage (link, newPage) {
		var $main = $('.main-content'),
			$nav = $('.main-nav');

		$.ajax({url: link})
			.done(function (resp) {
				// console.log(JSON.parse(resp))
				var $resp = $(resp),
					$content = $resp.find('.main-content'),
					$navigation = $resp.find('.main-nav'),
					title = $resp.filter('title').text();

				// console.log(resp)
				$main.replaceWith($content);
				$nav.replaceWith($navigation);
				
				// update page and history
				document.title = title;
				if (hasHistory && newPage) {
					history.pushState(null, title, link);
				}
			});
	}

    /**
     * Link click events
     * @private
     * @param {Event} e - DOM event
     */
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

    /**
     * Back/forward buttons
     * @private
     * @param {Event} e - DOM event
     */
	function pageChange (e) {
		e.preventDefault();
	    loadPage(document.location.href);
	}

	// add event handlers
	$(document).on('click', 'a', linkClick);
	$(window).bind('popstate', pageChange);


})();