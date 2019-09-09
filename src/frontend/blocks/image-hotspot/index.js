import animate from 'GetwidUtils/animate';
import {escape, unescape} from 'lodash';

(function ($) {
	$(document).ready(function (e) {
		var getwid_image_hotspot = $('.wp-block-getwid-image-hotspot');

		getwid_image_hotspot.each(function (index, image_hotspot) {

			var tooltipTrigger = jQuery(image_hotspot).data('trigger');
			var tooltipTheme = jQuery(image_hotspot).data('theme');
			var tooltipAnimation = jQuery(image_hotspot).data('tooltip-animation');
			var tooltipArrow = jQuery(image_hotspot).data('arrow');
			var imagePoints = jQuery(image_hotspot).data('image-points');

			$('.getwid-animation .wp-block-getwid-image-hotspot__dot').mouseenter(function () {
				animate($(this), {
					animation: $(this).closest('.getwid-animation').attr('data-animation')
				});
			});

			jQuery(image_hotspot).find('.wp-block-getwid-image-hotspot__dot').each(function (index, dot) {
				var el = jQuery(dot);
				var point_id = el.data('point-id');
				var title = el.find('.wp-block-getwid-image-hotspot__dot-title').html();
				var content = unescape(imagePoints[point_id].content);
				var open = imagePoints[point_id].popUpOpen;
				var placement = imagePoints[point_id].placement;
				var width = imagePoints[point_id].popUpWidth;

				var style = '';
				if (width != '' && width != 'undefined') {
					style += 'min-width: ' + width + 'px;';
				}

				var tooltip = tippy(dot, {
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
