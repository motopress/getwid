/**
* Module Constants
*/
(function ($) {
    $(document).ready((event) => {

        const $getwid_contact_forms = $('.wp-block-getwid-contact-form .contact-form');

        $getwid_contact_forms.each((index, form) => {
			
			const $result = $('.wp-block-getwid-contact-form__result');

            $(form).submit((event) => {

                $(form).find('button[type=\'submit\']').prop('disabled', true);
				var formData = $(form).serialize();

                const data = {
                    'action': 'getwid_contact_form_send',
					'security': '',
                    'data': formData
                };

                $.post(Getwid.ajax_url, data, (response) => {
				   $(form).find('button').prop('disabled', false);
				   
				   $result.html( response.data );
				   //todo success / fail
                });

				event.preventDefault();
            });
        });
    });
})(jQuery);