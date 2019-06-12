/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import Save from './save';
import Edit from './edit';
import attributes from './attributes';

import './style.scss';

/**
* WordPress dependencies
*/
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-circle-progress-bar';

export default registerBlockType(
    'getwid/circle-progress-bar',
    {
        title: __('Circular Progress Bar', 'getwid'),
        icon: <svg x="0px" y="0px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,22C6.49,22,2,17.51,2,12S6.49,2,12,2V0C5.37,0,0,5.37,0,12s5.37,12,12,12s12-5.37,12-12h-2C22,17.51,17.51,22,12,22z"/></svg>,
        category: 'getwid-blocks',
        supports: {
			align: [ 'wide', 'full' ],
        },
        keywords: [
            __( 'circle'  , 'getwid' ),
            __( 'progress', 'getwid' )
        ],
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