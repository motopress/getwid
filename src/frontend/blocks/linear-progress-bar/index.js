import 'waypoints/lib/noframework.waypoints.js';

(function ($) {
	$(document).ready(function (event) {

		let getwid_progress_bars = $('.wp-block-getwid-linear-progress-bar');

		getwid_progress_bars.each(function (index) {

			let className = '.wp-block-getwid-linear-progress-bar',
				$getwid_progress_bar = $(this),
				getwid_fill_amount,
				getwid_is_animated;

			getwid_fill_amount = !!$getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount') ? $getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount') : 0;
			getwid_is_animated = !!$getwid_progress_bar.find(`${className}__wrapper`).data('is-animated') ? $getwid_progress_bar.find(`${className}__wrapper`).data('is-animated') : false;
			
			function drawLinearBar() {
				if (getwid_is_animated) {
					let $progress = $getwid_progress_bar;

					let $content = $progress.find($(`${className}__content`));
					let $percent = $progress.find($(`${className}__percent`));

					const percent = () => { return Math.ceil(($content.width() / $content.parent().width()) * 100); }

					$content.animate({ width: `${getwid_fill_amount}%` }, {
						duration: 2000,
						progress: () => {
							$percent.text(percent() + '%');
						},
						complete: () => {
							$percent.text(`${getwid_fill_amount}%`);
						}
					});
				} else {
					$getwid_progress_bar.find($(`${className}__content`)).css('width', `${getwid_fill_amount}%`);
					$getwid_progress_bar.find($(`${className}__percent`)).text(`${getwid_fill_amount}%`);
				}
			}

			const $bar = $getwid_progress_bar.find($(`${className}__content`));

			const waypoint = new Waypoint({
				element: $bar.get(0), handler: () => {
					drawLinearBar();
					waypoint.destroy();
				},
				offset: '100%'
			});
		});
	});
})(jQuery);