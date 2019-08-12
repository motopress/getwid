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

const childBlocks = [
    {
        name: 'vertical-timeline-item',
        settings: {
            title: __( 'Item', 'getwid' ),
            //icon:
            category: 'getwid-blocks',
            parent: [ 'getwid/vertical-timeline' ],
            supports: {
                multiple: true,
                reusable: false,
                html: false
            },
            attributes: {                
                imageSize: {
                    type: 'string',
                    default: 'large'
                },
                id: {
                    type: 'number'
                },
                alt:{
                    type: 'string',
                    source: 'attribute',
                    selector: '.wp-block-getwid-vertical-timeline-item__image',
                    attribute: 'alt',
                    default: '',
                },
                url: {
                    type: 'string',
                    source: 'attribute',
                    selector: '.wp-block-getwid-vertical-timeline-item__image',
                    attribute: 'src'
                },
            },            
            edit: props => (
                <GetwidTimelineItem {...{
                    ...props,
                    baseClass: `${baseClass}-item`
                }} />
            ),
            save: () => null
        }
    }
];

/**
* Register the block
*/
registerBlock( 'vertical-timeline', settings, childBlocks );