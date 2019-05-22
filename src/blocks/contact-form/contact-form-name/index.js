/**
* External dependencies
*/
import Save from './save';
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
            isRequired: {
                type: 'string'
            },
            label: {
                type: 'string',
                source: 'attribute',
                selector: '.wp-block-getwid-contact-form-name',
                attribute: 'data-label'
            },
            name: {
                type: 'string',
                source: 'attribute',
                selector: '.wp-block-getwid-contact-form-name',
                attribute: 'data-name'
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
        save: (props) => {
            return (
                <Save {...{
                    ...props,
                    baseClass,
                }}/>
            )
        }
    }
);