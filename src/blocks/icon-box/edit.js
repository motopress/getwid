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
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				icon,
				textAlignment,
				layout,
				iconPosition,
				iconStyle,
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
				[`${className}--icon-left`]: 'left' === layout,
				[`${className}--icon-right`]: 'right' === layout,

				[`${className}--text-left`]: 'left' === textAlignment,
				[`${className}--text-center`]: 'center' === textAlignment,
				[`${className}--text-right`]: 'right' === textAlignment,
				'is-selected': isSelected
			}),
			onMouseEnter: (e)=>this.onIconHoverIn(),
		};

		const iconContainerProps = classnames('wp-block-getwid-icon-box__icon-container', {
			'wp-block-getwid-icon-box__icon-container--stacked': iconStyle === 'stacked',
			'wp-block-getwid-icon-box__icon-container--framed': iconStyle === 'framed',
			'wp-block-getwid-icon-box__icon-container--position-top': iconPosition === 'top',
			'wp-block-getwid-icon-box__icon-container--position-middle': iconPosition === 'middle',
			'wp-block-getwid-icon-box__icon-container--position-bottom': iconPosition === 'bottom',
		});

		const iconHtml = <i
			className={icon}
		></i>;

		const wrapperStyle = {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		};

		const iconWrapperProps = {
			className: classnames('wp-block-getwid-icon-box__icon-wrapper', {				
				'has-background': (backgroundColor.color) && 'stacked' == iconStyle,
				[ backgroundColor.class ]: (backgroundColor.class) && 'stacked' == iconStyle,
				'has-text-color': textColor.color,
				[ textColor.class ]: textColor.class,				
			}),
			style: prepareWrapperStyle(this.props, 'edit'),			
		};

		return (
			<div {...wrapperProps}>
				<div style={wrapperStyle} className={iconContainerProps}>
					{link && (
						<a href={link}
						   {...iconWrapperProps}
							// Prevent leaving edit page by icon click
							onClick={(e)=>e.preventDefault()}
						>
							{iconHtml}
						</a>
					)}
					{!link && (
						<div {...iconWrapperProps} >
							{iconHtml}
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

	setupIconWrapper(){
		const {
			clientId
		} = this.props;

		this.iconWrapper = $(`[data-block='${clientId}'] .wp-block-getwid-icon-box__icon-wrapper`);
	}

	componentDidMount(){
		this.setupIconWrapper();
	}

	componentDidUpdate(prevProps){
		this.setupIconWrapper();
	}

	onIconHoverIn(){
		const {
			attributes: {
				hoverAnimation
			},
		} = this.props;

		if (hoverAnimation) {
			animate(this.iconWrapper, {
				animation: hoverAnimation
			});
		}
	}

}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( Edit );