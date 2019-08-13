(function($){
	$(document).ready(function(e){
        var getwid_countdown = $('.wp-block-getwid-countdown');
         
        getwid_countdown.each(function(index, countdown){

			var dataWrapper = jQuery(countdown).find('.wp-block-getwid-countdown__wrapper')

			var time = jQuery(dataWrapper).data('time');

			var year = jQuery(dataWrapper).data('year');
			var months = jQuery(dataWrapper).data('months');
			var weeks = jQuery(dataWrapper).data('weeks');
			var days = jQuery(dataWrapper).data('days');
			var hours = jQuery(dataWrapper).data('hours');
			var minutes = jQuery(dataWrapper).data('minutes');
			var seconds = jQuery(dataWrapper).data('seconds');

			var default_date = new Date();
			default_date.setDate(default_date.getDate() + 1);

			var dateTo = dateTime ? new Date(dateTime) : default_date;
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
				format: dateFormat
			});

        });

	});
})(jQuery);