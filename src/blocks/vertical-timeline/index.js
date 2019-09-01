/**
 * Internal dependencies
 */
import GetwidTimeline from './edit';
import attributes from './attributes';

import './vertical-timeline-item';

import Save from './save';

import './style.scss';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-vertical-timeline';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/vertical-timeline',
    {
        title: __( 'Vertical timeline', 'getwid' ),
        //icon: 
        category: 'getwid-blocks',
        supports: {
            align: [ 'wide', 'full' ]
        },
        keywords: [
            __( 'vertical', 'getwid' ),
            __( 'timeline', 'getwid' )
        ],
        getEditWrapperProps( attributes ) {
            const { align } = attributes;
            if ( [ 'wide', 'full' ].includes( align ) ) {
                return { 'data-align': align };
            }
        },
        attributes: attributes,
        edit: props => (
            <GetwidTimeline {...{
                ...props,
                baseClass
            }} />
        ),
        save: props => (
            <Save {...{
                ...props,
                baseClass
            }} />
        )
    }
);