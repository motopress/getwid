/**
* External dependencies
*/
import classnames from 'classnames';
import animate from 'GetwidUtils/animate';


/**
* WordPress dependencies
*/
const {__} = wp.i18n;
const {Component} = wp.element;
const {compose} = wp.compose;
const {
	withColors
} = wp.editor;
const $ = window.jQuery;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-icon';


/**
* Create an Component
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
				iconStyle,
				link,
				hoverAnimation,
				textAlignment
			},
			prepareWrapperStyle,
			className,
			setBackgroundColor,
			setTextColor,
			
			backgroundColor,
			textColor,
		} = this.props;

		const iconHtml = <i
			className={icon}
		></i>;

		const wrapperStyle = {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		};

		const wrapperProps = {
			className: classnames(
				`${baseClass}__wrapper`,
			{				
				'getwid-animation': !! hoverAnimation,
				'has-background': (backgroundColor.color) && 'stacked' == iconStyle,
				[ backgroundColor.class ]: (backgroundColor.class) && 'stacked' == iconStyle,
				'has-text-color': textColor.color,
				[ textColor.class ]: textColor.class,
			}),
			style: prepareWrapperStyle(this.props, 'edit'),
			'data-animation': hoverAnimation ? hoverAnimation : undefined,
			onMouseEnter: (e)=>this.onIconHoverIn(),
		};

		return (
			<div style={wrapperStyle} className={classnames(
				className,
			{
				[`has-layout-stacked`]: iconStyle === 'stacked',
				[`has-layout-framed`]: iconStyle === 'framed',

				[`is-aligned-${textAlignment}`]: undefined !== textAlignment,
			})}
			>
				{link && (
					<a href={link}
					   {...wrapperProps}
						// Prevent leaving edit page by icon click
						onClick={(e)=>e.preventDefault()}
					>
						{iconHtml}
					</a>
				)}
				{!link && (
					<div {...wrapperProps} >
						{iconHtml}
					</div>
				)}
			</div>
		);
	}

	setupIconWrapper(){
		const {
			clientId
		} = this.props;

		this.iconWrapper = $(`[data-block='${clientId}'] .wp-block-getwid-icon__wrapper`);
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