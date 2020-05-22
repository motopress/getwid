/**
* Internal dependencies
*/
import attributes from './attributes';
import Edit from './edit';
import save from './save.js';
import {checkDisableBlock} from 'GetwidUtils/help-functions';

import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

const { SVG, Path } = wp.components;
const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const blockName = 'getwid/accordion';

/**
* Register the block
*/
registerBlockType('getwid/accordion', {
	title: __('Accordion', 'getwid'),
	icon: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><Path d="M0,0v6h24V0H0z M22,4H2V2h20V4z"/></g><g><Path d="M0,18v6h24v-6H0z M22,22H2v-2h20V22z"/></g><g><Path d="M0,8v8h24V8H0z M22,14H2v-4h20V14z"/></g></SVG>,
	category: 'getwid-blocks',
	keywords: [
		__('toggle', 'getwid')
	],
	supports: {
		align: [ 'wide', 'full' ],
		inserter: !Getwid.disabled_blocks.includes(blockName)
	},
	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'getwid/toggle' ],
				transform: ( attributes ) => createBlock( 'getwid/toggle', attributes )
			},
			{
				type: 'block',
				blocks: [ 'getwid/tabs' ],
				transform: ( attributes ) => createBlock( 'getwid/tabs', attributes )
			},
		],
	},
	attributes: attributes,
	...checkDisableBlock(blockName, Edit),
	save
});