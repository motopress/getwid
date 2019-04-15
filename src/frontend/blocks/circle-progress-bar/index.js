import 'waypoints/lib/noframework.waypoints.js';

(function ($) {
	$(document).ready(function (event) {

		let getwid_progress_bars = $('.wp-block-getwid-circle-progress-bar');

		getwid_progress_bars.each(function (index) {

			let className = '.wp-block-getwid-circle-progress-bar',
				$getwid_progress_bar = $(this),
				getwid_circle_color,
				getwid_fill_amount,
				getwid_is_animated;

			getwid_circle_color = !!$getwid_progress_bar.find(`${className}__wrapper`).data('circle-color') ? $getwid_progress_bar.find(`${className}__wrapper`).data('circle-color') : undefined;
			getwid_fill_amount = !!$getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount') ? $getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount') : 0;
			getwid_is_animated = !!$getwid_progress_bar.find(`${className}__wrapper`).data('is-animated') ? $getwid_progress_bar.find(`${className}__wrapper`).data('is-animated') : false;					

			function drawCircleBar() {
				const counter = $getwid_progress_bar.find(`${className}__counter`).get(0).getContext('2d');

				let no = getwid_is_animated ? 0 : getwid_fill_amount,
					pointToFill = 4.72,
					cw = counter.canvas.width,
					ch = counter.canvas.height,
					diff;

				function fillCounter(checkStop = null) {
					diff = ((no / 100) * Math.PI * 2 * 10);
					counter.clearRect(0, 0, cw, ch);
					counter.lineWidth = 6.1;
					counter.fillStyle = '#fff';
					counter.strokeStyle = getwid_circle_color ? getwid_circle_color : '#5cb0d8';
					counter.textAlign = 'center';
					counter.font = "25px monospace";
					counter.fillStyle = '#4a4949';
					counter.fillText(no + '%', 100, 110);
					counter.beginPath();
					counter.arc(100, 100, 92.6, pointToFill, diff / 10 + pointToFill);
					counter.stroke();

					if (checkStop) checkStop();
				}

				if (getwid_is_animated) {
					let fill = setInterval(fillCounter.bind(null, function () {
						if (no >= getwid_fill_amount) {
							clearTimeout(fill);
						}
						no++;
					}), 35);
				} else {
					fillCounter();
				}
			}

			const $bar = $getwid_progress_bar.find($(`${className}__content-wrapper`));

			const waypoint = new Waypoint({
				element: $bar.get(0), handler: () => {
					drawCircleBar();
					waypoint.destroy();
				},
				offset: '100%'
			});			
		});
	});
})(jQuery);