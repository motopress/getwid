(function ($) {
    $(document).ready(function (event) {

        const getwid_contact_forms = $('.wp-block-getwid-contact-form');

        getwid_contact_forms.each(function (index) {

            const className = '.wp-block-getwid-contact-form',
                $getwid_contact_form = $(this);

            $getwid_contact_form.submit(function(event) {

                event.preventDefault();

                const getwid_name      = $getwid_contact_form.find(`${className}__name`   ).get(0).value,
                      getwid_own_email = $getwid_contact_form.find(`${className}__email`  ).get(0).value,
                      getwid_message   = $getwid_contact_form.find(`${className}__message`).get(0).value,

                      getwid_admin_email   = $getwid_contact_form.find(`${className}__admin-email`  ).get(0).value,
                      getwid_admin_subject = $getwid_contact_form.find(`${className}__admin-subject`).get(0).value;

                if (/\S+@\S+\.\S+/.test(getwid_own_email)) {
                    const data = {
                        'action': 'getwid_contact_form_send_mail',
                        'data': {
                            'to'     : getwid_admin_email,
                            'subject': getwid_admin_subject,
        
                            'name'    : getwid_name,
                            'from'    : getwid_own_email,
                            'message' : getwid_message
                        }
                    };
    
                    $.post(Getwid.ajax_url, data, function(response) {
                        if (response.data != '') {
                            console.log('Response data is true');
                        }
                    });
                }            
                return false;
            });
        });
    });
})(jQuery);