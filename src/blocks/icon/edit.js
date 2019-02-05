import classnames from 'classnames';
import animate from 'GetwidUtils/animate';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component} = wp.element;
const {compose} = wp.compose;

const {
	withColors
} = wp.editor;

const $ = window.jQuery;

/**
 * Create an Inspector Controls wrapper Component
 */

class Edit extends Component {

	constructor() {
		super(...arguments);

		console.log(Getwid.settings.iconList);
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
			className: classnames('wp-block-getwid-icon__wrapper', {				
				'has-background': (backgroundColor.color) && 'framed' != iconStyle,
				[ backgroundColor.class ]: (backgroundColor.class) && 'framed' != iconStyle,
				'has-text-color': textColor.color,
				[ textColor.class ]: textColor.class,
			}),
			style: prepareWrapperStyle(this.props, 'edit'),
		};

		const containerProps = {
			'data-animation': hoverAnimation ? hoverAnimation : undefined,
			onMouseEnter: (e)=>this.onIconHoverIn(),
		};

		return (
			<div style={wrapperStyle} {...containerProps} className={classnames(className, {
				'getwid-anim': !! hoverAnimation,
				[`${className}--stacked`]: iconStyle === 'stacked',
				[`${className}--framed`]: iconStyle === 'framed',

				[`${className}--icon-left`]: 'left' === textAlignment,
				[`${className}--icon-center`]: 'center' === textAlignment,
				[`${className}--icon-right`]: 'right' === textAlignment,				
				// [`${className}-${id}`]: true,
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

		this.iconWrapper = $(`[data-block='${clientId}'] .wp-block-getwid-icon`);
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