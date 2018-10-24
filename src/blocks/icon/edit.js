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
				id, icon, style, link, hoverAnimation
			},
			clientId,
			className,
			prepareCSS
		} = this.props;

		const css = prepareCSS(className, this.props.attributes);
		const iconHtml = <i
			className={icon}
		></i>;

		const wrapperProps = {
			className: classnames('wp-block-getwid-icon__wrapper', {
				'getwid-animated': !! hoverAnimation
			}),
			onMouseEnter: (e)=>this.onIconHoverIn(),
		};

		return (
			<div className={classnames(className, {
				[`${className}--stacked`]: style === 'stacked',
				[`${className}--framed`]: style === 'framed',
				[`${className}-${id}`]: true,
			})}
			>
				{css && (
					<style>
						{css}
					</style>
				)}
				{link && (
					<a href={link}
					   // Prevent leaving edit page by icon click
					   target="_blank"
					   {...wrapperProps}
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
