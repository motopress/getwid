import classnames from 'classnames';
import animate from '../../utils/animate';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component} = wp.element;
const $ = window.jQuery;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				// id,
				icon, style, link, hoverAnimation,
				primaryColor
			},
			prepareWrapperStyle,
			className,
		} = this.props;

		const iconHtml = <i
			className={icon}
			style={{
				color: primaryColor,
			}}
		></i>;

		const wrapperProps = {
			className: classnames('wp-block-getwid-icon__wrapper', {
				'getwid-animated': !! hoverAnimation
			}),
			style: prepareWrapperStyle(this.props.attributes),
			onMouseEnter: (e)=>this.onIconHoverIn(),
		};

		return (
			<div className={classnames(className, {
				[`${className}--stacked`]: style === 'stacked',
				[`${className}--framed`]: style === 'framed',
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
			animate(this.iconWrapper, hoverAnimation);
		}
	}

}
