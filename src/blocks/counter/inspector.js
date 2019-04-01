
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

const {
    InspectorControls,
} = wp.editor;

const {

} = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {

			},
			setAttributes,
			
		} = this.props;

		return (
			<InspectorControls>
				<Fragment>
					
				</Fragment>
			</InspectorControls>
		);
	}	
}

export default Inspector;