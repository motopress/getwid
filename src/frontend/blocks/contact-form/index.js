(function ($) {
    $(document).ready(function (event) {

        const getwid_contact_forms = $('.wp-block-getwid-contact-form');

        getwid_contact_forms.each(function (index) {

            const className = '.wp-block-getwid-contact-form',
                $getwid_contact_form = $(this);

            $getwid_contact_form.submit(function(event) {

                event.preventDefault();

                const getwid_name    = $getwid_contact_form.find(`${className}__name`   ).get(0).value,
                      getwid_from    = $getwid_contact_form.find(`${className}__from`   ).get(0).value,
                      getwid_message = $getwid_contact_form.find(`${className}__message`).get(0).value,

                      getwid_to      = $getwid_contact_form.find(`${className}__to`     ).get(0).value,
                      getwid_subject = $getwid_contact_form.find(`${className}__subject`).get(0).value;

                if (/\S+@\S+\.\S+/.test(getwid_from)) {
                    const data = {
                        'action': 'getwid_contact_form_send_mail',
                        'data': {
                            'to'     : getwid_to,
                            'subject': getwid_subject,
        
                            'name'    : getwid_name,
                            'from'    : getwid_from,
                            'message' : getwid_message
                        }
                    };
    
                    $.post(Getwid.ajax_url, data, function(response) {
                        if (response.data != '') {
                            $getwid_contact_form.find(`${className}__response`).html(
                                'Thank you for your message. It has been sent.'
                            );
                        } else {
                            $getwid_contact_form.find(`${className}__response`).html(
                                'There was an error trying to send your message. Please try again later.'
                            );
                        }
                    });
                }
                return false;
            });
        });
    });
})(jQuery);