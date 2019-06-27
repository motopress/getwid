/**
* Internal dependencies
*/
import './style.scss';

/**
* External dependencies
*/
import classnames from 'classnames';

const { Component, Fragment } = wp.element;
const { InnerBlocks, RichText } = wp.editor;

/**
* Create an Component
*/
class Save extends Component {

	stripStringRender( string ) {
		return string.toLowerCase().replace( /[^0-9a-z-]/g, '' );
	}

	render() {
		const {
			attributes: {
				contentAnimation,
				contentAnimationDuration,
				contentAnimationDelay,
				sliderAnimationEffect,
				sliderAutoplay,
				pauseOnHover,
				sliderAutoplaySpeed,
				sliderAnimationSpeed,
				sliderArrays,
				anchor
			},
			baseClass,
			className
		} = this.props;

		const currentSlide = 1;
		const sliderArraysParsed = JSON.parse( sliderArrays );

		const wrapperClass = classnames( className,
			`${baseClass}--current-slide-${ currentSlide }`
		);
		
		const animationData = !!contentAnimation ? {
			'data-animation':  contentAnimation         !== undefined ? contentAnimation         : '',
			'data-duration' :  contentAnimationDuration !== undefined ? contentAnimationDuration : '2000ms',
			'data-delay'    : contentAnimationDelay     !== undefined ? contentAnimationDelay    : '0ms'
		} : {};

		const sliderData = {
			'data-slide-effect'   : sliderAnimationEffect,
			'data-slide-autoplay' : sliderAutoplay,

			'data-slide-pause-on-hover' : pauseOnHover,
			'data-slide-autoplay-speed' : sliderAutoplaySpeed,
			
			'data-slide-speed' : sliderAnimationSpeed,
			'data-infinite'    : true
		};

		const renderSaveTitles = ( index ) => {
			if ( typeof sliderArraysParsed[ index ] !== 'undefined' ) {
				return (
					<Fragment>
						<li id={ `tab-${ this.stripStringRender( sliderArraysParsed[ index ].text.toString() ) }` } className={ `${baseClass}__title-wrapper ${baseClass}__title-wrapper-${ index } ${baseClass}__title-wrapper--${ ( 1 + index === currentSlide ? 'active' : 'inactive' ) }` }>
							<a href={ `#tab-${ this.stripStringRender( sliderArraysParsed[ index ].text.toString() ) }` } data-tab={ 1 + index } className={ `${baseClass}__title ${baseClass}__title-${ 1 + index } ` }>
								<RichText.Content
									tagName={ 'span' }
									value={ sliderArraysParsed[ index ].text }
									className={ `${baseClass}__title_text` }
								/>
							</a>
						</li>
					</Fragment>
				);
			}			
		};

		const id = anchor ? anchor : undefined;

		return (
			<div id={ id } className={ wrapperClass }
				{ ...animationData }
			>
				<div className={ `${baseClass}__slides-wrapper` }>
					<div className={ `${baseClass}__content` }
						{ ...sliderData }					     
					>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	}
}

export default Save;