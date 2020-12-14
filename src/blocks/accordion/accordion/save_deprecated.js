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
const baseClass = 'wp-block-getwid-accordion';


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
				data-active-element={active != undefined ? active : '0' }
			>
				{titles.map((item, index) => (
					<Fragment>
						<div className={`${baseClass}__header-wrapper`} key={'header'}>
							<Tag className={`${baseClass}__header`}>
								<a href="#">
									<RichText.Content tagName='span' className={`${baseClass}__header-title`} value={item.content}/>
									<span className={`${baseClass}__icon is-active`}><i className={iconClose}></i></span>
									<span className={`${baseClass}__icon is-passive`}><i className={iconOpen}></i></span>
								</a>
							</Tag>
						</div>
						<div className={`${baseClass}__content`} key={'content'}>
							<RichText.Content value={items[index].content}/>
						</div>
					</Fragment>
				))}
			</div>
		);
	}
}

export default (Save);