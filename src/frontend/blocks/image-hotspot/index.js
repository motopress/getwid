/*!
 * getwid-image-hotspot
 */

import getwid_animate from 'GetwidUtils/animate';

(function ($) {
	$(document).ready(function (e) {

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_image_hotspot();
		});

		var getwid_init_image_hotspot = () => {
			var getwid_image_hotspot = $('.wp-block-getwid-image-hotspot:not(.getwid-init)');

			getwid_image_hotspot.each(function (index, image_hotspot) {

				//Add init class
				$(this).addClass('getwid-init');

				let tooltipTrigger = $(image_hotspot).data('trigger'),
					tooltipTheme = $(image_hotspot).data('theme'),
					tooltipAnimation = $(image_hotspot).data('tooltip-animation'),
					tooltipArrow = $(image_hotspot).data('arrow'),
					imagePoints = $(image_hotspot).data('image-points');

				$('.getwid-animation .wp-block-getwid-image-hotspot__dot').on( 'mouseenter', function () {
					getwid_animate($(this), {
						animation: $(this).closest('.getwid-animation').attr('data-animation')
					});
				});

				$(image_hotspot).find('.wp-block-getwid-image-hotspot__dot').each(function (index, dot) {
					let el = $(dot),
						point_id = el.data('point-id'),
						title = _unescape( el.find('.wp-block-getwid-image-hotspot__dot-title').html() ),
						content = _unescape(imagePoints[point_id].content),
						open = imagePoints[point_id].popUpOpen,
						placement = imagePoints[point_id].placement,
						width = imagePoints[point_id].popUpWidth;

					let tooltip = tippy(dot, {
						maxWidth: parseInt(width, 10),
						hideOnClick: (tooltipTrigger == 'multiple') ? 'toggle' : true,
						theme: tooltipTheme,
						animation: tooltipAnimation,
						animateFill: false,
						interactive: true,
						trigger: (tooltipTrigger == 'hover') ? 'mouseenter' : 'click',
						arrow: tooltipArrow,
						placement: placement,
						allowHTML: true,
						content: `<div class="wp-block-getwid-image-hotspot__tooltip"><div class="wp-block-getwid-image-hotspot__tooltip-title">${title}</div><div class="wp-block-getwid-image-hotspot__tooltip-content">${content}</div></div>`,
					});

					if (open) {
						setTimeout(function () {
							tooltip.show();
						}, 1000);
					}

					el.find('.wp-block-getwid-image-hotspot__dot-description').remove();

					new Waypoint({
						element: dot,
						handler: function(direction) {
							$( this.element ).addClass('is-visible');
						},
						offset: '100%'
					});

				});

			});
		};

		getwid_init_image_hotspot();

	});
})(jQuery);
