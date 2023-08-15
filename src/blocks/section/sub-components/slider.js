import { isRTL } from 'wp.i18n';
const { Component, createRef } = wp.element;
const { jQuery: $ } = window;

export default class BackgroundSlider extends Component {

	constructor( props ) {

		super( props );

		this.sliderRef = createRef();

	}
	destroySlider() {
		const sliderEl = $( this.sliderRef.current );

		if ( sliderEl.length === 0 ) return;

		sliderEl.hasClass( 'slick-initialized' ) && sliderEl.slick( 'unslick' );
	}

	initSlider() {

		const { sliderAnimationEffect, sliderAnimationDuration, sliderAnimationSpeed } = this.props.attributes;

		const sliderEl = $( this.sliderRef.current );

		if ( sliderEl.length === 0 ) return;

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
			speed        : sliderAnimationDuration ? parseInt( sliderAnimationDuration ) : 100,

			rtl: isRTL()
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

	render() {
		this.destroySlider();

		const { sliderImages, sliderAnimationEffect, sliderAnimationDuration, sliderAnimationSpeed } = this.props.attributes;
		const { baseClass } = this.props;

		return (
			<div
				ref={ this.sliderRef }
				className={ `${ baseClass}__background-slider` }
				data-autoplay='true'
				data-autoplay-speed={ sliderAnimationSpeed }
				data-slide-effect={ sliderAnimationEffect }
				data-slide-speed={ sliderAnimationDuration }
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
		);
	}
}
