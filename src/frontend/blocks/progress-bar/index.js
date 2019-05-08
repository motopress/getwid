(function ($) {
	$(document).ready(function (event) {

		let getwid_progress_bars = $('.wp-block-getwid-progress-bar');

		getwid_progress_bars.each(function (index) {

			let className = '.wp-block-getwid-progress-bar',
				$getwid_progress_bar = $(this),
				getwid_fill_amount,
				getwid_is_animated,

				getwid_background_color,
				getwid_text_color;

			getwid_fill_amount = $getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount');
			getwid_is_animated = $getwid_progress_bar.find(`${className}__wrapper`).data('is-animated');

			getwid_background_color = !!$getwid_progress_bar.find(`${className}__wrapper`).data('background-color') ? $getwid_progress_bar.find(`${className}__wrapper`).data('background-color') : '#eeeeee';
			getwid_text_color 		= !!$getwid_progress_bar.find(`${className}__wrapper`).data('text-color') ? $getwid_progress_bar.find(`${className}__wrapper`).data('text-color') : '#0000ee';
		
			function setSize() {		
				const canvas = $getwid_progress_bar.find(`${className}__canvas`).get(0);
				const width  = $getwid_progress_bar.find(`${className}__wrapper`).css('width');
		
				canvas.width = parseFloat(width.replace(/px$/, ''));
				canvas.height = 10;
		
				return canvas.width;
			}

			function drawLines(value) {

				const context = $getwid_progress_bar.find(`${className}__canvas`).get(0).getContext('2d');
		
				let width = setSize();
				context.clearRect(0, 0, width, 10);
		
				context.beginPath();
		
				context.moveTo(0, 10);
				context.lineTo(width, 10);
		
				context.lineWidth = 10;
				context.strokeStyle = getwid_background_color;
				context.stroke();
		
				context.beginPath();
		
				context.moveTo(0, 10);
				context.lineTo((width * value) / 100, 10);
		
				context.lineWidth = 10;
				context.strokeStyle = getwid_text_color;
				context.stroke();
		
				$getwid_progress_bar.find(`${className}__percent`).html(`${value}%`);
			}

			function drawAnimatedLines() {
				let value = 0;
				let fill = setInterval(() => {
					drawLines(value);
		
					value++;
					if (value > getwid_fill_amount) {
						clearInterval(fill);
					}
				}, 35);
			}

			const $bar = $getwid_progress_bar.find($(`${className}__line-wrapper`));

			const waypoint = new Waypoint({
				element: $bar.get(0), handler: () => {					
					if (getwid_is_animated) {
						drawAnimatedLines();
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