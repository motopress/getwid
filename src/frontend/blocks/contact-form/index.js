import { __ } from 'wp.i18n';
import { addScript } from 'GetwidUtils/help-functions';

/**
* Module Constants
*/
const ERROR_CODES = {
    ['missing-input-secret'  ] : __( 'The secret parameter is missing.', 'getwid'              ),
    ['invalid-input-secret'  ] : __( 'The secret parameter is invalid or malformed.', 'getwid' ),
    ['missing-input-response'] : __( 'The response parameter is missing.', 'getwid'            ),

    ['invalid-input-response'] : __( 'The response parameter is invalid or malformed.', 'getwid' ),
    ['bad-request'           ] : __( 'The request is invalid or malformed.', 'getwid'            ),

    ['timeout-or-duplicate'] : __( 'The response is no longer valid: either is too old or has been used previously.', 'getwid' )
};

(function ($) {
    $(document).ready((event) => {

        const $getwid_contact_forms = $('.wp-block-getwid-contact-form');

        $getwid_contact_forms.each((index, form) => {

            const className = 'wp-block-getwid-contact-form';
   
            const $result  = $( '<span></span>' ).addClass( `.${className}__result` );
            const $captcha = $(form).find( 'div[class$=__reCAPTCHA]' );
            const $wrapper = $(form).find( `.${className}__wrapper`  );

            $captcha.length ? $result.insertBefore( $captcha.parent() ) : $result.insertBefore( $wrapper.children('input').first() );

            const getwid_captcha_theme = $captcha.parent().data('theme');

            let captchaId;
            if ( $captcha.length ) {
                addScript('https://www.google.com/recaptcha/api.js?render=explicit&hl=en', () => {
                    grecaptcha.ready(() => {
                        captchaId = grecaptcha.render($captcha.get(0), {
                            'sitekey': Getwid.settings.recaptcha_site_key,
                            'theme'  : getwid_captcha_theme
                        });
                    });
                });
            }

            $(form).submit((event) => {

                event.preventDefault();

                $(form).find('button[type=\'submit\']').prop('disabled', true);

                const getwid_name    = $(form).find( 'input[id=\'name-input\']'          ).get(0).value;
                const getwid_from    = $(form).find( 'input[id=\'email-input\']'         ).get(0).value;
                const getwid_message = $(form).find( 'textarea[id=\'message-textarea\']' ).get(0).value;

                const getwid_to      = $(form).find( 'input[id=\'to-input\']'      ).get(0).value;
                const getwid_subject = $(form).find( 'input[id=\'subject-input\']' ).get(0).value;

                const getwid_challenge = $captcha.length ? $(form).find('#g-recaptcha-response').get(0).value : '';

                const data = {
                    'action': 'getwid_contact_form_check_captcha',
                    'data': {
                        'to'     : getwid_to,
                        'subject': getwid_subject,

                        'name' : getwid_name,
                        'from' : getwid_from,

                        'message': getwid_message,
                        'captcha': $captcha.length ? 'true' : 'false',

                        'challenge': getwid_challenge
                    }
                };

                $.post(Getwid.ajax_url, data, (response) => {
                    $(form).find('button').prop('disabled', false);

                    $result.html('');
                    if (!$.isPlainObject(response.data)) {
                        
                        if (response.data) {
                            $(form).find('form').get(0).reset();

                            if ( $captcha.length ) {
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
                        response.data['error-codes'].forEach((item) => {
                            setTimeout(() => {
                                $result.html($result.html() + ' ' + ERROR_CODES[item]);
                            }, 35);
                        });
                    }
                });                
            });
        });
    });
})(jQuery);