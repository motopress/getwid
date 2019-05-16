import Save from './save';
import Edit from './edit';

import { __ } from 'wp.i18n';

const {
	registerBlockType
} = wp.blocks;

const baseClass = 'wp-block-getwid-contact-form-name';

export default registerBlockType(
    'getwid/contact-form-name',
    {
        title: __('Contact Form Name', 'getwid'),
        category: 'getwid-blocks',
        parent: [ 'getwid/contact-form' ],

        keywords: [
		],

        attributes: {
            edit: {
                type: 'string',
                source: 'html',
                selector: '.wp-block-getwid-contact-form-name__edit',
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