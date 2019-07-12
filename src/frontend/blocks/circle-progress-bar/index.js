(function ($) {
	$(document).ready(function (event) {

		let getwid_progress_bars = $('.wp-block-getwid-circle-progress-bar');

		getwid_progress_bars.each(function (index) {

			let className = '.wp-block-getwid-circle-progress-bar',
				$getwid_progress_bar = $(this),

				getwid_background_color,
				getwid_text_color,

				getwid_fill_amount,
				getwid_is_animated,

				getwid_size,
				getwid_thickness;

			getwid_background_color = !!$getwid_progress_bar.find(`${className}__wrapper`).data('background-color') ? $getwid_progress_bar.find(`${className}__wrapper`).data('background-color') : '#eeeeee';
			getwid_text_color 		= !!$getwid_progress_bar.find(`${className}__wrapper`).data('text-color') ? $getwid_progress_bar.find(`${className}__wrapper`).data('text-color') : '#0000ee';			

			getwid_fill_amount = $getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount');
			getwid_is_animated = $getwid_progress_bar.find(`${className}__wrapper`).data('is-animated');

			getwid_size 	 = $getwid_progress_bar.find(`${className}__wrapper`).data('size');
			getwid_thickness = $getwid_progress_bar.find(`${className}__wrapper`).data('thickness');

			function setSize() {
				const canvas = $getwid_progress_bar.find((`${className}__canvas`)).get(0);

				canvas.width  = parseFloat(getwid_size);
				canvas.height = parseFloat(getwid_size);
			}

			function drawArcs(value) {

				let context   = $getwid_progress_bar.find((`${className}__canvas`)).get(0).getContext('2d'),
					thickness = getwid_thickness === 'auto' ? getwid_size / 14 : getwid_thickness,
					radius    = getwid_size / 2,
					angle     = -90 * (Math.PI / 180);
		
				setSize();
				context.clearRect(0, 0, getwid_size, getwid_size);

				context.beginPath();
				context.arc(radius, radius, radius - thickness / 2, angle, angle + Math.PI * 2);
				context.lineWidth = thickness;
				context.strokeStyle = getwid_background_color;
				context.stroke();

				context.beginPath();
				context.arc(radius, radius, radius - thickness / 2, angle, angle + Math.PI * 2 * (value / 100));

				context.lineWidth = thickness;
				context.strokeStyle = getwid_text_color;
				context.stroke();

				context.beginPath();
				context.textAlign = 'center';
				context.font = '16px serif';
				context.fillText(value + '%', radius + 6.5, radius + 5);
				context.stroke();
			}
		
			function drawAnimatedArcs() {
				let value = 0;
				let fill = setInterval(() => {
					drawArcs(value);
		
					value++;
					if (value > getwid_fill_amount) {
						clearInterval(fill);
					}
				}, 35);
			}

			const $bar = $getwid_progress_bar.find($(`${className}__wrapper`));

			const waypoint = new Waypoint({
				element: $bar.get(0), handler: () => {
					if (getwid_is_animated) {
						drawAnimatedArcs();
					} else {
						drawArcs(getwid_fill_amount);
					}
					waypoint.destroy();
				},
				offset: '100%'
			});			
		});
	});
})(jQuery);