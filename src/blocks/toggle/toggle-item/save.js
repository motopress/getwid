/**
 * External dependencies
 */
import classnames from 'classnames';

const {RichText} = wp.blockEditor || wp.editor;
const {InnerBlocks} = wp.blockEditor || wp.editor;
const {Component, Fragment} = wp.element;

/**
 * Create an Component
 */
class Save extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const { outerParent, title, active } = this.props.attributes;

		const Tag = outerParent ? outerParent.attributes.headerTag : 'span';
		const iconOpen = outerParent ? outerParent.attributes.iconOpen : 'fas fa-minus';
		const iconClose = outerParent ? outerParent.attributes.iconClose : 'fas fa-plus';

		return (
			<div
				className={classnames(`wp-block-getwid-toggle__row`, {
						'is-active': active,
					},
				)}
			>
				<div
					className={`wp-block-getwid-toggle__header-wrapper`}
				>
					{title && (
						<Tag className={`wp-block-getwid-toggle__header`}>
							<a href="#">
								<RichText.Content
									tagName={'span'}
									className={`wp-block-getwid-toggle__header-title`}
									value={title}
								/>
								<span className={`wp-block-getwid-toggle__icon is-active`}><i className={iconClose}></i></span>
								<span className={`wp-block-getwid-toggle__icon is-passive`}><i className={iconOpen}></i></span>
							</a>
						</Tag>
					)}
				</div>

				<div
					className={`wp-block-getwid-toggle__content-wrapper`}
				>
					<div className={`wp-block-getwid-toggle__content`}>
						<InnerBlocks.Content/>
					</div>
				</div>

			</div>
		);
	}
}

export default Save;