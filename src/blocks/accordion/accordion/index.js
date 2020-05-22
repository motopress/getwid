/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import Accordion from './edit';
import attributes from './attributes';
import attributes_deprecated from './attributes_deprecated';
import Save_deprecated from './save_deprecated';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
const { SVG, Path } = wp.components;
const { createBlock } = wp.blocks;
// import { convertBlockFrom, convertBlockTo } from './transform-helper';
import Save from './save';

/**
* WordPress dependencies
*/
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-accordion';
const blockName = 'getwid/accordion';

/**
* Register the block
*/
export default registerBlockType(
    'getwid/accordion',
    {
        title: __( 'Accordion', 'getwid' ),
        icon: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><Path d="M0,0v6h24V0H0z M22,4H2V2h20V4z"/></g><g><Path d="M0,18v6h24v-6H0z M22,22H2v-2h20V22z"/></g><g><Path d="M0,8v8h24V8H0z M22,14H2v-4h20V14z"/></g></SVG>,
        category: 'getwid-blocks',
        supports: {
			align: [ 'wide', 'full' ],
			inserter: !Getwid.disabled_blocks.includes(blockName)
        },
        // transforms: {
		// 	from: [
        //         {
        //             type: 'block',
        //             blocks: [ 'core/gallery' ],
        //             transform: content => convertBlockFrom( content )
        //         },
        //         {
        //             type: 'block',
        //             isMultiBlock: true,
        //             blocks: [ 'core/image' ],
        //             transform: content => convertBlockFrom( content )
        //         },
        //         {
        //             type: 'block',
        //             blocks: [ 'getwid/images-stack' ],
        //             transform: content => convertBlockFrom( content )

        //         },
        //         {
        //             type: 'block',
        //             blocks: [ 'getwid/images-slider' ],
        //             transform: content => convertBlockFrom( content )
        //         }
        //     ],
		// 	to: [
		// 		{
        //             type: 'block',
        //             blocks: [ 'core/gallery' ],
        //             transform: () => (
        //                 convertBlockTo( 'core/gallery' )
        //             )
        //         },
        //         {
        //             type: 'block',
        //             blocks: [ 'core/image' ],
        //             transform: () => (
        //                 convertBlockTo( 'core/image' )
        //             )
        //         },
        //         {
        //             type: 'block',
        //             blocks: [ 'getwid/images-stack' ],
        //             transform: () => (
        //                 convertBlockTo( 'getwid/images-stack' )
        //             )
        //         },
        //         {
        //             type: 'block',
        //             blocks: [ 'getwid/images-slider' ],
        //             transform: () => (
        //                 convertBlockTo( 'getwid/images-slider' )
        //             )
        //         },
        //         {
        //             type: 'block',
        //             blocks: [ 'getwid/media-text-slider' ],
        //             transform: () => (
        //                 convertBlockTo( 'getwid/media-text-slider' )
        //             )
        //         }
		// 	]
		// },
        // keywords: [
        //     __( 'vertical', 'getwid' ),
        //     __( 'workflow', 'getwid' ),
		// ],
		deprecated: [{
			attributes: attributes_deprecated,
			// migrate( attributes ) {

			// 	debugger;

			// 	// const labels = JSON.parse( attributes.sliderArrays.replace( /u0022/g, '"' ) );

			// 	return {
			// 		...attributes,
			// 		// sliderArrays: JSON.stringify( times( attributes.slideCount, index => `${labels[ index ].text}` ) )
			// 	};
			// },


			migrate: function( attributes, innerBlocks ) {
				let accordions = [];
				$.each(attributes.items, function (i, el) {
					let obj = {};
					obj.content = el.content;
					obj.title = attributes.titles[i].content;
					accordions.push(obj);
				});
				debugger;

                return [
                    {
						align: attributes.align,
						active: attributes.active,
						iconPosition: attributes.iconPosition,
						iconOpen: attributes.iconOpen,
						iconClose: attributes.iconClose,
						headerTag: attributes.headerTag
					},
                    [
                        createBlock(
							'getwid/accordion', {},
							accordions.map(( item, index ) => {
								debugger;
								return createBlock(
									'getwid/accordion-item', {
										title: item.title,
									}, [
										createBlock( 'core/paragraph', { placeholder: __( 'Write heading…', 'getwid' ), content: item.content } )
									]
								);
							})
						),
                    ].concat( innerBlocks ),
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
            <Accordion {...{
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