/**
* Internal dependencies
*/
import './style.scss';

/**
* External dependencies
*/
import classnames from 'classnames';

const { Component } = wp.element;
const { InnerBlocks } = wp.blockEditor || wp.editor;

/**
* Create an Component
*/
class Save extends Component {

	render() {

		const { baseClass, className } = this.props;
		const { contentAnimation, contentAnimationDuration, contentAnimationDelay, sliderAnimationEffect, sliderAutoplay } = this.props.attributes;
		const { pauseOnHover, sliderAutoplaySpeed, sliderAnimationSpeed, sliderArrays, sliderArrows, sliderDots } = this.props.attributes;

		const currentSlide = 1;
		
		const wrapperClass = {
			className: classnames( className, `${baseClass}--current-slide-${currentSlide}`, {
					[ `has-arrows-${sliderArrows}` ]: (sliderArrows != 'none' && sliderArrows != undefined) ? true : false,
					[ `has-dots-${sliderDots}`     ]: (sliderDots   != 'none' && sliderDots   != undefined) ? true : false
				}
			),
			'data-labels': sliderArrays,
			'data-animation': contentAnimation         !== undefined ? contentAnimation         : '',
			'data-duration' : contentAnimationDuration !== undefined ? contentAnimationDuration : '1500ms',
			'data-delay'    : contentAnimationDelay    !== undefined ? contentAnimationDelay    : '0ms'
		};

		const sliderData = {
			'data-slide-effect'   : sliderAnimationEffect,
			'data-slide-autoplay' : sliderAutoplay,

			'data-slide-pause-on-hover' : pauseOnHover,
			'data-slide-autoplay-speed' : sliderAutoplaySpeed,
			
			'data-slide-speed' : sliderAnimationSpeed,
			'data-infinite'    : true
		};

		return (
			<div {...wrapperClass}>
				<div className={`${baseClass}__slides-wrapper`}>
					<div className={`${baseClass}__content`}
						{...sliderData}
					>
						<InnerBlocks.Content/>
					</div>
				</div>
			</div>
		);
	}
}

export default Save;