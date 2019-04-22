/**
* External dependencies
*/
import classnames from 'classnames';
import animate from 'GetwidUtils/animate';
import './editor.scss';
import './style.scss'


/**
* WordPress dependencies
*/
const {compose} = wp.compose;
const {
    InnerBlocks,
    withColors
} = wp.editor;
const {Component} = wp.element;
const $ = window.jQuery;


/**
* Module Constants
*/
const TEMPLATE = [
    [ 'core/heading', { level: 3, placeholder: __('Write heading…', 'getwid') } ],
    [ 'core/paragraph', { placeholder: __('Write text…', 'getwid') } ],
];
const baseClass = 'wp-block-getwid-icon-box';


/**
* Create an Inspector Controls
*/
class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
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

			isSelected,

			backgroundColor,
			textColor,	
		} = this.props;

		const wrapperProps = {
			className: classnames( className, {
				'getwid-animation': !! hoverAnimation,
				[`has-icon-left`]: 'left' === layout,
				[`has-icon-right`]: 'right' === layout,

				[`has-text-left`]: 'left' === textAlignment,
				[`has-text-center`]: 'center' === textAlignment,
				[`has-text-right`]: 'right' === textAlignment,
				'is-selected': isSelected
			}),
            'data-animation': hoverAnimation ? hoverAnimation : undefined,
			onMouseEnter: (e)=>this.onIconHoverIn(),
		};

		const iconContainerProps = classnames(
			`${baseClass}__icon-container`,
		{
			'has-layout-stacked': iconStyle === 'stacked',
			'has-layout-framed': iconStyle === 'framed',
			'is-position-top': iconPosition === 'top',
			'is-position-middle': iconPosition === 'middle',
			'is-position-bottom': iconPosition === 'bottom',
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
			className: classnames(
				`${baseClass}__icon-wrapper`,
			{				
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

				<div className={`${baseClass}__content`}>
					<InnerBlocks
						template={ TEMPLATE }
						templateInsertUpdatesSelection={ false }
						templateLock={ false }
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