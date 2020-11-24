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
				listStyle,
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
				.filter(header => allowedTags[header.level])
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
				(listStyle === "ordered" ? (
					<ol>{getNode(item.children)}</ol>
				) : (
					<ul>
						{getNode(item.children)}
					</ul>
				))}
			</li>
		));

		const tableContent = (
			<div
				className= {classnames(
					`${baseClass}`,
					`is-style-${listStyle}`,
					{
						[`align${align}`]: align != 'none',
					}
				)}
			>

				{listStyle === "ordered" ? (
					<ol
						className= {classnames(
							`${baseClass}__list`,
						)}
					>{getNode(getHeadingArr(headings))}</ol>
				) : (
					<ul
						className= {classnames(
							`${baseClass}__list`,
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
