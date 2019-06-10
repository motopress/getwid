import { __ } from 'wp.i18n';

import Edit from './edit';
import Save from './save';
import attributes from './attributes';

import { isInViewport, scrollHandler } from 'GetwidUtils/help-functions';

import './style.scss';

const {
	registerBlockType,
} = wp.blocks;

const baseClass = 'wp-block-getwid-progress-bar';

export default registerBlockType(
    'getwid/progress-bar',
    {
        title: __('Progress Bar', 'getwid'),
        icon: <svg x="0px" y="0px" viewBox="0 0 24 24"><g><path d="M13,14H0v6h13h11v-6H13z M22,18H12v-2h10V18z"/></g><path d="M12,12l4-2V4H8v6 M14,9l-2,1l-2-1V6h4V9z"/></svg>,
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
        attributes: attributes,
        edit: (props) => {
            return (
                <Edit {...{
                    ...props,
                    baseClass,
                    isInViewport,
                    scrollHandler
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