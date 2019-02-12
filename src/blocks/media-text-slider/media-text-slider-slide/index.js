import classnames from 'classnames';
import render_style from 'GetwidUtils/render-style';
import edit from './edit';
// import save from './save';

const {
	prepareGradientStyle,
	prepareBackgroundImageStyles,
	convertHorizontalAlignToStyle,
	convertVerticalAlignToStyle
} = render_style;

const {__} = wp.i18n;
const {
	InnerBlocks,
} = wp.editor;

const {
	select,
	dispatch,
	withSelect,
} = wp.data;

const {
	Fragment,
} = wp.element;

const {
	registerBlockType,
} = wp.blocks;

// Register the block
registerBlockType( 'getwid/media-text-slider-slide', {
	title: __('Slider - Slide', 'getwid'),
	icon: {	
		src: 'format-gallery',
	},
	keywords: [
		__('Getwid', 'getwid')
	],	
	category: 'getwid-blocks',
	parent: [ 'getwid/media-text-slider' ],
	attributes: {
		id: {
			type: 'number',
			default: 1,
		},	
		outerParent: {
			type: 'object',
		},	
	},
	getEditWrapperProps( attributes ) {
		return { 'data-slide': attributes.id };
	},
	edit,
	save: () => {
		return(
			<Fragment>
				<div>SAVE</div>
			</Fragment>
			);
	},
} );
