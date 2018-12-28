import classnames from 'classnames';
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

		return (	
			<Fragment>
				<SliderContext.Consumer>
					{ ( value ) => 
						{
							console.warn('EDIT SLIDE');
							console.warn(value);
							if (value){setAttributes({outerParent : value})}
						}
					}
				</SliderContext.Consumer>

				<div className={`${className}__content slide-${ id }`}>
		
					<InnerBlocks
						templateLock="all"
						template={ TEMPLATE }
						allowedBlocks={ ALLOWED_BLOCKS }
					/>
				
				</div>
			</Fragment>
		);
	},
	save: props => {
		console.warn('SAVE SLIDE');
		console.warn(props);
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
			paddingRight : (typeof outerParent != 'undefined' && typeof outerParent.attributes.paddingRight != 'undefined' ? outerParent.attributes.paddingRight : null)
		};

		return (
			<div className={`${className}__content-wrapper slide-${ id }`}>

				<div style={contentStyle} className={`${className}__content`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
