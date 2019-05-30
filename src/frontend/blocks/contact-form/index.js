/**
* Module Constants
*/
const ERROR_CODES = {
    ['missing-input-secret'  ] : 'The secret parameter is missing.',
    ['invalid-input-secret'  ] : 'The secret parameter is invalid or malformed.',
    ['missing-input-response'] : 'The response parameter is missing.',
    ['invalid-input-response'] : 'The response parameter is invalid or malformed.',
    ['bad-request'] : 'The request is invalid or malformed.',
    ['timeout-or-duplicate'] : 'The response is no longer valid: either is too old or has been used previously.'
};

(function ($) {
    $(document).ready((event) => {

        const $getwid_contact_forms = $('.wp-block-getwid-contact-form .contact-form');

        $getwid_contact_forms.each((index, form) => {
			
			const $result = $('.wp-block-getwid-contact-form__result');

            $(form).submit((event) => {

                $(form).find('button[type=\'submit\']').prop('disabled', true);

                const data = {
                    'action': 'getwid_contact_form_check_captcha',
                    'data': $(form).serialize()
                };

                $.post(Getwid.ajax_url, data, (response) => {
				   $(form).find('button').prop('disabled', false);
				   $result.html( response.data );
                });

				event.preventDefault();
            });
        });
    });
})(jQuery);