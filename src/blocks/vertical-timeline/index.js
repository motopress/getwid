/**
 * Internal dependencies
 */
import GetwidTimeline from './edit';
import GetwidTimelineItem from './components/getwid-timeline-item';
import Save from './components/save';

import './style.scss';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import classnames from 'classnames';
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
            type: 'string',
        },
        backgroundColor: {
            type: 'string'
        },
        customTextColor: {
            type: 'string'
        },
        customBackgroundColor: {
            type: 'string'
        },
        lineColor: {
            type: 'string'
        },
        customLineColor: {
            type: 'string'
        },
        itemsCount: {
            type: 'number',
            default: 1
        },
        entranceAnimation: {
            type: 'string'
        },
        enableFilling: {
            type: 'bool',
            default: false
        }
    },
    edit: props => (
        <GetwidTimeline {...{
            ...props,
            baseClass
        }} />
    ),
    save: props => {
        const { className, entranceAnimation } = props.attributes;
        return (
            <div className={`${classnames( className )}`} data-animation={entranceAnimation}>
                {/* <div className={`${baseClass}__line`}>
					<div className={`${baseClass}__bar`}></div>
				</div> */}
                <div className={`${baseClass}__wrapper`}>
                    <InnerBlocks.Content/>
                </div>
            </div>
        );
    }        
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
                textColor: {
                    type: 'string',
                },
                backgroundColor: {
                    type: 'string'
                },
                customBackgroundColor: {
                    type: 'string'
                },
                customTextColor: {
                    type: 'string'
                },
                cardPosition: {
                    type: 'string',
                    default: ''
                },
                entranceAnimation: {
                    type: 'string',
                    default: 'none'
                },
                meta: {
                    type: 'string',
                    source: 'html',
                    selector: '.wp-block-getwid-vertical-timeline-item__meta-content'
                },
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
                }
            },            
            edit: props => (
                <GetwidTimelineItem {...{
                    ...props,
                    baseClass: `${baseClass}-item`
                }} />               
            ),
            save: props => (
                <Save {...{
                    ...props,
                    baseClass: `${baseClass}-item`
                }} />
            )
        }
    }
];

/**
* Register the block
*/
registerBlock( 'vertical-timeline', settings, childBlocks );