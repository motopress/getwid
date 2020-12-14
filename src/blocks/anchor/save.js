/**
* External dependencies
*/
import classnames from "classnames";


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {Component} = wp.element;


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
				className,
			},
		} = this.props;

		return (
			<div
				className={ classnames(
					className
				) }
			/>
		);
	}
}

export default (Save);
