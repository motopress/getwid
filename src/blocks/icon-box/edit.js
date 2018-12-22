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
const ALLOWED_BLOCKS = [ 'core/button', 'core/paragraph', 'core/heading', 'core/list' ];
const TEMPLATE = [
    [ 'core/heading', { level: 3, placeholder: __('Enter Tiltle here...', 'getwid'), content: __('Tiltle', 'getwid') } ],
    [ 'core/paragraph', { placeholder: __('Enter Text here...', 'getwid'), content: __('Text', 'getwid') } ],
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

		const wrapperProps = classnames( className, {
			[`${className}--icon-left`]: 'left' === layout,
			[`${className}--icon-right`]: 'right' === layout,

			[`${className}--text-left`]: 'left' === textAlignment,
			[`${className}--text-center`]: 'center' === textAlignment,
			[`${className}--text-right`]: 'right' === textAlignment,
			'is-selected': isSelected
		} );

		const iconContainerProps = classnames('wp-block-getwid-icon-box__container', {
			'wp-block-getwid-icon-box__container--stacked': iconStyle === 'stacked',
			'wp-block-getwid-icon-box__container--framed': iconStyle === 'framed',
			'wp-block-getwid-icon-box__container--position-top': iconPosition === 'top',
			'wp-block-getwid-icon-box__container--position-middle': iconPosition === 'middle',
			'wp-block-getwid-icon-box__container--position-bottom': iconPosition === 'bottom',
		});

		const iconHtml = <i
			className={icon}
			style={{
				color: textColor.color,
			}}
		></i>;

		const iconWrapperProps = {
			className: classnames('wp-block-getwid-icon-box__wrapper', {
				'getwid-anim': !! hoverAnimation,
				'has-background': backgroundColor.color,
				[ backgroundColor.class ]: backgroundColor.class,
				'has-text-color': textColor.color,
				[ textColor.class ]: textColor.class,				
			}),
			style: prepareWrapperStyle(this.props, 'edit'),
			onMouseEnter: (e)=>this.onIconHoverIn(),
		};

		return (
			<div className={wrapperProps}>
				<div className={iconContainerProps}>
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

		this.iconWrapper = $(`[data-block='${clientId}'] .wp-block-getwid-icon-box__wrapper`);
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