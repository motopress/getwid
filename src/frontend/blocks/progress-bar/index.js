(function ($) {
	$(document).ready(function (event) {

		let getwid_progress_bars = $('.wp-block-getwid-progress-bar');

		getwid_progress_bars.each(function (index) {

			let className = '.wp-block-getwid-progress-bar',
				$getwid_progress_bar = $(this),
				getwid_fill_amount,
				getwid_is_animated;

			getwid_fill_amount = $getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount');
			getwid_is_animated = $getwid_progress_bar.find(`${className}__wrapper`).data('is-animated');

			function drawLines(value) {
				$getwid_progress_bar.find($(`${className}__progress`)).css('width', `${value}%`);
				$getwid_progress_bar.find($(`${className}__percent`)).text(`${value}%`);
			}

			function drawAnimatedLines(value) {
				let $content = $getwid_progress_bar.find($(`${className}__progress`));
		
				const percent = () => { return Math.round(($content.width() / $content.parent().width()) * 100); }
		
				$content.animate({ width: `${value}%` }, {
					duration: 2000,
					progress: () => {
						let $percent =  $getwid_progress_bar.find($(`${className}__percent`));
						$percent.text(percent() + '%');
					},
				});
			}

			const $bar = $getwid_progress_bar.find($(`${className}__wrapper`));

			const waypoint = new Waypoint({
				element: $bar.get(0), handler: () => {					
					if (getwid_is_animated) {
						drawAnimatedLines(getwid_fill_amount);
					} else {
						drawLines(getwid_fill_amount);
					}
					waypoint.destroy();
				},
				offset: '100%'
			});

			$(window).resize(function() { drawLines(getwid_fill_amount); });
		});
	});
})(jQuery);