/**
* External dependencies
*/
import classnames from "classnames";
import './style.scss'


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {Component, Fragment} = wp.element;
const { RichText } = wp.editor;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-toggle';


/**
* Component Output
*/
class Save extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				titles,
				items,
				iconPosition,
				iconOpen,
				iconClose,
				active,
				headerTag,

				className,
			},
		} = this.props;

		const Tag = headerTag;

		return (
			<div className={classnames(className, {
				'has-icon-left': iconPosition === 'left'
				})}
				data-active-element={active}
			>
				{titles.map((item, index) => (

					<div className={`${baseClass}__row`}>
						<div className={`${baseClass}__header-wrapper`}>
							<Tag className={`${baseClass}__header`}>
								<a href="#">
									<RichText.Content tagName='span' className={`${baseClass}__header-title`} value={item.content}/>
									<span className={`${baseClass}__icon is-active`}><i className={iconClose}></i></span>
									<span className={`${baseClass}__icon is-passive`}><i className={iconOpen}></i></span>
								</a>
							</Tag>
						</div>
						<div className={`${baseClass}__content`}>
							<RichText.Content value={items[index].content}/>
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default (Save);