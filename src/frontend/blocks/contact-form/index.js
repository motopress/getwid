(function ($) {
    $(document).ready(function (event) {

        const getwid_contact_forms = $('.wp-block-getwid-contact-form');

        getwid_contact_forms.each(function (index) {

            const className = '.wp-block-getwid-contact-form',
                $getwid_contact_form = $(this);

            const $submit = $getwid_contact_form.find('a.wp-block-button__link');
            $submit.replaceWith(
                `<button
                    class="${$submit.attr('class')}"
                    ${$submit.attr('style') ? ' ' + $submit.attr('style') : ''}>`
                    + $submit.text() +
                '</button>'
            );
            
            $getwid_contact_form.find('div.wp-block-button').before($getwid_contact_form.find(`${className}__response`));

            $getwid_contact_form.submit(function (event) {

                event.preventDefault();

                const getwid_name  = $getwid_contact_form.find('input[type=\'text\']' ).get(0).value,
                    getwid_from    = $getwid_contact_form.find('input[type=\'email\']').get(0).value,
                    getwid_message = $getwid_contact_form.find('textarea[rows=\'4\']' ).get(0).value,

                    getwid_to      = $getwid_contact_form.find(`${className}__to`     ).get(0).value,
                    getwid_subject = $getwid_contact_form.find(`${className}__subject`).get(0).value;

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

                    if (response.data) {
                        $getwid_response.html(
                            'Thank you for your message. It has been sent.'
                        );
                    } else {
                        $getwid_response.html(
                            'There was an error trying to send your message. Please try again later.'
                        );
                    }
                });
            });
        });
    });
})(jQuery);