import { __ } from 'wp.i18n';

const { Component } = wp.element;
const { Placeholder } = wp.components;
const { ButtonBlockAppender, ButtonBlockerAppender } = wp.blockEditor || wp.editor;
const BlockAppender = ButtonBlockAppender || ButtonBlockerAppender;

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
				<BlockAppender rootClientId={ this.props.rootClientId } />
			</Placeholder>
		)
	}
}

export default GetwidContentSliderSlidePlaceholder;
