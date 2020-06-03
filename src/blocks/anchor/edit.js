/**
* External dependencies
*/
import Inspector from './inspector';
import classnames from 'classnames';
import './editor.scss'


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {Component, Fragment} = wp.element;
const {
} = wp.components;


/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				anchor
			},
			className,
		} = this.props;

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div
					className={ classnames(
						className

					) }
					id={(anchor ? anchor : undefined)}
				>
					<span></span>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"><path d="M20.68,16.6c-0.42,0.95-1.13,1.84-2.11,2.62c-1.75,1.4-3.95,2.15-5.58,2.54V13h6v-2h-6V7.6c1.65-0.44,2.88-1.94,2.88-3.73	C15.88,1.74,14.14,0,12,0S8.13,1.74,8.13,3.88c0,1.79,1.22,3.28,2.88,3.73V11H5v2h6v8.76c-1.63-0.4-3.83-1.15-5.58-2.54	c-0.98-0.78-1.69-1.67-2.11-2.62l-1.83,0.8c0.55,1.25,1.46,2.39,2.69,3.38c2.43,1.95,5.5,2.82,7.65,3.2L12,24.02l0.18-0.03	c2.15-0.39,5.22-1.26,7.65-3.2c1.24-0.99,2.14-2.13,2.69-3.38L20.68,16.6z M10.13,3.88C10.13,2.84,10.97,2,12,2	c1.03,0,1.88,0.84,1.88,1.88S13.03,5.75,12,5.75C10.97,5.75,10.13,4.91,10.13,3.88z"/></svg>
					<span></span>
				</div>
			</Fragment>
		);
	}
}

export default (Edit);
