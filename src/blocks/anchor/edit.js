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
					<i class="fa fa-anchor" aria-hidden="true"></i>
					<span></span>
				</div>
			</Fragment>
		);
	}
}

export default (Edit);
