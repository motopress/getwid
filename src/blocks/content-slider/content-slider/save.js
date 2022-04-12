const { InnerBlocks } = wp.blockEditor || wp.editor;
const { Component } = wp.element;

/**
* Create an Component
*/
class Save extends Component {

	render() {

		return (
			<div>
				<InnerBlocks.Content/>
			</div>
		);
	}
}
export default Save;
