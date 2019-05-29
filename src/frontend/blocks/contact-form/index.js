import { __ } from 'wp.i18n';
import { addScript } from 'GetwidUtils/help-functions';

(function ($) {
    $(document).ready(function (event) {

        const getwid_contact_forms = $('.wp-block-getwid-contact-form');

        getwid_contact_forms.each(function (index) {

            const className = '.wp-block-getwid-contact-form',
                $getwid_contact_form = $(this),
                $result = $getwid_contact_form.find(`${className}__result`);

            const getwid_use_captcha = $getwid_contact_form.data('use-captcha');

            let captchaId;
            if ( getwid_contact_forms.length && $.parseJSON(getwid_use_captcha ) ) {
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

                const getwid_name  = $getwid_contact_form.find( 'input[id=\'name-input\']'          ).get(0).value,
                    getwid_from    = $getwid_contact_form.find( 'input[id=\'email-input\']'         ).get(0).value,
                    getwid_message = $getwid_contact_form.find( 'textarea[id=\'message-textarea\']' ).get(0).value,

                    getwid_to        = $getwid_contact_form.find( 'input[id=\'to-input\']'      ).get(0).value,
                    getwid_subject   = $getwid_contact_form.find( 'input[id=\'subject-input\']' ).get(0).value,

                    getwid_challenge = $.parseJSON(getwid_use_captcha) ? $getwid_contact_form.find('#g-recaptcha-response').get(0).value : '';

                const errorCodes = {
                    ['missing-input-secret'  ] : __('The secret parameter is missing.', 'getwid'),
                    ['invalid-input-secret'  ] : __('The secret parameter is invalid or malformed.', 'getwid'),
                    ['missing-input-response'] : __('The response parameter is missing.', 'getwid'),

                    ['invalid-input-response'] : __('The response parameter is invalid or malformed.', 'getwid'),
                    ['bad-request'           ] : __('The request is invalid or malformed.', 'getwid'),

                    ['timeout-or-duplicate'] : __('The response is no longer valid: either is too old or has been used previously.', 'getwid'),
                };

                const data = {
                    'action': 'getwid_contact_form_send_mail',
                    'data': {
                        'to': getwid_to,
                        'subject': getwid_subject,

                        'name': getwid_name,
                        'from': getwid_from,
                        'message': getwid_message,
                        'captcha': getwid_use_captcha,

                        'challenge': getwid_challenge
                    }
                };

                $.post(Getwid.ajax_url, data, function (response) {
                    $getwid_contact_form.find('button').prop('disabled', false);

                    $result.parent().addClass('has-text-message');

                    //console.log(response);

                    $result.html('');
                    if (!$.isPlainObject(response.data)) {
                        
                        if (response.data) {
                            $getwid_contact_form.find('form').get(0).reset();

                            if ($.parseJSON(getwid_use_captcha)) {
                                grecaptcha.reset(captchaId);
                            }

                            setTimeout(() => {
                                $result.html(
                                    __('Thank you for your message. It has been sent.', 'getwid')
                                );
                            }, 35);
                            
                        } else {
                            setTimeout(() => {
                                $result.html(
                                    __('There was an error trying to send your message. Please try again later.', 'getwid')
                                );
                            }, 35);
                        }
                    } else {
                        response.data['error-codes'].forEach(function(item) {
                            setTimeout(() => {
                                $result.html($result.html() + ' ' + errorCodes[item]);
                            }, 35);                            
                        });
                    }
                });                
            });
        });
    });
})(jQuery);