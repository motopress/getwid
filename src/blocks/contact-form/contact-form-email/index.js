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