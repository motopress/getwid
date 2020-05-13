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
const {Component} = wp.element;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-table-of-contents';


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
				headings,
				align,
				allowedTags
			}
		} = this.props;

		if (headings.length < 1) {
			return null;
		}

		const tableContent = (
			<ul
				className= {classnames(
					`${baseClass}`,
					`align${align}`
				)}
			>
				{headings.map( ( heading, index ) => {
					return (
						<li className={'content-level-' + heading.level}
							key={`content-index-${index}`}
							style={{
								marginLeft: heading.level * 20,
								display: (allowedTags[heading.level - 1] == false ? 'none' : undefined)
							}}
						>
							<a href={'#' + heading.anchor}>
								{heading.content}
							</a>
						</li>
					)
				} ) }
			</ul>
		);

		return tableContent;
	}
}

export default (Save);
