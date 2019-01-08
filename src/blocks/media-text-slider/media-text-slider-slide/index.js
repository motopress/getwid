import classnames from 'classnames';
import render_style from 'GetwidUtils/render-style';
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

const ALLOWED_BLOCKS = [ 'getwid/media-text-slider-slide-content' ];

const TEMPLATE = [
	['getwid/media-text-slider-slide-content' ]
];

import {SliderContext} from './../context';

// Register the block
registerBlockType( 'getwid/media-text-slider-slide', {
	title: __('Getwid Slider-slide', 'getwid'),
	description: __('@todo description', 'getwid'),
	icon: {	
		src: 'format-gallery',
	},	
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
	edit: props => {
		const {
			attributes: {
				id,
				outerParent
			},
			className,
			setAttributes
		} = props;

		//Render edit
		const renderEdit = () => {

			const contentStyle = {
				paddingTop : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingTop != 'undefined' ? outerParent.attributes.paddingTop : null),
				paddingBottom : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingBottom != 'undefined' ? outerParent.attributes.paddingBottom : null),
				paddingLeft : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingLeft != 'undefined' ? outerParent.attributes.paddingLeft : null),
				paddingRight : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingRight != 'undefined' ? outerParent.attributes.paddingRight : null),
				justifyContent : (typeof outerParent != 'undefined' && typeof outerParent.attributes.horizontalAlign != 'undefined' ? convertHorizontalAlignToStyle(outerParent.attributes.horizontalAlign) : null),
				alignItems : (typeof outerParent != 'undefined' && typeof outerParent.attributes.verticalAlign != 'undefined' ? convertVerticalAlignToStyle(outerParent.attributes.verticalAlign) : null),
                minHeight : (typeof outerParent != 'undefined' && typeof outerParent.attributes.minHeight != 'undefined' ? outerParent.attributes.minHeight : null),
			};

			const contentInnerWrapperStyle = {
                maxWidth : (typeof outerParent != 'undefined' && typeof outerParent.attributes.contentMaxWidth != 'undefined' ? outerParent.attributes.contentMaxWidth : '80%'),
				width: '100%',
			};

			return (
				<Fragment>
					<div className={`${className}__content-wrapper slide-${ id }`}>
			
						<div style={contentStyle} className={`${className}__content`}>
							<div style={contentInnerWrapperStyle}>
								<InnerBlocks
									templateLock="all"
									template={ TEMPLATE }
									templateInsertUpdatesSelection={false}
									allowedBlocks={ ALLOWED_BLOCKS }
								/>
							</div>
						</div>
					
					</div>
				</Fragment>
			);
		};
		//--Render edit

		return (	
			<Fragment>
				<SliderContext.Consumer>
					{ ( value ) => 	{ if (value) setAttributes({outerParent : value}) } }
				</SliderContext.Consumer>

				{renderEdit()}

			</Fragment>
		);
	},
	save: props => {
		const {
			attributes: {
				id,
				outerParent
			}
		} = props;
		const className = 'wp-block-getwid-media-text-slider-slide';

		const contentStyle = {
			paddingTop : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingTop != 'undefined' ? outerParent.attributes.paddingTop : null),
			paddingBottom : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingBottom != 'undefined' ? outerParent.attributes.paddingBottom : null),
			paddingLeft : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingLeft != 'undefined' ? outerParent.attributes.paddingLeft : null),
			paddingRight : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingRight != 'undefined' ? outerParent.attributes.paddingRight : null),
			justifyContent : (typeof outerParent != 'undefined' && typeof outerParent.attributes.horizontalAlign != 'undefined' ? convertHorizontalAlignToStyle(outerParent.attributes.horizontalAlign) : null),
			alignItems : (typeof outerParent != 'undefined' && typeof outerParent.attributes.verticalAlign != 'undefined' ? convertVerticalAlignToStyle(outerParent.attributes.verticalAlign) : null),
		};

		const contentWrapperStyle = {
			minHeight : (typeof outerParent != 'undefined' && typeof outerParent.attributes.minHeight != 'undefined' ? outerParent.attributes.minHeight : null),
		};

		return (
			<div style={contentWrapperStyle} className={`${className}__content-wrapper slide-${ id }`}>

				<div style={contentStyle} className={`${className}__content`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
