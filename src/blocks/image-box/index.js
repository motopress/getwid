/**
* Internal dependencies
*/
import Edit from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import attributes from './attributes';

import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { get } from 'lodash';

const { select } = wp.data;
const { Fragment } = wp.element;
const { Toolbar, IconButton } = wp.components;
const { registerBlockType, createBlock } = wp.blocks;
const { BlockControls, AlignmentToolbar, InnerBlocks, MediaPlaceholder, MediaUpload, MediaUploadCheck } = wp.blockEditor || wp.editor;

/**
* Module Constants
*/
const ALLOWED_MEDIA_TYPES = [ 'image' ];
const baseClass = 'wp-block-getwid-image-box';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/image-box',
	{
		title: __( 'Image Box', 'getwid' ),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect y="18" width="24" height="2"/><rect y="22" width="17.6" height="2"/><path d="M0,0v0.9v0.2v0.7v1.7v9.2v1.6V15v1h3h18h3v-1.8v-1.7V3.5V1.8V1.1V0.9V0H0z M22,6.2l-8,5.9l-4.9-1.8L4,13c0,0-1.8,0-2,0V4.4V2h20V6.2z"/></svg>,
		keywords: [
			__( 'feature', 'getwid' ),
			__( 'service', 'getwid' )
		],
		supports: {
			alignWide: true,
			align: [ 'wide', 'full' ],
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
		edit: props => {
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
					url: get( media, [ 'sizes', imageSize, 'url' ] ) || get( media, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || media.url,
				} );
			};

			const onSelectMedia = ( media ) => {
				let {
					attributes:{
						imageSize,
					},
				} = props;
	
				if (!['full', 'large', 'medium', 'thumbnail'].includes(imageSize)) {
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
							<Fragment>
								<MediaUploadCheck>
									<Toolbar>
										<MediaUpload
											onSelect={ onSelectMedia }
											allowedTypes={ ALLOWED_MEDIA_TYPES }
											value={ id }
											render={ ( { open } ) => (
												<IconButton
													className="components-toolbar__control"
													label={ __( 'Edit Media', 'getwid' ) }
													icon="edit"
													onClick={ open }
												/>
											) }
										/>
									</Toolbar>
								</MediaUploadCheck>
							</Fragment>
						) }
					</BlockControls>
				</Fragment>
			);

	        return (
				<Fragment>	
					{ controls }  				
					<Edit {...{ setAttributes, ...props, changeImageSize, onSelectMedia }} key='edit'/>
					<Fragment>
						<BlockControls>
							<Toolbar
								controls={ toolbarControls }
							/>                    
						</BlockControls>	        	
						<BlockControls>
							<AlignmentToolbar
								value={ textAlignment }
								onChange={ onChangeAlignment }
							/>                  
						</BlockControls>
					</Fragment>						  					
				</Fragment>
			);
		},
		save: Save
	}
);