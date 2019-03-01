import classnames from 'classnames';
import animate from 'GetwidUtils/animate';
import './editor.scss';
import './style.scss'
import Inspector from './inspector';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;

const {compose} = wp.compose;

const {
    InnerBlocks,
} = wp.editor;

const {
	withSelect
} = wp.data;

const {Component, Fragment} = wp.element;
const $ = window.jQuery;

/**
 * Constants
 */
const ALLOWED_BLOCKS = [ 'core/button', 'core/paragraph', 'core/heading', 'core/list', 'core/spacer', 'core/separator', 'core/image' ];
const TEMPLATE = [
    [ 'core/heading', { level: 3, placeholder: __('Enter title here...', 'getwid'), content: __('Default title', 'getwid') } ],
    [ 'core/paragraph', { placeholder: __('Enter text here...', 'getwid'), content: __('Default text', 'getwid') } ],
];

/**
 * Create an Inspector Controls wrapper Component
 */
class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				imageSize,
				id,
				url,
				alt,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				textAlignment,
				layout,
				imagePosition,
				link,
				hoverAnimation
			},
			className,
			isSelected,
			setAttributes,
			changeImageSize
		} = this.props;

		const wrapperProps = {
			className: classnames( className, {
				'getwid-animation': !! hoverAnimation,
				[`${className}--image-left`]: 'left' === layout,
				[`${className}--image-right`]: 'right' === layout,

				[`${className}--text-left`]: 'left' === textAlignment,
				[`${className}--text-center`]: 'center' === textAlignment,
				[`${className}--text-right`]: 'right' === textAlignment,
				'is-selected': isSelected
			}),
            'data-animation': hoverAnimation ? hoverAnimation : undefined,
			onMouseEnter: (e)=>this.onimageHoverIn(),
		};

		const imageContainerProps = classnames('wp-block-getwid-image-box__image-container', {
			'wp-block-getwid-image-box__image-container--position-top': imagePosition === 'top',
			'wp-block-getwid-image-box__image-container--position-middle': imagePosition === 'middle',
			'wp-block-getwid-image-box__image-container--position-bottom': imagePosition === 'bottom',
		});

		const imageHTML = url ? (<img src={ url } alt={(typeof alt != 'undefined' ? alt : null)} className= {`${className}__image` }/>) : null;

		const wrapperStyle = {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		};

		const imageWrapperProps = {
			className: classnames(
				'wp-block-getwid-image-box__image-wrapper',
			),
		};

		return (
			<Fragment>
				{ !! url && (
					<Inspector {...{ setAttributes, ...this.props, changeImageSize }} key='inspector'/>
				) }			
				<div {...wrapperProps}>

					<div style={wrapperStyle} className={imageContainerProps}>
						{link && (
							<a href={link}
							{...imageWrapperProps}
								// Prevent leaving edit page by image click
								onClick={(e)=>e.preventDefault()}
							>
								{imageHTML}
							</a>
						)}
						{!link && (
							<div {...imageWrapperProps} >
								{imageHTML}
							</div>
						)}
					</div>

					<div className={`${className}__content`}>
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ TEMPLATE }
						/>
					</div>
				</div>
			</Fragment>
		);
	}

	setupimageWrapper(){
		const {
			clientId
		} = this.props;

		this.imageWrapper = $(`[data-block='${clientId}'] .wp-block-getwid-image-box__image-wrapper`);
	}

	componentDidMount(){
		this.setupimageWrapper();
	}

	componentDidUpdate(prevProps){
		this.setupimageWrapper();
	}

	onimageHoverIn(){
		const {
			attributes: {
				hoverAnimation
			},
		} = this.props;

		if (hoverAnimation) {
			animate(this.imageWrapper, {
				animation: hoverAnimation
			});
		}
	}

}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { id } = props.attributes;

		if (typeof id !='undefined'){
			return {
				imgObj: id ? getMedia( id ) : null,
			};
		}
	} ),
] )( Edit );