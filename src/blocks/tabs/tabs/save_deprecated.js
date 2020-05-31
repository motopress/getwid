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
const baseClass = 'wp-block-getwid-tabs';


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
				type,
				active,
				headerTag,

				className,
			}
		} = this.props;

		const Tag = headerTag;

		return (
			<div
				className={classnames(className,
                    {
                        [`has-layout-${type}`]: type !== ''
                    }
				)}
				data-active-tab={active}
			>
				<ul className={`${baseClass}__nav-links`}>
					{titles.map((item, index) => (
						<li className={`${baseClass}__nav-link`} key={index}>

							<Tag className={`${baseClass}__title-wrapper`}>
								<a href={`#tab-${index}`}>
									<RichText.Content tagName='span' className={`${baseClass}__title`} value={item.content}/>
								</a>
							</Tag>

						</li>
					))}
				</ul>
				{items.map((item, index) => (
					<div id={`tab-${index}`} className={`${baseClass}__tab-content`} key={index}>
						<RichText.Content value={item.content}/>
					</div>
				))}
			</div>
		);
	}
}

export default (Save);