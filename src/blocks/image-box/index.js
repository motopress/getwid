/**
* Internal dependencies
*/
import Edit from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import attributes from './attributes';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { get } from 'lodash';

const { select } = wp.data;
const { Fragment } = wp.element;
const { ToolbarGroup, ToolbarButton } = wp.components;
const { registerBlockType, createBlock } = wp.blocks;
const { BlockControls, AlignmentToolbar, InnerBlocks, MediaPlaceholder, MediaUpload, MediaUploadCheck } = wp.blockEditor || wp.editor;

/**
* Module Constants
*/
const ALLOWED_MEDIA_TYPES = [ 'image' ];
const baseClass = 'wp-block-getwid-image-box';
const blockName = 'getwid/image-box';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/image-box',
	{
		title: __( 'Image Box', 'getwid' ),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect y="18" width="24" height="2"/><rect y="22" width="17.6" height="2"/><path d="M0,0v16h24V0H0z M22,2v6.59l-2.5-2.5L16,9.59l-6-6l-8,8V2H22z M2.41,14L10,6.41l6,6l3.5-3.5l2.5,2.5V14H2.41z"/></svg>,
		keywords: [
			__( 'feature', 'getwid' ),
			__( 'service', 'getwid' )
		],
		supports: {
			alignWide: true,
			align: [ 'wide', 'full' ],
			inserter: !Getwid.disabled_blocks.includes(blockName)
		},
		deprecated: [
			{
				attributes: attributes,
				save: Save_deprecated
			}
		],
		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( attributes ) => {
						const clientId = select('core/editor').getSelectedBlockClientId();
						const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;
						let inner_attributes = {
							heading: '',
							text: ''
						};

					 	if (innerBlocksArr.length){
							jQuery.each(innerBlocksArr, (index, item) => {
								if (item.name == 'core/heading'){
									inner_attributes.heading = item.attributes.content;
								}

								if (item.name == 'core/paragraph'){
									inner_attributes.text = item.attributes.content;
								}
							});
						}

						return createBlock( 'core/image', {
							id: attributes.id,
							url: attributes.url,
							caption: inner_attributes.heading ? inner_attributes.heading : (inner_attributes.text ? inner_attributes.text : ''),
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'getwid/banner' ],
					transform: ( attributes ) => {
						const clientId = select('core/editor').getSelectedBlockClientId();
						const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;
						let inner_attributes = {
							heading: '',
							text: ''
						};

					 	if (innerBlocksArr.length){
							jQuery.each(innerBlocksArr, (index, item) => {
								if (item.name == 'core/heading'){
									inner_attributes.heading = item.attributes.content;
								}

								if (item.name == 'core/paragraph'){
									inner_attributes.text = item.attributes.content;
								}
							});
						}

						return createBlock( 'getwid/banner', {
							id: attributes.id,
							url: attributes.url,
							title: inner_attributes.heading,
							text: inner_attributes.text
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'getwid/video-popup' ],
					transform: ( attributes ) => {
						const clientId = select('core/editor').getSelectedBlockClientId();
						const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;
						let inner_attributes = {
							heading: '',
							text: ''
						};

					 	if (innerBlocksArr.length){
							jQuery.each(innerBlocksArr, (index, item) => {
								if (item.name == 'core/heading'){
									inner_attributes.heading = item.attributes.content;
								}

								if (item.name == 'core/paragraph'){
									inner_attributes.text = item.attributes.content;
								}
							});
						}

						return createBlock( 'getwid/video-popup', {
							id: attributes.id,
							url: attributes.url,
							title: inner_attributes.heading,
							text: inner_attributes.text
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'getwid/icon-box' ],
					transform: ( attributes ) => {
						const clientId = select('core/editor').getSelectedBlockClientId();
						const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;
						return createBlock( 'getwid/icon-box', attributes, innerBlocksArr );
					}
				},
				{
					type: 'block',
					blocks: [ 'core/heading' ],
					transform: ( attributes ) => {
						const clientId = select('core/editor').getSelectedBlockClientId();
						const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;
						let inner_attributes;

					 	if (innerBlocksArr.length){
							jQuery.each(innerBlocksArr, (index, item) => {
								if (item.name == 'core/heading'){
									inner_attributes = item.attributes.content;
								}
							});
						}

						return createBlock( 'core/heading', {
							content: inner_attributes,
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'core/paragraph' ],
					transform: ( attributes ) => {
						const clientId = select('core/editor').getSelectedBlockClientId();
						const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;
						let inner_attributes;

					 	if (innerBlocksArr.length){
							jQuery.each(innerBlocksArr, (index, item) => {
								if (item.name == 'core/paragraph'){
									inner_attributes = item.attributes.content;
								}
							});
						}

						return createBlock( 'core/paragraph', {
							content: inner_attributes,
						} );
					}
				}
			],
		},
		attributes,
		...checkDisableBlock(blockName, props => {
			const {
				attributes: {
					textAlignment,
					id,
					url,
					layout
				},
				setAttributes
			} = props;

	        const onChangeAlignment = newAlignment => {
				typeof newAlignment !== 'undefined' ? setAttributes( { textAlignment: newAlignment } ) : setAttributes( { textAlignment: 'center' } ) ;

			};

			const toolbarControls = [ {
				icon: 'align-left',
				title: __( 'Align Image Left', 'getwid'),
				isActive: layout == 'left',
				onClick: () => setAttributes( { layout: (layout == 'left' ? null : 'left') }),
			}, {
				icon: 'align-right',
				title: __( 'Align Image Right', 'getwid'),
				isActive: layout == 'right',
				onClick: () => setAttributes( { layout: (layout == 'right' ? null : 'right') }),
			} ];

			const changeImageSize = ( media, imageSize) => {
				if ( ! media ) {
					setAttributes( { url: undefined, id: undefined } );
					return;
				}

				setAttributes( {
					id: media.id,
					alt: media.alt,
					url:
						get( media, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) ||
						get( media, [ 'media_details', 'sizes', 'large', 'source_url' ] ) ||
						get( media, [ 'media_details', 'sizes', 'full', 'source_url' ] ) ||
						get( media, [ 'sizes', imageSize, 'url' ] ) ||
						media.url,
				} );
			};

			const onSelectMedia = ( media ) => {
				let {
					attributes:{
						imageSize,
					},
				} = props;

				if ( ! ['full', 'large', 'medium', 'thumbnail'].includes(imageSize) ) {
					imageSize = attributes.imageSize.default;
					setAttributes( {
						imageSize
					} );
				}

				changeImageSize(media, imageSize);
			};

			const controls = (
				<Fragment>
					{ ! url && (
						<MediaPlaceholder
							icon={'format-image'}
							className={baseClass}
							labels={{
								title: __('Image Box', 'getwid'),
							}}
							onSelect={onSelectMedia}
							accept="image/*"
							allowedTypes={ALLOWED_MEDIA_TYPES}
						/>
					)}
					<BlockControls>
						{ !! url && (
							<MediaUploadCheck>
								<ToolbarGroup>
									<MediaUpload
										onSelect={ onSelectMedia }
										allowedTypes={ ALLOWED_MEDIA_TYPES }
										value={ id }
										render={ ( { open } ) => (
											<ToolbarButton
												label={ __( 'Edit Media', 'getwid' ) }
												icon="edit"
												onClick={ open }
											/>
										) }
									/>
								</ToolbarGroup>
							</MediaUploadCheck>
						) }
					</BlockControls>
				</Fragment>
			);

	        return (
				<Fragment>
					{ controls }
					<Edit
						{ ...{
							...props,
							setAttributes,
							changeImageSize,
							onSelectMedia
						} }
					/>
					<BlockControls>
						<ToolbarGroup
							controls={ toolbarControls }
						/>
						<AlignmentToolbar
							value={ textAlignment }
							onChange={ onChangeAlignment }
						/>
					</BlockControls>
				</Fragment>
			);
		}),
		save: Save
	}
);
