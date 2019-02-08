const {Component} = wp.element;

export default class BackgroundSlider extends Component {

	render() {
		const {
			attributes: {
				sliderImages,
				sliderAnimationEffect,
				sliderAnimationDuration,
				sliderAnimationSpeed
			},
			baseClass
		} = this.props;

		return (
			<div className={`${baseClass}__background-slider`}
			     data-autoplay="true"
			     data-autoplay-speed={sliderAnimationSpeed}
			     data-slide-effect={sliderAnimationEffect}
			     data-slide-speed={sliderAnimationDuration}
			     data-infinite="true"
			>
				{sliderImages.map((image) => {
					return (
						<div className={`${baseClass}__background-slider-item`} key={image.id || image.url}>
							<img src={image.url} alt={image.alt} data-id={image.id} />
						</div>
					);
				})}
			</div>
		);
	}
}

export class BackgroundSliderEdit extends BackgroundSlider {

	render(){
		// Destroy needs for react update component (slick change dom structure of the slider)
		this.destroySlider();

		return super.render();
	}

	destroySlider(){
		const {clientId} = this.props;
		const sliderEl = jQuery(`#block-${clientId} .${this.props.baseClass}__background-slider`).first();
		sliderEl.hasClass('slick-initialized') && sliderEl.slick('unslick');
	}

	initSlider() {
		const {
			attributes: {
				sliderAnimationEffect,
				sliderAnimationDuration,
				sliderAnimationSpeed
			},
			clientId
		} = this.props;

		const sliderEl = jQuery(`#block-${clientId} .${this.props.baseClass}__background-slider`).first();

		// Init slick slider
		sliderEl.slick({
			arrows: false,
			dots: false,
			rows: 0,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: sliderAnimationSpeed ? parseInt(sliderAnimationSpeed) : 100,
			fade: sliderAnimationEffect === 'fade',
			speed: sliderAnimationDuration ? parseInt(sliderAnimationDuration) : 100,
			infinite: true
		});
	}

	componentDidMount() {
		this.initSlider();
	}

	componentDidUpdate(prevProps) {
		this.initSlider();
	}

	componentWillUnmount() {
		this.destroySlider();
	}
}

