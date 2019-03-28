import classnames from 'classnames';
import BackgroundSlider from './sub-components/slider';
import Dividers from './sub-components/dividers';
import BackgroundVideo from './sub-components/video';
import render_style from 'GetwidUtils/render-style';
const {
	prepareGradientStyle,
	prepareBackgroundImageStyles,
	convertHorizontalAlignToStyle,
	convertVerticalAlignToStyle
} = render_style;

import './style.scss';
import './editor.scss';

import attributes from './attributes';
import Inspector from './inspector';
import Edit from './edit';

const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

const {
	InnerBlocks,
	getColorClassName
} = wp.editor;


// Prefix for block classes
const baseClass = 'wp-block-getwid-section';

// Register the block
registerBlockType( 'getwid/section', {
	title: __( 'Section', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13,0v24h11V0H13z M22,22h-7V2h7V22z"/><path d="M0,0v11h11V0H0z M9,9H2V2h7V9z"/><path d="M0,13v11h11V13H0z M9,22H2v-7h7V22z"/></svg>,		
	category: 'getwid-blocks',
	keywords: [
		__( 'container', 'getwid' ),
		__( 'wrapper', 'getwid' ),
		__( 'row', 'getwid' ),
	],
	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],
        anchor: true,
	},

	attributes: attributes,

	// Render the block components
	edit: props => {
		return [
			<Inspector {...{ ...props, baseClass }} key='inspector'/>,
			<Edit {...{
				...props,
				baseClass,
				prepareGradientStyle,
				prepareBackgroundImageStyles,
				convertHorizontalAlignToStyle,
				convertVerticalAlignToStyle
			}} key='edit'/>
		];
	},

	// Save the attributes and markup
	save:  props => {
		const {
			attributes: {
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
				align,
				contentMaxWidth,
				contentMaxWidthPreset,
				minHeight,
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
			},
		} = props;

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

				[`getwid-padding-tablet-top-${paddingTopTablet}`]: paddingTopTablet !== 'custom' && paddingTopTablet !== '',
				[`getwid-padding-tablet-bottom-${paddingBottomTablet}`]: paddingBottomTablet !== 'custom' && paddingBottomTablet !== '',
				[`getwid-padding-tablet-left-${paddingLeftTablet}`]: paddingLeftTablet !== 'custom' && paddingLeftTablet !== '',
				[`getwid-padding-tablet-right-${paddingRightTablet}`]: paddingRightTablet !== 'custom' && paddingRightTablet !== '',

				[`getwid-padding-mobile-top-${paddingTopMobile}`]: paddingTopMobile !== 'custom' && paddingTopMobile !== '',
				[`getwid-padding-mobile-bottom-${paddingBottomMobile}`]: paddingBottomMobile !== 'custom' && paddingBottomMobile !== '',
				[`getwid-padding-mobile-left-${paddingLeftMobile}`]: paddingLeftMobile !== 'custom' && paddingLeftMobile !== '',
				[`getwid-padding-mobile-right-${paddingRightMobile}`]: paddingRightMobile !== 'custom' && paddingRightMobile !== '',


				[`getwid-margin-left-${marginLeft}`]: marginLeft !== 'custom' && marginLeft !== '',
				[`getwid-margin-right-${marginRight}`]: marginRight !== 'custom' && marginRight !== '',

				[`getwid-margin-tablet-left-${marginLeftTablet}`]: marginLeftTablet !== 'custom' && marginLeftTablet !== '',
				[`getwid-margin-tablet-right-${marginRightTablet}`]: marginRightTablet !== 'custom' && marginRightTablet !== '',

				[`getwid-margin-mobile-left-${marginLeftMobile}`]: marginLeftMobile !== 'custom' && marginLeftMobile !== '',
				[`getwid-margin-mobile-right-${marginRightMobile}`]: marginRightMobile !== 'custom' && marginRightMobile !== '',


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
			backgroundColor: (props.attributes.backgroundColor ? undefined : props.attributes.customBackgroundColor),
			// backgroundColor: backgroundColor,
			...prepareGradientStyle('background', props),
			...prepareBackgroundImageStyles('background', props)
		};

		const backgroundClassName = getColorClassName( 'background-color', backgroundColor );

		const backgroundClass = classnames(`${baseClass}__background`, {
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClassName ]: backgroundClassName,
		});

		const foregroundStyle = {
			opacity: foregroundOpacity !== undefined ? foregroundOpacity / 100 : undefined,
			backgroundColor: foregroundColor,
			...prepareGradientStyle('foreground', props),
			...prepareBackgroundImageStyles('foreground', props),
			mixBlendMode: foregroundFilter,
		};

		const innerWrapperStyle = {
			maxWidth: contentMaxWidth ? `${contentMaxWidth}px` : undefined,
		};

		const wowData = !!entranceAnimation ? {
			'data-wow-duration':  entranceAnimationDuration !== undefined ? entranceAnimationDuration : '2000ms',
			'data-wow-delay': entranceAnimationDelay !== undefined ? entranceAnimationDelay : '500ms'
		} : {};

		const sectionClasses = classnames(baseClass, {
			[`getwid-anim ${entranceAnimation}`]: !!entranceAnimation,
			[`getwid-margin-top-${marginTop}`]: marginTop !== 'custom' && marginTop !== '',
			[`getwid-margin-bottom-${marginBottom}`]: marginBottom !== 'custom' && marginBottom !== '',
			[`getwid-margin-tablet-top-${marginTopTablet}`]: marginTopTablet !== 'custom' && marginTopTablet !== '',
			[`getwid-margin-tablet-bottom-${marginBottomTablet}`]: marginBottomTablet !== 'custom' && marginBottomTablet !== '',
			[`getwid-margin-mobile-top-${marginTopMobile}`]: marginTopMobile !== 'custom' && marginTopMobile !== '',
			[`getwid-margin-mobile-bottom-${marginBottomMobile}`]: marginBottomMobile !== 'custom' && marginBottomMobile !== '',
			[`getwid-section-content-full-width`]: contentMaxWidthPreset === 'full'
		});

		return (
			<div
				className={sectionClasses}
				style={sectionStyle}
				{...wowData}
			>
                <div className={wrapperClasses} style={wrapperStyle}>
                    <Dividers {...{...props, baseClass}} />
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
								<i className={'far fa-pause-circle'}></i>
							</button>
							<button
								className={'getwid-background-video-mute'}
							>
								<i className={'fas fa-volume-mute'}></i>
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
											  alt={backgroundImage.alt} data-id={backgroundImage.id}/></div>
                                }
                                {
                                    !!sliderImages.length &&
									<div className={`${baseClass}__background-slider-wrapper`}><BackgroundSlider {...{...props, baseClass}} /></div>
								}
                                {
                                    !!backgroundVideoUrl &&
									<div className={`${baseClass}__background-video-wrapper`}>
										<BackgroundVideo
											{...{...props, baseClass}}
											videoMute={ props.attributes.backgroundVideoMute }
											videoAutoplay={ props.attributes.backgroundVideoAutoplay }
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
	},
} );