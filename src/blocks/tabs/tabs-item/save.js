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
		const {className, baseClass} = this.props;
		const {outerParent, title} = this.props.attributes;

		const itemClass= {
			className: classnames(className, {
				},
			)
		};

		const Tag = outerParent ? outerParent.attributes.headerTag : 'span';

		return (
			<Fragment>
				<div className={`wp-block-getwid-tabs__nav-link`}>
					{title && (
						<Tag className={`wp-block-getwid-tabs__title-wrapper`}>
							<a href="#">
								<RichText.Content
									tagName={'span'}
									className={`wp-block-getwid-tabs__title`}
									value={title}
								/>
							</a>
						</Tag>
					)}
				</div>

				<div className={`wp-block-getwid-tabs__tab-content-wrapper`}>
					<div className={`wp-block-getwid-tabs__tab-content`}>
						<InnerBlocks.Content/>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;