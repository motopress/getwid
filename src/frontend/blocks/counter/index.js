(function ($) {
	$(document).ready(function (event) {

		let getwid_counters = $('.wp-block-getwid-counter');

		getwid_counters.each(function (index) {

			let className = '.wp-block-getwid-counter',
				$getwid_counter = $(this),

				getwid_start,
				getwid_end,
				getwid_decimal_places,
				getwid_duration,
				getwid_use_easing,
				getwid_use_grouping,
				getwid_separator,
				getwid_decimal,
				getwid_easing_fn,
				getwid_numerals;

				getwid_start = !!$getwid_counter.find(`${className}__wrapper`).data('start') ? $getwid_counter.find(`${className}__wrapper`).data('start') : 0;
				getwid_end   = $getwid_counter.find(`${className}__wrapper`).data('end') !== undefined ? $getwid_counter.find(`${className}__wrapper`).data('end') : 100;

				getwid_decimal_places = !!$getwid_counter.find(`${className}__wrapper`).data('decimal-places') ? $getwid_counter.find(`${className}__wrapper`).data('decimal-places') : 0;
				getwid_duration 	  = !!$getwid_counter.find(`${className}__wrapper`).data('duration') ? $getwid_counter.find(`${className}__wrapper`).data('duration') : 5;

				getwid_use_easing   = $getwid_counter.find(`${className}__wrapper`).data('use-easing');
				getwid_use_grouping = $getwid_counter.find(`${className}__wrapper`).data('use-grouping');

				getwid_separator = !!$getwid_counter.find(`${className}__wrapper`).data('separator') ? $getwid_counter.find(`${className}__wrapper`).data('separator') : ',';
				getwid_decimal   = !!$getwid_counter.find(`${className}__wrapper`).data('decimal') ? $getwid_counter.find(`${className}__wrapper`).data('decimal') : '.';
				getwid_easing_fn = !!$getwid_counter.find(`${className}__wrapper`).data('easing-fn') ? $getwid_counter.find(`${className}__wrapper`).data('easing-fn') : 'outExpo';
				getwid_numerals  = !!$getwid_counter.find(`${className}__wrapper`).data('numerals') ? $getwid_counter.find(`${className}__wrapper`).data('numerals') : null;
			
			function getEasingFunction() {
				if (getwid_use_easing) {
					switch (getwid_easing_fn) {
						case 'outExpo':
							return function(t, b, c, d) {
								return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
							};
						case 'outQuintic':
							return function (t, b, c, d) {
								let ts = (t /= d) * t;
								let tc = ts * t;
								return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
							}
						case 'outCubic':
							return function(t, b, c, d) {
								let ts = (t /= d) * t;
								let tc = ts * t;
								return b + c * (tc + -3 * ts + 3 * t);
							}
					}
				} else {
					return null;
				}
			}

			function getNumerals() {
				switch (getwid_numerals) {
					case 'eastern_arabic':
						return ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
					case 'farsi':
						return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
					default:
						return null;
				}
			}

			function initCounter() {
				const options = {
					startVal: 	   getwid_start,
					decimalPlaces: getwid_decimal_places,
					duration: 	   getwid_duration,
		
					useEasing:   getwid_use_easing,
					useGrouping: getwid_use_grouping,
					separator:   getwid_separator,
					decimal:     getwid_decimal,
		
					easingFn: getEasingFunction(),
					numerals: getNumerals()
				}
				return options;
			}

			const $counter = $getwid_counter.find(`${className}__number`);

			const waypoint = new Waypoint({
				element: $counter.get(0), handler: () => {
					new CountUp($counter.get(0), getwid_end, initCounter()).start();
					waypoint.destroy();
				},
				offset: '100%',
			});			
		});
	});
})(jQuery);