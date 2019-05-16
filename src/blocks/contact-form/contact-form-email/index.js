import Save from './save';
import Edit from './edit';

import { __ } from 'wp.i18n';

const {
	registerBlockType
} = wp.blocks;

const baseClass = 'wp-block-getwid-contact-form-email';

export default registerBlockType(
    'getwid/contact-form-email',
    {
        title: __('Contact Form Email', 'getwid'),
        category: 'getwid-blocks',
        parent: [ 'getwid/contact-form' ],
        
        attributes: {
            edit: {
                type: 'string',
                source: 'html',
                selector: '.wp-block-getwid-contact-form-email__edit'
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