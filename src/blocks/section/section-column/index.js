/**
* Internal dependencies
*/
import attributes from './attributes';
import GetwidAdvancedColumn from './edit';

//import './style.scss';
import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-section-advanced-column';

/**
* Register the block
*/
registerBlockType( 'getwid/advanced-column', {
	title: __( 'Section Column', 'getwid' ),
	icon: 'editor-table',
	category: 'getwid-blocks',
	parent: [ 'getwid/section' ],
	keywords: [
		__( 'column', 'getwid' ),
		__( 'layout', 'getwid' ),
		__( 'row'	, 'getwid' )
	],
	supports: {
		inserter: false,
		align: [ 'wide', 'full' ],
		reusable: false,
		html: false
	},
	attributes,
	edit: props => (
		<GetwidAdvancedColumn {...{
			...props,
			baseClass
		}} />
	),
	save: () => { return null; }
} );