import classnames from 'classnames';
import animate from 'GetwidUtils/animate';
import './editor.scss';
import './style.scss'

/**
 * Internal block libraries
 */
const {__} = wp.i18n;

const {compose} = wp.compose;

const {
    RichText,
    BlockControls,
    InnerBlocks,
    AlignmentToolbar,
    withColors
} = wp.editor;

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
				// id,
				image,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				textAlignment,
				layout,
				imagePosition,
				imageStyle,
				link,
				hoverAnimation
			},
			prepareWrapperStyle,
			className,
			setBackgroundColor,
			setTextColor,

			baseClass,
			isSelected,

			backgroundColor,
			textColor,	
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
			'wp-block-getwid-image-box__image-container--stacked': imageStyle === 'stacked',
			'wp-block-getwid-image-box__image-container--framed': imageStyle === 'framed',
			'wp-block-getwid-image-box__image-container--position-top': imagePosition === 'top',
			'wp-block-getwid-image-box__image-container--position-middle': imagePosition === 'middle',
			'wp-block-getwid-image-box__image-container--position-bottom': imagePosition === 'bottom',
		});

		const imageHTML = image ? (<img src={ image.url } alt={(typeof image.alt != 'undefined' ? image.alt : null)} className= {`${className}__image` }/>) : null;

		const wrapperStyle = {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		};

		const imageWrapperProps = {
			className: classnames('wp-block-getwid-image-box__image-wrapper', {				
				'has-background': (backgroundColor.color) && 'stacked' == imageStyle,
				[ backgroundColor.class ]: (backgroundColor.class) && 'stacked' == imageStyle,
				'has-text-color': textColor.color,
				[ textColor.class ]: textColor.class,				
			}),
			style: prepareWrapperStyle(this.props, 'edit'),			
		};

		return (
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
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( Edit );