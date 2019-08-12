/**
 * Internal dependencies
 */
import GetwidTimeline from './edit';
import GetwidTimelineItem from './components/getwid-timeline-item';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import { registerBlock } from 'GetwidUtils/register-getwid-block';

const { InnerBlocks } = wp.editor;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-vertical-timeline';

/**
* Register the block
*/
const settings = {
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
    attributes: {
        align: {
            type: 'string'
        },
        wrapperAlign: {
            type: 'string'
        },
        textColor: {
            type: 'string'
        },
        customTextColor: {
            type: 'string'
        }
    },
    edit: props => (
        <GetwidTimeline {...{
            ...props,
            baseClass
        }}/>
    ),
    save: () => null
};

const fieldDefaults = {
	category: 'getwid-blocks',
	parent: [ 'getwid/vertical-timeline' ],
	supports: {
        multiple: true,
        reusable: false,
        html: false
	},
	attributes: {
		/* */
    },
	save: () => null
};

const childBlocks = [
	{
		name: 'vertical-timeline-item',
		settings: {
			...fieldDefaults,
			title: __( 'Item', 'getwid' ),
            //icon: 
            edit: props => (
                <GetwidTimelineItem {...{
                    ...props,
                    baseClass: `${baseClass}-item`
                }}/>
            )
		}
    }
];

/**
* Register the block
*/
registerBlock( 'vertical-timeline', settings, childBlocks );