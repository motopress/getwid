/**
* Internal dependencies
*/
import edit from './edit';
import './style.scss';
import attributes from './attributes';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const { registerBlockType } = wp.blocks;

//Click event
function insertLayout(){
	let block = wp.blocks.createBlock( 'getwid/template-library' );
	let waitLoadBlock;

	wp.data.dispatch( 'core/editor' ).insertBlocks( block );
	$(`[data-block='${block.clientId}'] .wp-block-getwid-template-library`).data( 'closeModal', true );

	waitLoadBlock = setInterval( () => {
		if ($(`[data-block='${block.clientId}'] .wp-block-getwid-template-library .open-modal-button`).length){
			$(`[data-block='${block.clientId}'] .wp-block-getwid-template-library .open-modal-button`).click();
			clearInterval(waitLoadBlock);
		}	
	}, 1);
}

//Add button to toolbar
function addToolbarButton(){
	$('.edit-post-header-toolbar').append(`<button id="getwid-layout-insert-button" class="components-button components-icon-button is-button is-default is-large">${ __( 'Templates Library', 'getwid' ) }</button>`);
	$(document).on('click', '#getwid-layout-insert-button', (e) => {
		insertLayout();
	});
}

//Ready toolbar
document.addEventListener("DOMContentLoaded", (e) => {
    addToolbarButton()
});

/**
* Register the block
*/
registerBlockType( 'getwid/template-library', {
	title: __( 'Templates Library', 'getwid' ),
	icon: 'category',
	category: 'getwid-blocks',
	keywords: [ ],
	supports: {
		// inserter: (Getwid.settings.post_type == Getwid.templates.name ? true : false), //Show Only on Templates page
		multiple: true,
		customClassName: false,
	},
	edit,
	attributes,
	save: () => {
		return null;
	}
} );