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
const { RichText } = wp.blockEditor || wp.editor;


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
				allowedTags,
				title,
				listStyle,
				titleAlignment
			}
		} = this.props;

		if (headings.length < 1) {
			return null;
		}

		const moveChildren = (arr, item) => {
			if (arr.length === 0 || arr[0].level === item.level) {
				arr.push(Object.assign({}, item));
			} else if (arr[arr.length - 1].level < item.level) {
				if (!arr[arr.length - 1].children) {
					arr[arr.length - 1].children = [Object.assign({}, item)];
				} else moveChildren(arr[arr.length - 1].children, item);
			}
		};

		const getHeadingArr = headers => {
			let headingArr = [];

			headers
				.filter(header => allowedTags[header.level - 1])
				.forEach(header => moveChildren(headingArr, header));

			return headingArr;
		};

		const getNode = (list) => list.map(item => (
			<li>
				<a
					href={`#${item.anchor}`}
				>
					{item.content}
				</a>
				{item.children &&
				(listStyle === "numbered" ? (
					<ol
						className= {classnames(
							`${baseClass}__inner-list`,
						)}
					>{getNode(item.children)}</ol>
				) : (
					<ul
						className= {classnames(
							`${baseClass}__inner-list`,
						)}
					>
						{getNode(item.children)}
					</ul>
				))}
			</li>
		));

		const tableContent = (
			<div
				className= {classnames(
					`${baseClass}`,
					{
						[`align${align}`]: align != 'none',
						[`title-${titleAlignment}`]: undefined !== titleAlignment,
					}
				)}
			>
				<div
					className= {classnames(
						`${baseClass}__title`,
					)}
				>
					{ ! RichText.isEmpty( title ) && (
						<RichText.Content tagName="p" className= {`${baseClass}__title`} value={ title } />
					) }
				</div>

				{listStyle === "numbered" ? (
					<ol
						className= {classnames(
							`${baseClass}__list`,
							`list-style-${listStyle}`
						)}
					>{getNode(getHeadingArr(headings))}</ol>
				) : (
					<ul
						className= {classnames(
							`${baseClass}__list`,
							`list-style-${listStyle}`
						)}
					>
						{getNode(getHeadingArr(headings))}
					</ul>
				)}
			</div>
		);

		return tableContent;
	}
}

export default (Save);
