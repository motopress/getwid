/**
* External dependencies
*/
import Edit from './edit';
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	registerBlockType
} = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-contact-form-captcha';

/**
* Component Output
*/
export default registerBlockType(
    'getwid/contact-form-captcha',
    {
        title: __('Contact Form Recaptcha', 'getwid'),
        category: 'getwid-blocks',
        parent: [ 'getwid/contact-form' ],
        
        keywords: [
		],

        attributes: {
            theme: {
                type: 'string',
                default: 'dark'
            },
            size: {
                type: 'string'
            }
        },
        edit: (props) => {
            return (
                <Edit {...{
                    ...props,
                    baseClass,
                }}/>
            )
        },
        save: () => {
            return null;
        }
    }
);