import blockAttributes from "./attributes";

const { InnerBlocks } = wp.blockEditor || wp.editor;
const { Component } = wp.element;

/**
* Create an Component
*/
class Save extends Component {

	generateDataAttributes() {
		const {
			attributes,
		} = this.props;

		const sliderAtts = [
			'autoplay',
			'autoplaySpeed',
			'animationSpeed',
			'infinite',
			'animationEffect',
			'centerMode',
			'arrows',
			'dots',
			'slidesToShow',
			'slidesToShowLaptop',
			'slidesToShowTablet',
			'slidesToShowMobile',
			'slidesToScroll',
			'slidesToScrollLaptop',
			'slidesToScrollTablet',
			'slidesToScrollMobile'
		];
		let renderAttributes = {};

		sliderAtts.forEach((item) => {
			renderAttributes = Object.assign(renderAttributes,
			attributes[item] !== blockAttributes[item].default && { [blockAttributes[item].attribute]: attributes[item] }
			);
		});

		return renderAttributes;
	}

	render() {

		const attributes = this.generateDataAttributes();

		return (
			<div className={ 'wp-block-getwid-content-slider' } { ...attributes }>
				<InnerBlocks.Content/>
			</div>
		);
	}
}
export default Save;
