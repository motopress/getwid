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
        icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><rect y="2" width="15" height="2"/><rect y="6" width="10" height="2"/><path d="M24,2h-2V1h-2v1l0,0c-1.1,0-2,0.9-2,2v0.99C18,6.1,18.9,7,20.01,7L22,7.01V8h-4v2h2v1h2v-1h-0.02C23.09,10,24,9.09,24,7.98	V7.01C24,5.9,23.1,5,21.99,5L20,4.99V4h4V2z"/><rect y="14" width="15" height="2"/><rect y="18" width="10" height="2"/><path d="M24,14h-2v-1h-2v1l0,0c-1.1,0-2,0.9-2,2v0.99C18,18.1,18.9,19,20.01,19L22,19.01V20h-4v2h2v1h2v-1h-0.02	c1.11,0,2.02-0.91,2.02-2.02v-0.97C24,17.9,23.1,17,21.99,17L20,16.99V16h4V14z"/></svg>,
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