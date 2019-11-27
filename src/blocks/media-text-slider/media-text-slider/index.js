/**
* Internal dependencies
*/
import Edit from './edit';
import Save from './save';
import attributes from './attributes';
import attributes_deprecated from './attributes_deprecated';
import { convertFromMediaSlider, convertBlockTo } from './transform-helper';

import Save_deprecated from './save_deprecated';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-media-text-slider';

/**
* Register the block
*/
registerBlockType( 'getwid/media-text-slider', {
	title: __( 'Media & Text Slider', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><path d="M0,0v1v0.2V2v1.9v10.3V16v0.9V18h3h18h3v-2v-1.9V3.9V2V1.2V1V0H0z M22,7l-8,7l-4.9-2.1L4,15c0,0-1.8,0-2,0V4.8V2h20V7z"/><rect x="4" y="4" width="11" height="2"/><rect x="4" y="7" width="7" height="2"/><circle cx="6" cy="22" r="2"/><circle cx="12" cy="22" r="2"/><circle cx="18" cy="22" r="2"/></svg>,
	category: 'getwid-blocks',
	keywords: [
		__( 'gallery' , 'getwid' ),
		__( 'carousel', 'getwid' ),
		__( 'photo'   , 'getwid' )
	],
	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],
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
	deprecated: [
		{
			attributes: attributes,
			save: props => (
				<Save_deprecated {...{
					...props,
					baseClass
				}}/>
			)
		},
	],	
	edit: props => (
		<Edit {...{
			...props,
			baseClass
		}}/>
	),
	save: props => (
		<Save {...{
			...props,
			baseClass
		}}/>
	)
} );