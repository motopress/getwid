(function ($) {
    $(document).ready((event) => {

        const $getwid_contact_forms = $('.wp-block-getwid-contact-form .contact-form');

        $getwid_contact_forms.each((index, form) => {		
            
            const $result  = $(form).find('p[class$=__result]'     );
            const $submit  = $(form).find('button[type=\'submit\']');

            $result.hide();

            $(form).submit((event) => {
                event.preventDefault();

                $submit.prop('disabled', true);
                            
                const data = {
                    'action': 'getwid_contact_form_send',
					'security': Getwid.nonces.recaptcha_v2_api_key,
                    'data': $(form).serialize()
                };

                if ($result.text() != '') {
                    $result.hide(300);
                }
                
                $.post(Getwid.ajax_url, data, (response) => {
                    $submit.prop('disabled', false);

                    if (response.data.success) {
                        $(form).get(0).reset();
                    } 

                    $result.html(response.data.text);
                    $result.show(300);
                });
            });
        });
    });
})(jQuery);