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
const baseClass = 'wp-block-getwid-contact-form-name';

/**
* Component Output
*/
export default registerBlockType(
    'getwid/contact-form-name',
    {
        title: __('Contact Form Name', 'getwid'),
        category: 'getwid-blocks',
        parent: [ 'getwid/contact-form' ],

        keywords: [
		],

        attributes: {
            label: {
                type: 'string'
            },
            name: {
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