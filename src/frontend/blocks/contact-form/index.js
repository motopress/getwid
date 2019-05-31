(function ($) {
    $(document).ready((event) => {

        const $getwid_contact_forms = $('.wp-block-getwid-contact-form .contact-form');

        $getwid_contact_forms.each((index, form) => {		
            
            const $result  = $(form).find('p[class$=__result]'     );
            const $submit  = $(form).find('button[type=\'submit\']');

            $(form).submit((event) => {
                event.preventDefault();

                $submit.prop('disabled', true);
                            
                const data = {
                    'action': 'getwid_contact_form_send',
					'security': Getwid.nonces.recaptcha_v2_api_key,
                    'data': $(form).serialize()
                };

                $.post(Getwid.ajax_url, data, (response) => {
                    $submit.prop('disabled', false);

                    $result.html('');
                    if (response.data.success) {
                        $(form).get(0).reset();

                        setTimeout(() => {
                            $result.html(response.data.text);
                        }, 35);

                    } else {
                        setTimeout(() => {
                            $result.html(response.data.text);
                        }, 35);
                    }
                });
            });
        });
    });
})(jQuery);