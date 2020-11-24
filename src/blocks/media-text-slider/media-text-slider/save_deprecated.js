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

	stripStringRender( string ) {
		return string.toLowerCase().replace( /[^0-9a-z-]/g, '' );
	}

	render() {

		const { contentAnimation, contentAnimationDuration, contentAnimationDelay, sliderAnimationEffect, sliderAutoplay } = this.props.attributes;
		const { pauseOnHover, sliderAutoplaySpeed, sliderAnimationSpeed } = this.props.attributes;
		const { baseClass, className } = this.props;

		const currentSlide = 1;

		const wrapperClass = classnames( className,
			`${baseClass}--current-slide-${ currentSlide }`
		);

		const animationData = {
			'data-animation' :  contentAnimation         !== undefined ? contentAnimation         : '',
			'data-duration'  :  contentAnimationDuration !== undefined ? contentAnimationDuration : '1500ms',
			'data-delay'     :  contentAnimationDelay    !== undefined ? contentAnimationDelay    : '0ms'
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
			<div className={wrapperClass}
				{...animationData}
			>
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