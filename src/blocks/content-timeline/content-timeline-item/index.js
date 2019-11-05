/**
 * Internal dependencies
 */
import GetwidTimelineItem from './edit';
import attributes from './attributes';

import Save from './save';

import { Consumer } from '../content-timeline/edit';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-content-timeline-item';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/content-timeline-item',
    {
        title: __( 'Timeline Block', 'getwid' ),
        //icon:
        category: 'getwid-blocks',
        parent: [ 'getwid/content-timeline' ],
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