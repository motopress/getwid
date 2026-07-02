/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import Tabs from './edit';
import attributes from './attributes';
import attributes_deprecated from './attributes_deprecated';
import Save_deprecated from './save_deprecated';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
const { SVG, Path } = wp.components;
const { select } = wp.data;
const { createBlock } = wp.blocks;
import Save from './save';

/**
* WordPress dependencies
*/
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-tabs';
const blockName = 'getwid/tabs';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/tabs',
    {
        title: __( 'Tabs', 'getwid' ),
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,2H10V0H0V24H24V2ZM10,4h5V6H10ZM22,22H2V2H8V8H22ZM22,6H17V4h5Z"/></svg>,
        category: 'getwid-blocks',
        supports: {
			align: [ 'wide', 'full' ],
			inserter: !Getwid.disabled_blocks.includes(blockName)
		},
		getEditWrapperProps(attributes) {
			const { align } = attributes;
			if ( [ 'wide', 'full' ].includes( align ) ) {
				return { 'data-align': align };
			}
		},
		deprecated: [{
			attributes: attributes_deprecated,
			migrate: function( attributes, innerBlocks ) {
                return [
                    {
						align: attributes.align,
						active: attributes.active,
						type: attributes.iconPosition,
						headerTag: attributes.headerTag
					},
                    attributes.items.map(( item, index ) => {
						return createBlock(
							'getwid/tabs-item', {
								title: attributes.titles[index].content,
							}, [
								createBlock( 'core/paragraph', { placeholder: __( 'Write heading…', 'getwid' ), content: item.content } )
							]
						);
					}),
                ];
            },
			save: props => (
				<Save_deprecated {...{
					...props,
					baseClass
				}}/>
			)
		}],
		transforms: {
			to: [
				{
                    type: 'block',
                    blocks: [ 'getwid/toggle' ],
                    transform: () => {
						const { getBlock, getSelectedBlockClientId } = select( 'core/block-editor' );

						const clientId = getSelectedBlockClientId();
						const attributes = getBlock( clientId ).attributes;
						const innerBlocks = getBlock( clientId ).innerBlocks;

						if ( innerBlocks.length ) {
							return createBlock(
								'getwid/toggle', {
									align: attributes.align,
									headerTag: attributes.headerTag,
								},
								innerBlocks.map( (innerItem, index) => {
									return createBlock(
										'getwid/toggle-item', {
											title: innerItem.attributes.title,
											active: index == parseInt(attributes.active, 10) ? true : false
										},
										innerItem.innerBlocks
									)
								} )
							);
						}
					}
				},
				{
                    type: 'block',
                    blocks: [ 'getwid/accordion' ],
                    transform: () => {
						const { getBlock, getSelectedBlockClientId } = select( 'core/block-editor' );

						const clientId = getSelectedBlockClientId();
						const attributes = getBlock( clientId ).attributes;
						const innerBlocks = getBlock( clientId ).innerBlocks;

						if ( innerBlocks.length ) {
							return createBlock(
								'getwid/accordion', {
									align: attributes.align,
									active: attributes.active,
									headerTag: attributes.headerTag,
								},
								innerBlocks.map( (innerItem, index) => {
									return createBlock(
										'getwid/accordion-item', {
											title: innerItem.attributes.title,
										},
										innerItem.innerBlocks
									)
								} )
							);
						}
					}
                },
			]
		},
        attributes: attributes,
		...checkDisableBlock(blockName, props => (
            <Tabs {...{
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
