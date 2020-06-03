/**
 * External dependencies
 */
import classnames from 'classnames';

const {RichText} = wp.blockEditor || wp.editor;
const {InnerBlocks} = wp.blockEditor || wp.editor;
const {Component} = wp.element;

/**
 * Create an Component
 */
class Save extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {className, baseClass} = this.props;
		const {outerParent, title, icon} = this.props.attributes;

		const itemClass= {
			className: classnames(className, {
			})
		};

		const Tag = outerParent ? outerParent.attributes.headerTag : 'span';

		return (
			<div {...itemClass}>
				<li className={`${baseClass}__nav-link`}>
					{title && (
						<Tag className={`${baseClass}__title-wrapper`}>
							<a href="#">
								{icon && (
									<span className={`${baseClass}__icon`}><i className={icon}></i></span>
								)}
								<RichText.Content
									tagName={'span'}
									className={`${baseClass}__title`}
									value={title}
								/>
							</a>
						</Tag>
					)}
				</li>

				<div className={`${baseClass}__content-wrapper`}>
					<div className={`${baseClass}__content`}>
						<InnerBlocks.Content/>
					</div>
				</div>
			</div>
		);
	}
}

export default Save;