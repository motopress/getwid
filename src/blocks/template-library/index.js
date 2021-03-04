/**
* Internal dependencies
*/
import Edit from './edit';
import './style.scss';
import attributes from './attributes';
import {checkDisableBlock} from 'GetwidUtils/help-functions';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const blockName = 'getwid/template-library';

//Click event
function insertLayout(){
	let block = wp.blocks.createBlock( 'getwid/template-library' );
	let waitLoadBlock;

	wp.data.dispatch( 'core/block-editor' ).insertBlocks( block );
	$(`[data-block='${block.clientId}'] .wp-block-getwid-template-library`).data( 'closeModal', true );

	waitLoadBlock = setInterval( () => {
		if ($(`[data-block='${block.clientId}'] .wp-block-getwid-template-library .open-modal-button`).length){
			$(`[data-block='${block.clientId}'] .wp-block-getwid-template-library .open-modal-button`).click();
			clearInterval(waitLoadBlock);
		}
	}, 1);
}

//Add button to toolbar
function addToolbarButton() {
	setTimeout( () => {
		if ( $('.edit-post-header-toolbar').length ) {
			$('.edit-post-header-toolbar').after(`<button id="getwid-layout-insert-button" type="button" data-toolbar-item="true"  class="components-button">${ __( 'Template Library', 'getwid' ) }</button>`);

			$(document).on('click', '#getwid-layout-insert-button', (e) => {
				insertLayout();
			} );
		}
	}, 99 );
}

//Ready toolbar
if ( ! Getwid.disabled_blocks.includes(blockName) ) {
	document.addEventListener( 'DOMContentLoaded', addToolbarButton );
}

/**
* Register the block
*/
registerBlockType( 'getwid/template-library', {
	title: __( 'Template Library', 'getwid' ),
	icon: 'category',
	category: 'getwid-blocks',
	keywords: [ ],
	supports: {
		inserter: !Getwid.disabled_blocks.includes(blockName),
		multiple: true,
		customClassName: false,
	},
	...checkDisableBlock(blockName, Edit),
	attributes,
	save: () => {
		return null;
	}
} );
