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
const baseClass = 'wp-block-getwid-contact-form-message';

/**
* Component Output
*/
export default registerBlockType(
    'getwid/contact-form-message',
    {
        title: __('Contact Form Message', 'getwid'),
        category: 'getwid-blocks',
        parent: [ 'getwid/contact-form' ],
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M21 11.01L3 11v2h18zM3 16h12v2H3zM21 6H3v2.01L21 8z" /> </svg>,
        attributes: {
            label: {
                type: 'string'
            },
            message: {
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