/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import GetwidTimeline from './edit';
import attributes from './attributes';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
import { convertBlockFrom, convertBlockTo } from './transform-helper';
import Save from './save';

/**
* WordPress dependencies
*/
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-content-timeline';
const blockName = 'getwid/content-timeline';

/**
* Register the block
*/
export default registerBlockType(
    blockName,
    {
        title: __( 'Content Timeline', 'getwid' ),
        icon: <svg x="0px" y="0px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16,8v3h-2.28c-0.17-0.3-0.42-0.55-0.72-0.72V5.72c0.6-0.35,1-0.98,1-1.72s-0.4-1.38-1-1.72V0h-2v2.28  C10.7,2.45,10.45,2.7,10.28,3H8V0H0v8h8V5h2.28C10.45,5.3,10.7,5.55,11,5.72v4.55c-0.6,0.35-1,0.98-1,1.72s0.4,1.38,1,1.72v4.55  c-0.3,0.17-0.55,0.42-0.72,0.72H8v-3H0v8h8v-3h2.28c0.17,0.3,0.42,0.55,0.72,0.72V24h2v-2.28c0.6-0.35,1-0.98,1-1.72  s-0.4-1.38-1-1.72v-4.55c0.3-0.17,0.55-0.42,0.72-0.72H16v3h8V8H16z M6,6H2V2h4V6z M6,22H2v-4h4V22z M22,14h-4v-4h4V14z"/></svg>,
        category: 'getwid-blocks',
        supports: {
			align: [ 'wide', 'full' ],
			inserter: !Getwid.disabled_blocks.includes(blockName)
        },
        transforms: {
			from: [
                {
                    type: 'block',
                    blocks: [ 'core/gallery' ],
                    transform: content => convertBlockFrom( content )
                },
                {
                    type: 'block',
                    isMultiBlock: true,
                    blocks: [ 'core/image' ],
                    transform: content => convertBlockFrom( content )
                },
                {
                    type: 'block',
                    blocks: [ 'getwid/images-stack' ],
                    transform: content => convertBlockFrom( content )

                },
                {
                    type: 'block',
                    blocks: [ 'getwid/images-slider' ],
                    transform: content => convertBlockFrom( content )
                }
            ],
			to: [
				{
                    type: 'block',
                    blocks: [ 'core/gallery' ],
                    transform: () => (
                        convertBlockTo( 'core/gallery' )
                    )
                },
                {
                    type: 'block',
                    blocks: [ 'core/image' ],
                    transform: () => (
                        convertBlockTo( 'core/image' )
                    )
                },
                {
                    type: 'block',
                    blocks: [ 'getwid/images-stack' ],
                    transform: () => (
                        convertBlockTo( 'getwid/images-stack' )
                    )
                },
                {
                    type: 'block',
                    blocks: [ 'getwid/images-slider' ],
                    transform: () => (
                        convertBlockTo( 'getwid/images-slider' )
                    )
                },
                {
                    type: 'block',
                    blocks: [ 'getwid/media-text-slider' ],
                    transform: () => (
                        convertBlockTo( 'getwid/media-text-slider' )
                    )
                }
			]
		},
        keywords: [
            __( 'vertical', 'getwid' ),
            __( 'workflow', 'getwid' ),
        ],
        getEditWrapperProps( attributes ) {
            const { align } = attributes;
            if ( [ 'wide', 'full' ].includes( align ) ) {
                return { 'data-align': align };
            }
        },
        attributes: attributes,
		...checkDisableBlock(blockName, props => (
            <GetwidTimeline {...{
                ...props,
                baseClass
            }} />
		)),
        save: props => (
            <Save {...{
                ...props,
                baseClass
            }} />
        )
    }
);
