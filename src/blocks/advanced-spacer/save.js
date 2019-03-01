const {__} = wp.i18n;
const {Component, Fragment} = wp.element;
import './style.scss'

class Save extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				height,				
			},
		} = this.props;

		return <div style={ { height } } aria-hidden />;
	}
}

export default (Save);