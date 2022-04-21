/*!
 * getwid-images-slider
 */

(function ($) {
	$(document).ready(function (e) {

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_sliders();
		});

		const getwid_init_sliders = () => {
			const sliders = $('.wp-block-getwid-content-slider:not(.getwid-init)');

			if (!sliders.length) return;

			sliders.each(function (index) {

				const sliderRoot = $(this),
					slider = sliderRoot.find('.wp-block-getwid-content-slider__wrapper');

				//Add init class
				sliderRoot.addClass('getwid-init');

				slider.slick({
					autoplay: !!sliderRoot.data('autoplay'),
					autoplaySpeed: sliderRoot.data('autoplay-speed') ?? 3000,
					arrows: sliderRoot.data('arrows') !== 'none',
					dots: sliderRoot.data('dots') !== 'none',
					speed: sliderRoot.data('animation-speed') ?? 800,
					infinite: !!sliderRoot.data('infinite'),
					fade: sliderRoot.data('effect') === 'fade',
					centerMode: !!sliderRoot.data('center-mode'),
					pauseOnHover: !!sliderRoot.data('pause-hover'),
					rows: 0,
					slidesToShow: sliderRoot.data('slides-show') ?? 1,
					slidesToScroll: sliderRoot.data('slides-scroll') ?? 1,

					responsive: [
						{
							breakpoint: 991,
							settings: {
								slidesToShow: sliderRoot.data('slides-show-laptop') ?? 1,
								slidesToScroll: sliderRoot.data('slides-scroll-laptop') ?? 1
							}
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: sliderRoot.data('slides-show-tablet') ?? 1,
								slidesToScroll: sliderRoot.data('slides-scroll-tablet') ?? 1
							}
						},
						{
							breakpoint: 468,
							settings: {
								slidesToShow: sliderRoot.data('slides-show-mobile') ?? 1,
								slidesToScroll: sliderRoot.data('slides-scroll-mobile') ?? 1
							}
						}
					]

				});

			});
		};

		getwid_init_sliders();
	});
})(jQuery);
