(function($){
	$(document).ready(function(e){
        var getwid_countdown = $('.wp-block-getwid-countdown');
         
        getwid_countdown.each(function(index, countdown){

			var backgroundColor = jQuery(countdown).data('bg-color');

			var dataWrapper = jQuery(countdown).find('.wp-block-getwid-countdown__wrapper')

			var {
				dateTime,
				year,
				months,
				weeks,
				days,
				hours,
				minutes,
				seconds,
			} = dataWrapper.data('countdown-option');

			var default_date = new Date(Getwid.settings.date_time_utc);
			default_date.setDate(default_date.getDate() + 1);
	
			var dateTo = dateTime != '' ? (dateTime == 'negative' ? '' : dateTime) : default_date;
			var dateFormat = '';
	
			if (year){
				dateFormat +='Y';
			}
			if (months){
				dateFormat +='O';
			}
			if (weeks){
				dateFormat +='W';
			}
			if (days){
				dateFormat +='D';
			}			
			if (hours){
				dateFormat +='H';
			}
			if (minutes){
				dateFormat +='M';
			}
			if (seconds){
				dateFormat +='S';
			}				

			dataWrapper.countdown({
				until: dateTo,
				format: dateFormat,
				onTick: (e) =>{
					var section = jQuery('.countdown-section', dataWrapper);
					if (backgroundColor){
						section.css('background-color', backgroundColor);
					}
				}				
			});

        });

	});
})(jQuery);