/**
* Internal dependencies
*/
import edit from './edit';
import attributes from './attributes';
import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { times, escape} from 'lodash';
const { select } = wp.data;
const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-image-hotspot';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/image-hotspot',
	{
		title: __( 'Image Hotspot', 'getwid' ),
		category: 'getwid-blocks',
		// icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect y="18" width="24" height="2"/><rect y="22" width="17.6" height="2"/><path d="M0,0v0.9v0.2v0.7v1.7v9.2v1.6V15v1h3h18h3v-1.8v-1.7V3.5V1.8V1.1V0.9V0H0z M22,6.2l-8,5.9l-4.9-1.8L4,13c0,0-1.8,0-2,0V4.4V2h20V6.2z"/></svg>,
		keywords: [
			__( 'feature', 'getwid' ),
			__( 'service', 'getwid' )
		],
		supports: {
			alignWide: true,
			align: [ 'wide', 'full' ],
		},
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
		edit: edit,
		save: props => {
			const {
				attributes: {
					id,
					url,
					alt,
					hoverAnimation,
					imagePoints,

					marginTop,
					marginBottom,
					marginLeft,
					marginRight,

					className,
				},
			} = props;

			const wrapperProps = {
				className: classnames( className,
					{
						'getwid-animation': !! hoverAnimation,
					},
				),
				'data-animation': hoverAnimation ? hoverAnimation : undefined
			};

			const imageContainerProps = classnames(
				`${baseClass}__image-container`,
			);

			const imageHTML = url ? (<img src={ url } alt={(typeof alt != 'undefined' ? alt : null)} className= {`${baseClass}__image` +  ` wp-image-${ id }`}/>) : null;

			const wrapperStyle = {
				marginTop,
				marginBottom,
				marginLeft,
				marginRight
			};

			const imageWrapperProps = {
				className: classnames(
					`${baseClass}__image-wrapper`,
				),
			};

			const imagePointsArr = {
				'data-image-points' : escape(imagePoints),
			};

			return (
				<div {...wrapperProps} {...imagePointsArr}>
					<div style={wrapperStyle} className={imageContainerProps}>					
						<div {...imageWrapperProps} >
							{imageHTML}
						</div>					
					</div>
				</div>
			);
		}
	}
);