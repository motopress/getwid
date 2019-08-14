import animate from 'GetwidUtils/animate';

(function($){
	$(document).ready(function(e){
        var getwid_image_hotspot = $('.wp-block-getwid-image-hotspot');
         
        getwid_image_hotspot.each(function(index, image_hotspot){

			var tooltipTrigger = jQuery(image_hotspot).data('trigger');
			var tooltipTheme = jQuery(image_hotspot).data('theme');
			var tooltipAnimation = jQuery(image_hotspot).data('tooltip-animation');
			var tooltipArrow = jQuery(image_hotspot).data('arrow');

			$('.getwid-animation .wp-block-getwid-image-hotspot__dot').mouseenter(function(){
				animate($(this), {
					animation: $(this).closest('.getwid-animation').attr('data-animation')
				});
			});

			jQuery(image_hotspot).find('.wp-block-getwid-image-hotspot__dot').each(function(index, dot){
				var el = jQuery(dot);
				var title = el.find('.hotspot_title').html();
				var content = el.find('.hotspot_content').html();
				var open = el.data('init-open');
				var placement = el.data('placement');
				var min_width = el.data('min-width');
				var max_width = el.data('max-width');
				var style = '';
				if (min_width !='' && min_width !='undefined') {
					style += 'min-width: ' + min_width + 'px;';
				}
				if (max_width !='' && max_width !='undefined') {
					style += 'max-width: ' + max_width + 'px;';
				}
	
				var tooltip = tippy(dot, {
					hideOnClick: false,
					// hideOnClick: (tooltipTrigger == 'multiple') ? 'toggle' : true,
					theme: tooltipTheme,
					animation: tooltipAnimation,
					animateFill: false,
					interactive: true,
					trigger: (tooltipTrigger == 'hover') ? 'mouseenter' : 'click',
					arrow: tooltipArrow,
					placement: placement,
					content: `<div`+ (style !='' ? ' style="'+style+'"' : '') +` class="wp-block-getwid-image-hotspot__tooltip"><div class="tooltip_title">${title}</div><div class="tooltip_content">${content}</div></div>`,
				});
				
				if (open){
					setTimeout(function(){tooltip.show(); }, 1000);
				}
			});


			
        });

	});
})(jQuery);