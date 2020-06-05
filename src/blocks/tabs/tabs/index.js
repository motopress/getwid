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
								createBlock( 'core/paragraph', { placeholder: __( 'Write title…', 'getwid' ), content: item.content } )
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
        getEditWrapperProps( attributes ) {
            const { align } = attributes;
            if ( [ 'wide', 'full' ].includes( align ) ) {
                return { 'data-align': align };
            }
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