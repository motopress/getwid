import { __ } from 'wp.i18n';

const { Component } = wp.element;
const { Placeholder } = wp.components;
const { ButtonBlockAppender } = wp.blockEditor || wp.editor;

class GetwidContentSliderSlidePlaceholder extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Placeholder
				label={ __( 'Slide', 'getwid' ) }
				instructions={ __( 'Add any block to slide', 'getwid' ) }
				isColumnLayout={ true }
			>
				<ButtonBlockAppender rootClientId={ this.props.rootClientId } />
			</Placeholder>
		)
	}
}

export default GetwidContentSliderSlidePlaceholder;
