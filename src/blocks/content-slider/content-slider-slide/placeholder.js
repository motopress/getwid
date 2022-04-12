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
				label={ 'Content Slider Slide' }
				instructions={ 'Add any block to slide' }
				isColumnLayout={ true }
			>
				<ButtonBlockAppender rootClientId={ this.props.rootClientId } />
			</Placeholder>
		)
	}
}

export default GetwidContentSliderSlidePlaceholder;
