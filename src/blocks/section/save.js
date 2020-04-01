/**
* Internal dependencies
*/
import BackgroundSlider from './sub-components/slider';
import Dividers 		from './sub-components/dividers';
import BackgroundVideo  from './sub-components/video';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import render_style from 'GetwidUtils/render-style';

const { Component } = wp.element;
const { InnerBlocks, getColorClassName } = wp.blockEditor || wp.editor;
const { prepareGradientStyle, prepareBackgroundImageStyles } = render_style;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-section';


/**
* Create an Component
*/
class Save extends Component {

	render() {
		const {
			attributes: {
				align,
				paddingTopValue,
				paddingBottomValue,
				paddingLeftValue,
				paddingRightValue,
				marginTopValue,
				marginBottomValue,
				marginLeftValue,
				marginRightValue,
				backgroundImage,
				sliderImages,
				backgroundVideoUrl,
				backgroundVideoControlsPosition,
				foregroundOpacity,
				foregroundColor,
				foregroundFilter,
				dividersBringTop,
				
				contentMaxWidth,
				contentMaxWidthPreset,
				minHeight,
				gapSize,
				entranceAnimation,
				entranceAnimationDuration,
				entranceAnimationDelay,

				backgroundColor,
				customBackgroundColor,

				resetMinHeightTablet,
				resetMinHeightMobile,

				verticalAlign, verticalAlignTablet, verticalAlignMobile,
				horizontalAlign, horizontalAlignTablet, horizontalAlignMobile,

				paddingTop, paddingRight, paddingBottom, paddingLeft,
				paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
				paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,

				marginTop, marginRight, marginBottom, marginLeft,
				marginTopTablet, marginRightTablet, marginBottomTablet, marginLeftTablet,
				marginTopMobile, marginRightMobile, marginBottomMobile, marginLeftMobile,

				className,
				anchor
			},
		} = this.props;

		const sectionStyle = {
			//Fix: for editor-only margin top & bottom rullers
			/*paddingTop : marginTop,
			paddingBottom : marginBottom,*/
			...(marginTop === 'custom' ? {marginTop: marginTopValue} : []),
			...(marginBottom === 'custom' ? {marginBottom: marginBottomValue} : []),
		};
        
        const wrapperStyle = {
			minHeight: minHeight,
			...(marginLeft === 'custom' ? {marginLeft: marginLeftValue} : []),
			...(marginRight === 'custom' ? {marginRight: marginRightValue} : []),
			...(paddingTop === 'custom' ? {paddingTop: paddingTopValue} : []),
			...(paddingBottom === 'custom' ? {paddingBottom: paddingBottomValue} : []),
			...(paddingLeft === 'custom' ? {paddingLeft: paddingLeftValue} : []),
			...(paddingRight === 'custom' ? {paddingRight: paddingRightValue} : [])
        };

		const wrapperClasses = classnames(
			`${baseClass}__wrapper`,
			{
				[`getwid-padding-top-${paddingTop}`]: paddingTop !== 'custom' && paddingTop !== '',
				[`getwid-padding-bottom-${paddingBottom}`]: paddingBottom !== 'custom' && paddingBottom !== '',
				[`getwid-padding-left-${paddingLeft}`]: paddingLeft !== 'custom' && paddingLeft !== '',
				[`getwid-padding-right-${paddingRight}`]: paddingRight !== 'custom' && paddingRight !== '',

				[`getwid-padding-tablet-top-${paddingTopTablet}`]: paddingTopTablet !== '',
				[`getwid-padding-tablet-bottom-${paddingBottomTablet}`]: paddingBottomTablet !== '',
				[`getwid-padding-tablet-left-${paddingLeftTablet}`]: paddingLeftTablet !== '',
				[`getwid-padding-tablet-right-${paddingRightTablet}`]: paddingRightTablet !== '',

				[`getwid-padding-mobile-top-${paddingTopMobile}`]: paddingTopMobile !== '',
				[`getwid-padding-mobile-bottom-${paddingBottomMobile}`]: paddingBottomMobile !== '',
				[`getwid-padding-mobile-left-${paddingLeftMobile}`]: paddingLeftMobile !== '',
				[`getwid-padding-mobile-right-${paddingRightMobile}`]: paddingRightMobile !== '',


				[`getwid-margin-left-${marginLeft}`]: marginLeft !== 'custom' && marginLeft !== '',
				[`getwid-margin-right-${marginRight}`]: marginRight !== 'custom' && marginRight !== '',

				[`getwid-margin-tablet-left-${marginLeftTablet}`]: marginLeftTablet !== '',
				[`getwid-margin-tablet-right-${marginRightTablet}`]: marginRightTablet !== '',

				[`getwid-margin-mobile-left-${marginLeftMobile}`]: marginLeftMobile !== '',
				[`getwid-margin-mobile-right-${marginRightMobile}`]: marginRightMobile !== '',


				[`getwid-align-items-${verticalAlign}`]: verticalAlign !== 'center',
				[`getwid-align-items-tablet-${verticalAlignTablet}`]: verticalAlignTablet !== '',
				[`getwid-align-items-mobile-${verticalAlignMobile}`]: verticalAlignMobile !== '',

				[`getwid-justify-content-${horizontalAlign}`]: horizontalAlign !== 'center',
				[`getwid-justify-content-tablet-${horizontalAlignTablet}`]: horizontalAlignTablet !== '',
				[`getwid-justify-content-mobile-${horizontalAlignMobile}`]: horizontalAlignMobile !== '',

				'getwid-reset-min-height-tablet': resetMinHeightTablet !== false,
				'getwid-reset-min-height-mobile': resetMinHeightMobile !== false
			}

		);

		const backgroundStyle = {
			backgroundColor: (this.props.attributes.backgroundColor ? undefined : this.props.attributes.customBackgroundColor),
			...prepareGradientStyle('background', this.props),
			...prepareBackgroundImageStyles('background', this.props)
		};

		const backgroundClassName = getColorClassName( 'background-color', backgroundColor );

		const backgroundClass = classnames(`${baseClass}__background`, {
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClassName ]: backgroundClassName,
		});

