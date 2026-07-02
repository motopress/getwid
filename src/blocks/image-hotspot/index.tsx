import {
	createBlock,
	registerBlockType,
	type BlockConfiguration,
} from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import Save from './save';
import type { ImageHotspotAttributes } from './types';

const blockName = 'getwid/image-hotspot';

const icon = (
	<svg x="0px" y="0px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="20" r="2" />
		<path d="M20,4v7h-4h-0.67l-0.53,0.4L12,13.5l-2.8-2.1L8.67,11H8H4V4H20 M22,2H2v11h6l4,3l4-3h6V2L22,2z" />
	</svg>
);

registerBlockType( metadata as BlockConfiguration< ImageHotspotAttributes >, {
	title: __( 'Image Hotspot', 'getwid' ),
	icon,
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( attributes: Record< string, unknown > ) =>
					createBlock( blockName, {
						id: attributes.id,
						url: attributes.url,
					} ),
			},
			{
				type: 'block',
				blocks: [ 'core/media-text' ],
				transform: ( attributes: Record< string, unknown > ) =>
					createBlock( blockName, {
						id: attributes.mediaId,
						url: attributes.mediaUrl,
					} ),
			},
			{
				type: 'block',
				blocks: [
					'getwid/image-box',
					'core/cover',
					'getwid/banner',
					'getwid/video-popup',
				],
				transform: ( attributes: Record< string, unknown > ) =>
					createBlock( blockName, {
						id: attributes.id,
						url: attributes.url,
					} ),
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/media-text' ],
				transform: ( attributes: ImageHotspotAttributes ) =>
					createBlock( 'core/media-text', {
						mediaId: attributes.id,
						mediaUrl: attributes.url,
						mediaType: 'image',
					} ),
			},
			{
				type: 'block',
				blocks: [ 'core/cover' ],
				transform: ( attributes: ImageHotspotAttributes ) =>
					createBlock( 'core/cover', {
						id: attributes.id,
						url: attributes.url,
					} ),
			},
			{
				type: 'block',
				blocks: [ 'getwid/image-box' ],
				transform: ( attributes: ImageHotspotAttributes ) =>
					createBlock( 'getwid/image-box', {
						id: attributes.id,
						url: attributes.url,
					} ),
			},
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( attributes: ImageHotspotAttributes ) =>
					createBlock( 'core/image', {
						id: attributes.id,
						url: attributes.url,
					} ),
			},
			{
				type: 'block',
				blocks: [ 'getwid/banner' ],
				transform: ( attributes: ImageHotspotAttributes ) =>
					createBlock( 'getwid/banner', {
						id: attributes.id,
						url: attributes.url,
					} ),
			},
		],
	},
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
	deprecated,
} );
