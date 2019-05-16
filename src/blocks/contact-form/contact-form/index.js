import attributes from './attributes';
import Save from './save';
import Edit from './edit';

import { __ } from 'wp.i18n';

import './style.scss';

const {
	registerBlockType
} = wp.blocks;

const baseClass = 'wp-block-getwid-contact-form';

export default registerBlockType(
    'getwid/contact-form',
    {
        title: __('Contact Form', 'getwid'),
        category: 'getwid-blocks',
        supports: {
			align: [ 'wide', 'full' ],
		},
        getEditWrapperProps( attributes ) {
            const { align } = attributes;
            if ( [ 'wide', 'full' ].includes( align ) ) {
                return { 'data-align': align };
            }
        },
        attributes,
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