import classnames from 'classnames';
import times from 'lodash/times';
import './style.scss';
import render_style from 'GetwidUtils/render-style';
const {
	prepareGradientStyle,
} = render_style;

const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	RichText,
} = wp.editor;

/**
 *
 * @param {string} attrPrefix
 * @return {Object}
 */


class Save extends Component {
	stripStringRender( string ) {
		return string.toLowerCase().replace( /[^0-9a-z-]/g,'' );
	}
	render() {
		const {
			attributes: {
				uniqueID,
				slideCount,
				align,
				contentMaxWidth,
				minHeight,
				verticalAlign,
				horizontalAlign,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				textColor,
				overlayColor,
				overlayOpacity,
				contentAnimation,
				contentAnimationDuration,
				contentAnimationDelay,
				sliderAnimationEffect,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderAnimationSpeed,
				currentSlide,
				selectedSlide,
				sliderArrays,
			}
		} = this.props;
		const className = 'wp-block-getwid-media-text-slider';

		const classId = ( ! uniqueID ? 'notset' : uniqueID );
		const wrapperClass = classnames( `${className}-tab-id${ classId } ${className}--current-slide-${ currentSlide }` );

		const wrapperStyle = {
			backgroundColor: overlayColor,
			color: textColor,
		};
		
		const animationData = !!contentAnimation ? {
			'data-animation':  contentAnimation !== undefined ? contentAnimation : '',
			'data-duration':  contentAnimationDuration !== undefined ? contentAnimationDuration : '2000ms',
			'data-delay': contentAnimationDelay !== undefined ? contentAnimationDelay : '0ms',
		} : {};

		const sliderData = {
			'data-slide-effect' : sliderAnimationEffect,
			'data-slide-autoplay' : sliderAutoplay,
			'data-slide-autoplay-speed' : sliderAutoplaySpeed,
			'data-slide-speed' : sliderAnimationSpeed,
			'data-infinite' : true,
		};

		const renderSaveTitles = ( index ) => {
			if (typeof sliderArrays[ index ] !== 'undefined')
			return (
				<Fragment>
					<li id={ `tab-${ this.stripStringRender( sliderArrays[ index ].text.toString() ) }` } className={ `${className}__title-wrapper ${className}__title-wrapper-${ index } ${className}__title-wrapper--${ ( 1 + index === currentSlide ? 'active' : 'inactive' ) }` }>
						<a href={ `#tab-${ this.stripStringRender( sliderArrays[ index ].text.toString() ) }` } data-tab={ 1 + index } className={ `${className}__title ${className}__title-${ 1 + index } ` }>
							<RichText.Content
								tagName="span"
								value={ sliderArrays[ index ].text }
								className={`${className}__title_text`}
							/>
						</a>
					</li>
				</Fragment>
			);
		};

		return (
			<div className={ wrapperClass }
				style={wrapperStyle}
				{...animationData}
			>
				<div className={`${className}__slides-wrapper`}>
					<div className={`${className}__content`}
						{...sliderData}					     
					>

						<InnerBlocks.Content />

					</div>
				</div>
			</div>
		);

	}
}
export default Save;
