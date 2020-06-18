/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import Toggle from './edit';
import attributes from './attributes';
import attributes_deprecated from './attributes_deprecated';
import Save_deprecated from './save_deprecated';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
const { SVG, Path } = wp.components;
const { select } = wp.data;
const { createBlock } = wp.blocks;
import Save from './save';

const { jQuery: $ } = window;

/**
* WordPress dependencies
*/
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-toggle';
const blockName = 'getwid/toggle';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/toggle',
    {
        title: __( 'Toggle', 'getwid' ),
        icon: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><Path d="M0,0v6h24V0H0z M22,4H2V2h20V4z"/></g><g><Path d="M0,18v6h24v-6H0z M22,22H2v-2h20V22z"/></g><g><Path d="M0,8v8h24V8H0z M22,14H2v-4h20V14z"/></g></SVG>,
        category: 'getwid-blocks',
        supports: {
			align: [ 'wide', 'full' ],
			inserter: !Getwid.disabled_blocks.includes(blockName)
        },
		deprecated: [{
			attributes: attributes_deprecated,
			migrate: function( attributes, innerBlocks ) {
                return [
                    {
						align: attributes.align,
						active: attributes.active,
						iconPosition: attributes.iconPosition,
						iconOpen: attributes.iconOpen,
						iconClose: attributes.iconClose,
						headerTag: attributes.headerTag
					},
                    attributes.items.map(( item, index ) => {
						return createBlock(
							'getwid/toggle-item', {
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
                    blocks: [ 'getwid/accordion' ],
                    transform: () => {
						const { getBlock, getSelectedBlockClientId } = select( 'core/editor' );

						const clientId = getSelectedBlockClientId();
						const attributes = getBlock( clientId ).attributes;
						const innerBlocks = getBlock( clientId ).innerBlocks;

						if ( innerBlocks.length ) {

							//Active
							let active = 'none';
							$.each( innerBlocks, ( index, item ) => {
								if (item.attributes.active){
									active = index;
									return false;
								}
							});

							return createBlock(
								'getwid/accordion', {
									align: attributes.align,
									active: active,
									iconPosition: attributes.iconPosition,
									iconOpen: attributes.iconOpen,
									iconClose: attributes.iconClose,
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
				{
                    type: 'block',
                    blocks: [ 'getwid/tabs' ],
                    transform: () => {
						const { getBlock, getSelectedBlockClientId } = select( 'core/editor' );

						const clientId = getSelectedBlockClientId();
						const attributes = getBlock( clientId ).attributes;
						const innerBlocks = getBlock( clientId ).innerBlocks;

						if ( innerBlocks.length ) {

							//Active
							let active = 0;
							$.each( innerBlocks, ( index, item ) => {
								if (item.attributes.active){
									active = index;
									return false;
								}
							});

							return createBlock(
								'getwid/tabs', {
									align: attributes.align,
									active: active,
								},
								innerBlocks.map( (innerItem, index) => {
									return createBlock(
										'getwid/tabs-item', {
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
        getEditWrapperProps( attributes ) {
            const { align } = attributes;
            if ( [ 'wide', 'full' ].includes( align ) ) {
                return { 'data-align': align };
            }
        },
        attributes: attributes,
		...checkDisableBlock(blockName, props => (
            <Toggle {...{
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