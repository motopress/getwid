/**
* Internal dependencies
*/
import Edit from './edit';
import Save from './save';
import attributes from './attributes';
import attributes_deprecated from './attributes_deprecated';
import { convertFromMediaSlider, convertBlockTo } from './transform-helper';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
import Save_deprecated from './save_deprecated';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { times } from 'lodash';

const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-media-text-slider';
const blockName = 'getwid/media-text-slider';

/**
* Register the block
*/
registerBlockType('getwid/media-text-slider', {
	title: __( 'Media & Text Slider', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="2"/><circle cx="6" cy="22" r="2"/><circle cx="12" cy="22" r="2"/><circle cx="18" cy="22" r="2"/><path d="M0,0v19h24V0H0z M22,2v10.59l-2.5-2.5l-3.5,3.5l-6-6l-8,8V2H22z M3.41,17L10,10.41l6,6l3.5-3.5l2.5,2.5V17H3.41z"/></svg>,
	category: 'getwid-blocks',
	keywords: [
		__( 'gallery' , 'getwid' ),
		__( 'carousel', 'getwid' ),
		__( 'image'   , 'getwid' )
	],
	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],
		inserter: !Getwid.disabled_blocks.includes(blockName)
	},
	attributes,
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: content => convertFromMediaSlider( content )

			},
			{
				type: 'block',
				blocks: [ 'getwid/images-stack' ],
				transform: content => convertFromMediaSlider( content )

			},
			{
				type: 'block',
				blocks: [ 'getwid/images-slider' ],
				transform: content => convertFromMediaSlider( content )
			},
			{
				type: 'block',
				isMultiBlock: true,
				blocks: [ 'core/image' ],
				transform: content => convertFromMediaSlider( content )
			}
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: attributes => (
					convertBlockTo( attributes, 'core/gallery', null )
				)
			},
			{
				type: 'block',
				blocks: [ 'getwid/images-stack' ],
				transform: attributes => (
					convertBlockTo( attributes, 'getwid/images-stack', [] )
				)
			},
			{
				type: 'block',
				blocks: [ 'getwid/images-slider' ],
				transform: attributes => (
					convertBlockTo( attributes, 'getwid/images-slider', [] )
				)
			},
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: attributes => (
					convertBlockTo( attributes, 'core/image', null )
				)
			},
			{
				type: 'block',
				blocks: [ 'getwid/content-timeline' ],
				transform: attributes => (
					convertBlockTo( attributes, 'getwid/content-timeline', null )
				)
			}
		]
	},
	deprecated: [{
		attributes: attributes_deprecated,
		migrate( attributes ) {

			const labels = JSON.parse( attributes.sliderArrays.replace( /u0022/g, '"' ) );

			return {
				...attributes,
				sliderArrays: JSON.stringify( times( attributes.slideCount, index => `${labels[ index ].text}` ) )
			};
		},
		save: props => (
			<Save_deprecated {...{
				...props,
				baseClass
			}}/>
		)
	}],
	...checkDisableBlock(blockName, props => (
		<Edit {...{
			...props,
			baseClass
		}}/>
	)),
	save: props => (
		<Save {...{
			...props,
			baseClass
		}}/>
	)
});