		const foregroundStyle = {
			opacity: foregroundOpacity !== undefined ? foregroundOpacity / 100 : undefined,
			backgroundColor: foregroundColor,
			...prepareGradientStyle('foreground', this.props),
			...prepareBackgroundImageStyles('foreground', this.props),
			mixBlendMode: foregroundFilter,
		};

		const innerWrapperStyle = {
			maxWidth: (contentMaxWidth && contentMaxWidthPreset === 'custom') ? `${contentMaxWidth}px` : undefined,
		};

		const wowData = !!entranceAnimation ? {
			'data-wow-duration':  entranceAnimationDuration !== undefined ? entranceAnimationDuration : '2000ms',
			'data-wow-delay': entranceAnimationDelay !== undefined ? entranceAnimationDelay : '500ms'
		} : {};

		const sectionClasses = classnames(className, 
			align ? `align${ align }` : null,
			{
			[`has-inner-blocks-gap-${gapSize}`]: gapSize !== undefined && gapSize !== '',
			[`getwid-anim ${entranceAnimation}`]: !!entranceAnimation,
			[`getwid-margin-top-${marginTop}`]: marginTop !== 'custom' && marginTop !== '',
			[`getwid-margin-bottom-${marginBottom}`]: marginBottom !== 'custom' && marginBottom !== '',
			[`getwid-margin-tablet-top-${marginTopTablet}`]: marginTopTablet !== 'custom' && marginTopTablet !== '',
			[`getwid-margin-tablet-bottom-${marginBottomTablet}`]: marginBottomTablet !== 'custom' && marginBottomTablet !== '',
			[`getwid-margin-mobile-top-${marginTopMobile}`]: marginTopMobile !== 'custom' && marginTopMobile !== '',
			[`getwid-margin-mobile-bottom-${marginBottomMobile}`]: marginBottomMobile !== 'custom' && marginBottomMobile !== '',
			[`getwid-section-content-full-width`]: contentMaxWidthPreset === 'full',
			[`getwid-section-content-custom-width`]: contentMaxWidthPreset === 'custom'
		});

		const id = anchor ? anchor : undefined;

		return (
			<div
				id={id}
				className={sectionClasses}
				style={sectionStyle}
				{...wowData}
			>
                <div className={wrapperClasses} style={wrapperStyle}>
                    <Dividers {...{...this.props, baseClass}} />
					{
						(!!backgroundVideoUrl && backgroundVideoControlsPosition !== 'none') &&
						<div
							className={
								classnames(
									'getwid-background-video-controls',
									{
										[`is-position-${backgroundVideoControlsPosition}`]: backgroundVideoControlsPosition !== 'top-right'
									}
								)
							}
						>
							<button
								className={'getwid-background-video-play'}
							>
								<i className={'getwid-icon getwid-icon-pause'}></i>
							</button>
							<button
								className={'getwid-background-video-mute'}
							>
								<i className={'getwid-icon getwid-icon-mute'}></i>
							</button>

						</div>
					}
					<div className={classnames(`${baseClass}__inner-wrapper`, {
							[`has-dividers-over`]: dividersBringTop,
						})} style={innerWrapperStyle}>
                        <div className={`${baseClass}__background-holder`}>
                            <div className={backgroundClass} style={backgroundStyle}>
                                {
                                    !!backgroundImage &&
                                    <div className={`${baseClass}__background-image-wrapper`}><img className={`${baseClass}__background-image`} src={backgroundImage.url}
											  alt={backgroundImage.alt}/></div>
                                }
                                {
                                    !!sliderImages.length &&
									<div className={`${baseClass}__background-slider-wrapper`}><BackgroundSlider {...{...this.props, baseClass}} /></div>
								}
                                {
                                    !!backgroundVideoUrl &&
									<div className={`${baseClass}__background-video-wrapper`}>
										<BackgroundVideo
											{...{...this.props, baseClass}}
											videoMute={ this.props.attributes.backgroundVideoMute }
											videoAutoplay={ this.props.attributes.backgroundVideoAutoplay }
										/>
									</div>
                                }								
                            </div>
                            <div className={`${baseClass}__foreground`} style={foregroundStyle}></div>
                        </div>
                        <div className={`${baseClass}__content`}>
                            <div className={`${baseClass}__inner-content`}>
                                <InnerBlocks.Content/>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
		);
	}
}
export default Save;