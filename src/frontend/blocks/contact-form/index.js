import { __ } from 'wp.i18n';

(function ($) {
    $(document).ready(function (event) {

        const getwid_contact_forms = $('.wp-block-getwid-contact-form');

        getwid_contact_forms.each(function (index) {

            const className = '.wp-block-getwid-contact-form',
                $getwid_contact_form = $(this);            

            $getwid_contact_form.submit(function (event) {

                event.preventDefault();

                $(this).find('button[type=\'submit\']').prop('disabled', true);

                const getwid_name  = $getwid_contact_form.find('input[name=\'name\']'      ).get(0).value,
                    getwid_from    = $getwid_contact_form.find('input[name=\'email\']'     ).get(0).value,
                    getwid_message = $getwid_contact_form.find('textarea[name=\'message\']').get(0).value,

                    getwid_to      = $getwid_contact_form.find('input[name=\'to\']'     ).get(0).value,
                    getwid_subject = $getwid_contact_form.find('input[name=\'subject\']').get(0).value;

                const data = {
                    'action': 'getwid_contact_form_send_mail',
                    'data': {
                        'to'     : getwid_to,
                        'subject': getwid_subject,

                        'name'   : getwid_name,
                        'from'   : getwid_from,
                        'message': getwid_message
                    }
                };

                $.post(Getwid.ajax_url, data, function (response) {
                    const $getwid_response = $getwid_contact_form.find(`${className}__response`);

                    $getwid_contact_form.find('button').prop('disabled', false);

                    if (response.data) {
                        $(`${className}`).get(0).reset();
                        $getwid_response.html(
                            __('Thank you for your message. It has been sent.', 'getwid')
                        );
                    } else {
                        $getwid_response.html(
                            __('There was an error trying to send your message. Please try again later.', 'getwid')
                        );
                    }
                });
            });
        });
    });
})(jQuery);