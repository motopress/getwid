/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { every, filter, isEqual } from 'lodash';

/**
* Internal dependencies
*/
import { default as Edit } from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import Save_deprecated_2 from './save_deprecated_2';
import attributes from './attributes';
import {checkDisableBlock} from 'GetwidUtils/help-functions';

import './style.scss';

const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const validAlignments = [ 'center', 'wide', 'full' ];
const baseClass = 'wp-block-getwid-images-slider';
const blockName = 'getwid/images-slider';
const deprecated_params = {
	attributes: attributes,
	isEligible( attributes, innerBlocks ) {
		return true;
	},
	migrate( attributes ) {
		const { sliderArrows, sliderDots } = attributes;
		return {
			...attributes,
			...{
				sliderArrows: isEqual( sliderArrows, 'ouside' ) ? 'outside' : sliderArrows,
				sliderDots:   isEqual( sliderDots  , 'ouside' ) ? 'outside' : sliderDots
			}
		};
	}
};


/**
* Register the block
*/
export default registerBlockType(
	'getwid/images-slider',
	{
		title: __( 'Image Slider', 'getwid' ),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><path d="M20,8V4h-4v2h2v1v1v2v1v7h-7h-1H8H7H6v-2H4v4h4v4h16V8H20z M22,22H10v-2h10V10h2V22z"/><path d="M0,0v16h16V0H0z M14,2v8.19l-1.61-1.6l-2.16,2.15l-3.7-3.69L2,11.59V2H14z M2.41,14l4.13-4.13l3.7,3.69l2.16-2.15L14,13.02 V14H2.41z"/><circle cx="10" cy="5.5" r="1.5"/></svg>,
		keywords: [
			__( 'gallery' , 'getwid' ),
			__( 'carousel', 'getwid' ),
			__( 'photo'	  , 'getwid' )
		],
		supports: {
			html: false,
			inserter: !Getwid.disabled_blocks.includes(blockName)
		},
		deprecated: [
			{
				...deprecated_params,
				save: Save_deprecated
			},
			{
				...deprecated_params,
				save: props => (
					<Save_deprecated_2 {...{
						...props,
						baseClass
					}}/>
				)
			}
		],
		transforms: {
			from:
			[
				{
					type: 'block',
					isMultiBlock: true,
					blocks: [ 'core/image' ],
					transform: attributes => {
						let { align } = attributes[ 0 ];
						align = every( attributes, [ 'align', align ] ) ? align : undefined;
						const validImages = filter( attributes, ({ id, url }) => id && url );

						return createBlock( 'getwid/images-slider', {
							images: validImages.map( ({ id, url, alt, caption }) => ({
								id,
								url,
								alt,
								caption
							}) ),
							ids: validImages.map( ({ id }) => id ),
							align
						} );
					}
				}, {
					type: 'block',
					blocks: [ 'core/gallery' ],
					transform: ( attributes ) => createBlock( 'getwid/images-slider', attributes )
				}
			],
			to:
			[
				{
					type: 'block',
					blocks: [ 'core/gallery' ],
					transform: ( attributes ) => createBlock( 'core/gallery', attributes )
				}, {
					type: 'block',
					blocks: [ 'getwid/images-stack' ],
					transform: attributes => createBlock( 'getwid/images-stack', attributes )
				}, {
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ({ images, align }) => {
						if ( images.length > 0 ) {
							return images.map( ({ id, url, alt, caption }) => createBlock( 'core/image', {
								id,
								url,
								alt,
								caption,
								align
							}) );
						}
						return createBlock( 'core/image', { align } );
					}
				}
			]
		},
		attributes,
		getEditWrapperProps( attributes ) {
			const { align } = attributes;
			if ( -1 !== validAlignments.indexOf( align ) ) {
				return { 'data-align': align };
			}
		},
		...checkDisableBlock(blockName, Edit),
		save: props => (
            <Save {...{
                ...props,
                baseClass
            }}/>
        )
	}
);
