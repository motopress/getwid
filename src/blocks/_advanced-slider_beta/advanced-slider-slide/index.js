import classnames from 'classnames';
const {__} = wp.i18n;
const {
	InnerBlocks,
} = wp.editor;
const {
	Fragment,
} = wp.element;
const {
	registerBlockType,
} = wp.blocks;
const TEMPLATE = [
	['core/media-text' ],
	/*['core/image' ],
	['core/heading' ],
	['core/paragraph' ],
	['core/button' ]*/
];

//slider-slide-content

// Register the block
registerBlockType( 'getwid/slider-slide-content', {
	title: __('Getwid Slide', 'getwid'),
	description: __('@todo description', 'getwid'),
	icon: {	
		src: 'format-image',
	},	
	category: 'getwid-blocks',
	parent: [ 'getwid/content-slider' ],
	attributes: {
		id: {
			type: 'number',
			default: 1,
		},
	},
	getEditWrapperProps( attributes ) {
		return { 'data-slide': attributes.id };
	},
	edit: props => {
		const { attributes: { id } } = props;
		return (
			<Fragment>
				<div className={classnames( `slide-content slide-${ id }` )} >
					<InnerBlocks
						templateLock={ false }
						template={ TEMPLATE }
					/>
				</div>
			</Fragment>
		);
	},

	save( { attributes } ) {
		const { id } = attributes;
		return (
			<div className={classnames( `slide-content slide-${ id }` )}>
				<div className={ 'slide-content-inner' } >
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
