import blockAttributes from "./attributes";
import classnames from "classnames";

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
			'pauseOnHover',
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

		const sliderClasses = classnames( this.props.className,
			`has-arrows-${this.props.attributes.arrows}`,
			`has-dots-${this.props.attributes.dots}`
		)

		return (
			<div className={ sliderClasses } { ...attributes }>
				<div className="wp-block-getwid-content-slider__wrapper">
					<InnerBlocks.Content/>
				</div>
			</div>
		);
	}
}
export default Save;
