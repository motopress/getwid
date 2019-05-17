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
        
        attributes: {
            label: {
                type: 'string',
                source: 'html',
                selector: '.wp-block-getwid-contact-form-message__label'
            },
            message: {
                type: 'string',
                source: 'attribute',
                selector: '.components-base-control__field textarea',
                attribute: 'placeholder'
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