import 'waypoints/lib/noframework.waypoints.js';

(function ($) {
	$(document).ready(function (event) {

		let getwid_progress_bars = $('.wp-block-getwid-progress-bar');

		getwid_progress_bars.each(function (index) {

			let className = '.wp-block-getwid-progress-bar',
				$getwid_progress_bar = $(this),
				getwid_fill_amount,
				getwid_is_animated;

			getwid_fill_amount = !!$getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount') ? $getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount') : 0;
			getwid_is_animated = !!$getwid_progress_bar.find(`${className}__wrapper`).data('is-animated') ? $getwid_progress_bar.find(`${className}__wrapper`).data('is-animated') : false;

			function animate() {

				let $progress = $getwid_progress_bar;
				let $content = $(`${className}__content`, $progress);
				let $percent = $(`${className}__percent`, $progress);

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
			}

			const $bar = $($getwid_progress_bar, `${className}__content`);
			if (getwid_is_animated) {
				new Waypoint({ element: $bar.get(0), handler: () => { animate($bar); }, offset: '100%' });
			} else {
				$(`${className}__content`, $getwid_progress_bar).css('width', `${getwid_fill_amount}%`);
				$(`${className}__percent`, $getwid_progress_bar).text(`${getwid_fill_amount}%`);
			}
		});
	});
})(jQuery);