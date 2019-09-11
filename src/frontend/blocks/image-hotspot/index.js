import animate from 'GetwidUtils/animate';
import {unescape} from 'lodash';

(function ($) {
	$(document).ready(function (e) {
		var getwid_image_hotspot = $('.wp-block-getwid-image-hotspot');

		getwid_image_hotspot.each(function (index, image_hotspot) {

			let tooltipTrigger = $(image_hotspot).data('trigger'),
				tooltipTheme = $(image_hotspot).data('theme'),
				tooltipAnimation = $(image_hotspot).data('tooltip-animation'),
				tooltipArrow = $(image_hotspot).data('arrow'),
				imagePoints = $(image_hotspot).data('image-points');

			$('.getwid-animation .wp-block-getwid-image-hotspot__dot').mouseenter(function () {
				animate($(this), {
					animation: $(this).closest('.getwid-animation').attr('data-animation')
				});
			});

			$(image_hotspot).find('.wp-block-getwid-image-hotspot__dot').each(function (index, dot) {
				let el = $(dot),
					point_id = el.data('point-id'),
					title = el.find('.wp-block-getwid-image-hotspot__dot-title').html(),
					content = unescape(imagePoints[point_id].content),
					open = imagePoints[point_id].popUpOpen,
					placement = imagePoints[point_id].placement,
					width = imagePoints[point_id].popUpWidth;

				let style = '';
				if (width != '' && width != 'undefined') {
					// style += 'min-width: ' + width + 'px;';
				}

				let tooltip = tippy(dot, {
					maxWidth: width,
					hideOnClick: 'toggle',
					// hideOnClick: (tooltipTrigger == 'multiple') ? 'toggle' : true,
					theme: tooltipTheme,
					animation: tooltipAnimation,
					animateFill: false,
					interactive: true,
					trigger: (tooltipTrigger == 'hover') ? 'mouseenter' : 'click',
					arrow: tooltipArrow,
					placement: placement,
					content: `<div` + (style != '' ? ' style="' + style + '"' : '') + ` class="wp-block-getwid-image-hotspot__tooltip"><div class="wp-block-getwid-image-hotspot__tooltip-title">${title}</div><div class="wp-block-getwid-image-hotspot__tooltip-content">${content}</div></div>`,
				});

				if (open) {
					setTimeout(function () {
						tooltip.show();
					}, 1000);
				}

				el.find('.wp-block-getwid-image-hotspot__dot-description').remove();
			});

		});

	});
})(jQuery);
