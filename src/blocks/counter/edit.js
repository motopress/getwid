import Inspector from './inspector';
import classnames from 'classnames';

//import 'waypoints/lib/noframework.waypoints.js';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;


const { RichText } = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);

	}

	render() {
		const {
			attributes: {

			},

			clientId,
			className,

			setAttributes,

		} = this.props;

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div className={classnames(className)}>

				</div>
			</Fragment>
		);
	}
}

export default Edit;