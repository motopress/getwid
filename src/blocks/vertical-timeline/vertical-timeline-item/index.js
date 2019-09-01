/**
 * Internal dependencies
 */
import GetwidTimelineItem from './getwid-timeline-item';
import attributes from './attributes';

import Save from './save';

import '../style.scss';

import { Consumer } from '../edit';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-vertical-timeline-item';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/vertical-timeline-item',
    {
        title: __( 'Item', 'getwid' ),
        //icon:
        category: 'getwid-blocks',
        parent: [ 'getwid/vertical-timeline' ],
        supports: {
            multiple: true,
            reusable: false,
            html: false
        },
        attributes,
        edit: props => (
            <Consumer>
                { ( { updateLineHeight, updateBarHeight, setColorByScroll } ) => (
                    <GetwidTimelineItem {...{
                        ...props,
                        ...{updateLineHeight},
                        ...{updateBarHeight},
                        ...{setColorByScroll},
                        baseClass
                    }} />
                )}
            </Consumer>
        ),
        save: props => (
            <Save {...{
                ...props,
                baseClass
            }} />
        )
    }
);