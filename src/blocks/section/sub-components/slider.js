const { Component, Fragment } = wp.element;
const { jQuery: $ } = window;

export default class BackgroundSlider extends Component {

	render() {

		const { sliderImages, sliderAnimationEffect, sliderAnimationDuration, sliderAnimationSpeed } = this.props.attributes;
		const { baseClass } = this.props;

		return (
			<Fragment>
				<div className={`${baseClass}__background-slider`}
					 data-autoplay='true'
					 data-autoplay-speed={sliderAnimationSpeed}
					 data-slide-effect={sliderAnimationEffect}
					 data-slide-speed={sliderAnimationDuration}
					 data-infinite='true'
				>
					{sliderImages.map(image => {
						return (
							<div
								className={`${baseClass}__background-slider-item`}
								key={image.id || image.url}
							>
								<img src={image.url} className={image.id ? `wp-image-${image.id}` : null} alt={image.alt} data-id={image.id}/>
							</div>
						);
					})}
				</div>
			</Fragment>
		);
	}
}

export class BackgroundSliderEdit extends BackgroundSlider {

	render() {
		this.destroySlider();
		return super.render();
	}

	destroySlider() {
		const { clientId } = this.props;
		const sliderEl = $( `#block-${clientId} .${this.props.baseClass}__background-slider` ).first();
		sliderEl.hasClass( 'slick-initialized' ) && sliderEl.slick( 'unslick' );
	}

	initSlider() {

		const { sliderAnimationEffect, sliderAnimationDuration, sliderAnimationSpeed } = this.props.attributes;
		const { clientId } = this.props;

		const sliderEl = $( `#block-${clientId} .${this.props.baseClass}__background-slider` ).first();

		sliderEl.slick({
			rows: 0,
			slidesToShow: 1,
			slidesToScroll: 1,

			autoplay: true,
			infinite: true,

			arrows: false,
			dots  : false,

			fade : sliderAnimationEffect === 'fade',

			autoplaySpeed: sliderAnimationSpeed    ? parseInt( sliderAnimationSpeed    ) : 100,
			speed        : sliderAnimationDuration ? parseInt( sliderAnimationDuration ) : 100
		});
	}

	componentDidMount() {
		this.initSlider();
	}

	componentDidUpdate() {
		this.initSlider();
	}

	componentWillUnmount() {
		this.destroySlider();
	}
}