/**
* Internal dependencies
*/
import attributes from './attributes';
import edit from './edit';
import save from './save';

import './style.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { registerBlockType, createBlock } = wp.blocks;
const { select } = wp.data;

/**
* Register the block
*/
registerBlockType('getwid/button-group', {
	title: __( 'Button Group', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,3v6H2V3H22 M24,1H0v10h24V1L24,1z"/><g><rect x="4" y="5" width="16" height="2"/></g><path d="M22,15v6H2v-6H22 M24,13H0v10h24V13L24,13z"/><g><rect x="4" y="17" width="16" height="2"/></g></svg>,
	category: 'getwid-blocks',
	keywords: [
	],
	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'core/button' ],
				transform: ( attributes ) => {
					const clientId = select('core/editor').getSelectedBlockClientId();
					const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;	
					let inner_attributes = [];

					 if (innerBlocksArr.length){
						jQuery.each(innerBlocksArr, (index, item) => {

							if (item.attributes.text != ''){
								inner_attributes.push({
									text: item.attributes.text,
									url: item.attributes.url,
								});
							}
						});
					}

					return inner_attributes.map( ( { text, url } ) => createBlock( 'core/button', {
						text,
						url,
					} ) );
				}
			}
		]
	},
	attributes,
	edit,
	save
});