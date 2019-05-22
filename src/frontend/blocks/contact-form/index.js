import { __ } from 'wp.i18n';
import { addScript } from 'GetwidUtils/help-functions';

(function ($) {
    $(document).ready(function (event) {

        const getwid_contact_forms = $('.wp-block-getwid-contact-form');

        getwid_contact_forms.each(function (index) {

            $(this).attr('disabled')

            const className = '.wp-block-getwid-contact-form',
                $getwid_contact_form = $(this),
                $response_message = $getwid_contact_form.find(`${className}__response`);

            const getwid_name_is_required = $getwid_contact_form.find(`${className}-name`).data('name-is-required' ),
                getwid_email_is_required  = $getwid_contact_form.find(`${className}-email`).data('email-is-required'),
                getwid_use_captcha        = $getwid_contact_form.data('use-captcha');

            $getwid_contact_form.find('input[name=\'name\']' ).attr('required', $.parseJSON(getwid_name_is_required ));
            $getwid_contact_form.find('input[name=\'email\']').attr('required', $.parseJSON(getwid_email_is_required));

            let captchaId;
            if (getwid_contact_forms.length && $.parseJSON(getwid_use_captcha)) {
                addScript('https://www.google.com/recaptcha/api.js?render=explicit&hl=en', () => {

                    grecaptcha.ready(function() {
                        const $captcha = $getwid_contact_form.find(`${className}__captcha`);
                        captchaId = grecaptcha.render($captcha.get(0), {
                            'sitekey': Getwid.settings.recaptcha_site_key,
                            'theme': 'dark'
                        });
                    });
                });
            }

            $getwid_contact_form.submit(function (event) {

                event.preventDefault();

                $(this).find('button[type=\'submit\']').prop('disabled', true);

                const getwid_name  = $getwid_contact_form.find('input[name=\'name\']'      ).get(0).value,
                    getwid_from    = $getwid_contact_form.find('input[name=\'email\']'     ).get(0).value,
                    getwid_message = $getwid_contact_form.find('textarea[name=\'message\']').get(0).value,

                    getwid_to      = $getwid_contact_form.find('input[name=\'to\']'     ).get(0).value,
                    getwid_subject = $getwid_contact_form.find('input[name=\'subject\']').get(0).value;

                function sendMailRequest() {

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
                        $getwid_contact_form.find('button').prop('disabled', false);

                        $response_message
                            .parent()
                            .addClass('has-text-message');

                        if (response.data) {
                            $getwid_contact_form.find('form').get(0).reset();

                            if ($.parseJSON(getwid_use_captcha)) {
                                grecaptcha.reset(captchaId);
                            }
                            
                            $response_message.html(
                                __('Thank you for your message. It has been sent.', 'getwid')
                            );
                        } else {
                            $response_message.html(
                                __('There was an error trying to send your message. Please try again later.', 'getwid')
                            );
                        }
                    });
                }

                function verifyKeyRequest() {

                    const data = {
                        'action': 'getwid_verify_key',
                        'data': {
                            'secret_key': Getwid.settings.recaptcha_secret_key,
                            'response'  : $getwid_contact_form.find('#g-recaptcha-response').get(0).value
                        }
                    };

                    $.post(Getwid.ajax_url, data, function (response) {
                        if (JSON.parse(response.data).success) {
                            sendMailRequest();
                        } else {

                            $response_message
                                .parent()
                                .addClass('has-text-message');

                            $response_message.html(
                                __(`${JSON.parse(response.data)['error-codes']}`, 'getwid')
                            );
                        }
                    });
                }

                $.parseJSON(getwid_use_captcha) ? verifyKeyRequest() : sendMailRequest();
            });
        });
    });
})(jQuery);