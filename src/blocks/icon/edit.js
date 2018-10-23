import classnames from 'classnames';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component} = wp.element;

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
				id, icon, style, link,
			},
			className,
			prepareCSS
		} = this.props;

		const css = prepareCSS(className, this.props.attributes);
		const iconHtml = <i
			className={icon}
		></i>;

		return (
			<div className={classnames(className, {
				[`${className}--stacked`]: style === 'stacked',
				[`${className}--framed`]: style === 'framed',
				[`${className}-${id}`]: true
			})}
			>
				{css && (
					<style>
						{css}
					</style>
				)}
				{link && (
					<a href={link}
					   target="_blank"
					   className="wp-block-getwid-icon__wrapper"
					>
						{iconHtml}
					</a>
				)}
				{!link && (
					<div
						className="wp-block-getwid-icon__wrapper"
					>
						{iconHtml}
					</div>
				)}
			</div>
		);
	}

}
