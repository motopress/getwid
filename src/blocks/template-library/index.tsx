import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	registerBlockType,
	type BlockConfiguration,
} from '@wordpress/blocks';
import { dispatch, subscribe } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import Edit from './edit';
import { markToolbarInsertedBlock } from './state';
import type { TemplateLibraryAttributes } from './types';

import './style.scss';

const blockName = 'getwid/template-library';
let toolbarTimer: ReturnType< typeof setTimeout > | undefined;

function insertLayout() {
	const block = createBlock( blockName );

	markToolbarInsertedBlock( block.clientId );
	dispatch( blockEditorStore ).insertBlocks( [ block ] );
}

function ensureToolbarButton() {
	if ( document.getElementById( 'getwid-layout-insert-button' ) ) {
		return;
	}

	const toolbar = document.querySelector(
		'.edit-post-header-toolbar__left, .editor-document-tools__left'
	);

	if ( ! toolbar ) {
		return;
	}

	const button = document.createElement( 'button' );
	button.id = 'getwid-layout-insert-button';
	button.type = 'button';
	button.ariaExpanded = 'false';
	button.dataset.toolbarItem = 'true';
	button.className = 'components-button';
	button.textContent = __( 'Template Library', 'getwid' );
	button.addEventListener( 'click', insertLayout );
	toolbar.append( button );
}

function addToolbarButton() {
	ensureToolbarButton();

	subscribe( () => {
		if ( toolbarTimer ) {
			clearTimeout( toolbarTimer );
		}

		toolbarTimer = setTimeout( ensureToolbarButton, 100 );
	} );
}

const getwidGlobal = (
	window as Window & {
		Getwid?: { disabled_blocks?: string[] };
	}
 ).Getwid;

if ( ! getwidGlobal?.disabled_blocks?.includes( blockName ) ) {
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', addToolbarButton, {
			once: true,
		} );
	} else {
		addToolbarButton();
	}
}

registerBlockType(
	metadata as BlockConfiguration< TemplateLibraryAttributes >,
	{
		title: __( 'Template Library', 'getwid' ),
		edit: MaybeBlockIsDisabled( blockName ) || Edit,
		save: () => null,
	}
);
