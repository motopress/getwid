/**
* Internal dependencies
*/
import Edit from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import attributes from './attributes';

import './style.scss';
import './editor.scss';


/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import render_style from 'GetwidUtils/render-style';

const { registerBlockType } = wp.blocks;
const { prepareGradientStyle, prepareBackgroundImageStyles, convertHorizontalAlignToStyle, convertVerticalAlignToStyle } = render_style;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-section';


/**
* Register the block
*/
registerBlockType( 'getwid/section', {
	title: __( 'Section', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13,0v24h11V0H13z M22,22h-7V2h7V22z"/><path d="M0,0v11h11V0H0z M9,9H2V2h7V9z"/><path d="M0,13v11h11V13H0z M9,22H2v-7h7V22z"/></svg>,		
	category: 'getwid-blocks',
	keywords: [
		__( 'container', 'getwid' ),
		__( 'wrapper'  , 'getwid' ),
		__( 'row'	   , 'getwid' ),
	],
	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],
        anchor: true
	},
	deprecated: [
		{
			attributes: attributes,     
			save: Save_deprecated
		}
	],	
	attributes,
	edit: props => (
		<Edit {...{
			...props,
			baseClass,
			prepareGradientStyle,
			prepareBackgroundImageStyles,
			convertHorizontalAlignToStyle,
			convertVerticalAlignToStyle
		}} key='edit'/>
	),
	save: Save
} );