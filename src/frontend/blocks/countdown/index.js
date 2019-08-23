(function($){
	$(document).ready(function(e){
        var getwid_countdown = $('.wp-block-getwid-countdown');
         
        getwid_countdown.each(function(index, countdown){

			var dataWrapper = jQuery(countdown).find('.wp-block-getwid-countdown__wrapper')

			var dateTime = dataWrapper.data('datetime');
			var years = dataWrapper.data('years');
			var months = dataWrapper.data('months');
			var weeks = dataWrapper.data('weeks');
			var days = dataWrapper.data('days');
			var hours = dataWrapper.data('hours');
			var minutes = dataWrapper.data('minutes');
			var seconds = dataWrapper.data('seconds');

			var backgroundColor = dataWrapper.data('bg-color');

			var default_date = new Date(Getwid.settings.date_time_utc);
			default_date.setDate(default_date.getDate() + 1);
	
			var dateTo = dateTime != '' ? (dateTime == 'negative' ? '' : dateTime) : default_date;
			var dateFormat = '';
	
			if (years){
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