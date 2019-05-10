import attributes from './attributes';
import Edit from './edit';
import Save from './save';

import { __ } from 'wp.i18n';

const {
	registerBlockType,
} = wp.blocks;

const baseClass = 'wp-block-getwid-price-list';

export default registerBlockType(
    'getwid/price-list',
    {
        title: __('Price List', 'getwid'),
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
                    baseClass
                }}/>
            )
        },
        save: (props) => {
            return (
                <Save {...{
                    ...props,
                    baseClass
                }}/>
            )
        }
    }
);