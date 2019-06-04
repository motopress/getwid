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
        parent: [ 'getwid/contact-form', 'core/column' ],
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /> </svg>,
		supports: {
			multiple: false,
		},
        keywords: [
		],

        attributes: {
            label: {
                type: 'string'
            },
            placehoder: {
                type: 'string'
            },
            required: {
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