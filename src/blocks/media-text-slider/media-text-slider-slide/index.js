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

const ALLOWED_BLOCKS = [ 'getwid/media-text-slider-slide-content' ];

const TEMPLATE = [
	['getwid/media-text-slider-slide-content' ]
];

import MyBlockContext from './../context';

// Register the block
registerBlockType( 'getwid/media-text-slider-slide', {
	title: __('Getwid Slider-slide', 'getwid'),
	description: __('@todo description', 'getwid'),
	icon: {	
		src: 'format-gallery',
	},	
	category: 'common',
	parent: [ 'getwid/media-text-slider' ],
	attributes: {
		id: {
			type: 'number',
			default: 1,
		},
		parent: {
			type: 'array',
		},	
	},
	getEditWrapperProps( attributes ) {
		return { 'data-slide': attributes.id };
	},
	edit: props => {
		console.warn(props);
		console.log('props from slider slide');
		const {
			attributes: {
				id,
				parent
			},
			className,
			setAttributes
		} = props;
		// setAttributes({parent});

		console.warn(props);

		// const { select, dispatch } = window.wp.data;

/*var child = select('core/editor').getBlocksByClientId(props.clientId);

		console.error(props.attributes.hello);

		setAttributes({hello: props.attributes.parent});*/


// console.log(child);

		//templateLock={ false }
		//templateLock="all"

// const MyBlockContext = wp.element.createContext();

		return (
			<Fragment>
				<div className={`${className}__content slide-${ id }`}>

<MyBlockContext.Consumer>
	{ ( value ) => {
		// console.log(arguments);
	/*	return (
		<div className='lolo4ka'>The value is: ${ value }</div>
	);*/
	}

	 }
</MyBlockContext.Consumer>

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
		console.log(props);
		// console.log('**');
		// const { id } = attributes;
		const {
			attributes: {id }
		} = props;
		const className = 'wp-block-getwid-media-text-slider-slide'

		return (
			<div className={`${className}__content-wrapper slide-${ id }`}>

				<MyBlockContext.Consumer>
					{ ( value ) => {
						// console.log(arguments);
					/*	return (
						<div className='lolo4ka'>The value is: ${ value }</div>
					);*/
					}

					 }
				</MyBlockContext.Consumer>

				<div className={`${className}__content`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
