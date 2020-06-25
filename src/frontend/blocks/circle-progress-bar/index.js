(function ($) {
	$(document).ready(function (event) {

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_circle_progress_bar();
		});

		var getwid_init_circle_progress_bar = () => {
			let getwid_progress_bars = $('.wp-block-getwid-circle-progress-bar:not(.getwid-init)');

			getwid_progress_bars.each(function (index) {

				let className = '.wp-block-getwid-circle-progress-bar',
					$getwid_progress_bar = $(this),

					getwid_background_color,
					getwid_text_color,

					getwid_fill_amount,
					getwid_is_animated,

					getwid_size,
					getwid_thickness,
					getwid_value;

				//Add init class
				$(this).addClass('getwid-init');

				getwid_background_color = !!$getwid_progress_bar.find(`${className}__wrapper`).data('background-color') ? $getwid_progress_bar.find(`${className}__wrapper`).data('background-color') : '#eeeeee';
				getwid_text_color 		= !!$getwid_progress_bar.find(`${className}__wrapper`).data('text-color') ? $getwid_progress_bar.find(`${className}__wrapper`).data('text-color') : '#0000ee';

				getwid_fill_amount = $getwid_progress_bar.find(`${className}__wrapper`).data('fill-amount');
				getwid_is_animated = $getwid_progress_bar.find(`${className}__wrapper`).data('is-animated');

				getwid_size 	 = $getwid_progress_bar.find(`${className}__wrapper`).data('size');
				getwid_thickness = $getwid_progress_bar.find(`${className}__wrapper`).data('thickness');
				getwid_value     = $getwid_progress_bar.find(`${className}__wrapper`).data('value');

				function setSize() {
					const canvas = $getwid_progress_bar.find((`${className}__canvas`)).get(0);

					canvas.width  = parseFloat(getwid_size);
					canvas.height = parseFloat(getwid_size);
				}

				function drawArcs(progress, value) {

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
					context.arc(radius, radius, radius - thickness / 2, angle, angle + Math.PI * 2 * (progress / 100));

					context.lineWidth = thickness;
					context.strokeStyle = getwid_text_color;
					context.stroke();

					context.beginPath();
					context.textAlign = 'center';
					context.font = '16px serif';
					context.fillText(value ? value : progress + '%', radius + 6.5, radius + 5);
					context.stroke();
				}

				function drawAnimatedArcs(value) {
					let progress = 0;
					let fill = setInterval(() => {
						drawArcs( progress, value );

						progress++;
						if (progress > getwid_fill_amount) {
							clearInterval(fill);
						}
					}, 35);
				}

				const $bar = $getwid_progress_bar.find($(`${className}__wrapper`));

				const waypoint = new Waypoint({
					element: $bar.get(0), handler: () => {
						if (getwid_is_animated) {
							drawAnimatedArcs( getwid_value );
						} else {
							drawArcs(getwid_fill_amount, getwid_value);
						}
						waypoint.destroy();
					},
					offset: '100%'
				});
			});

		};

		getwid_init_circle_progress_bar();
	});
})(jQuery);
