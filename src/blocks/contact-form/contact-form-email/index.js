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
const baseClass = 'wp-block-getwid-contact-form-email';

/**
* Component Output
*/
export default registerBlockType(
    'getwid/contact-form-email',
    {
        title: __('Contact Form Email', 'getwid'),
        category: 'getwid-blocks',
        parent: [ 'getwid/contact-form' ],
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" /> </svg>,
        attributes: {
            label: {
                type: 'string'
            },
            email: {
                type: 'string'
            },
            isRequired: {
                type: 'string',
                default: 'true'
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