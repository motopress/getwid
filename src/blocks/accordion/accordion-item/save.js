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
			})
		};

		const Tag = outerParent ? outerParent.attributes.headerTag : 'span';
		const iconOpen = outerParent ? outerParent.attributes.iconOpen : 'fas fa-minus';
		const iconClose = outerParent ? outerParent.attributes.iconClose : 'fas fa-plus';



		// return (
		// 	<div {...itemClass}>
		// 		<div className={`${baseClass}__header-wrapper`}>
		// 			{title && (
		// 				<Tag className={`${baseClass}__header`}>
		// 					<a href="#">
		// 						<RichText.Content
		// 							tagName={'span'}
		// 							className={`${baseClass}__header-title`}
		// 							value={title}
		// 						/>
		// 						<span className={`${baseClass}__icon is-active`}><i className={iconClose}></i></span>
		// 						<span className={`${baseClass}__icon is-passive`}><i className={iconOpen}></i></span>
		// 					</a>
		// 				</Tag>
		// 			)}
		// 		</div>

		// 		<div className={`${baseClass}__content-wrapper`}>
		// 			<div className={`${baseClass}__content`}>
		// 				<InnerBlocks.Content/>
		// 			</div>
		// 		</div>
		// 	</div>
		// );





		return (
			<Fragment>
				<div className={`${baseClass}__header-wrapper`}>
					{title && (
						<Tag className={`${baseClass}__header`}>
							<a href="#">
								<RichText.Content
									tagName={'span'}
									className={`${baseClass}__header-title`}
									value={title}
								/>
								<span className={`${baseClass}__icon is-active`}><i className={iconClose}></i></span>
								<span className={`${baseClass}__icon is-passive`}><i className={iconOpen}></i></span>
							</a>
						</Tag>
					)}
				</div>

				<div className={`${baseClass}__content-wrapper`}>
					<div className={`${baseClass}__content`}>
						<InnerBlocks.Content/>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;