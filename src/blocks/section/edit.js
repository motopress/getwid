/**
* External dependencies
*/
import classnames from 'classnames';
import { BackgroundSliderEdit as BackgroundSlider } from './sub-components/slider';
import Dividers from './sub-components/dividers';
import BackgroundVideo from './sub-components/video';

import Inspector from './inspector';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {Component, Fragment} = wp.element;
const {
	InnerBlocks,
	withColors
} = wp.editor;
const {compose} = wp.compose;

/**
* Module Constants
*/
const TEMPLATE = [ [ 'core/paragraph' ] ];
const baseClass = 'wp-block-getwid-section';

/**
* Create an Inspector Controls
*/
class Edit extends Component {

	constructor(props) {
		super( props );

		this.videoRef = null;
		this.videoButtonRef = null;

		this.state = {
			videoPlayState: 'paused',
			videoMuteState: true,

			isLockedPaddingsOnDesktop: false,
			isLockedPaddingsOntablet : false,
			isLockedPaddingsOnMobile : false,

			isLockedMarginsOnDesktop: false,
			isLockedMarginsOnTablet : false,
			isLockedMarginsOnMobile : false
		};

		this.playBackgroundVideo  = this.playBackgroundVideo .bind( this );
		this.onBackgroundVideoEnd = this.onBackgroundVideoEnd.bind( this );
		this.muteBackgroundVideo  = this.muteBackgroundVideo .bind( this );

		this.changeState  = this.changeState.bind( this );
	}

	changeState(param, value) {
		this.setState( { [ param ]: value } );
	}

	render() {
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

				contentMaxWidth,
				contentMaxWidthPreset,
				minHeight,
				gapSize,
				entranceAnimation,
				entranceAnimationDuration,
				entranceAnimationDelay,

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

				anchor

			},
			className,
			backgroundColor,

			prepareGradientStyle,
			prepareBackgroundImageStyles
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
			backgroundColor: (this.props.backgroundColor.color ? this.props.backgroundColor.color : this.props.attributes.customBackgroundColor),
			...prepareGradientStyle('background', this.props),
			...prepareBackgroundImageStyles('background', this.props)
		};

		const backgroundClass = classnames(`${baseClass}__background`, {
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
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

		const sectionClasses = classnames(className, {
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

		const changeState = this.changeState;
		const { isLockedPaddingsOnDesktop, isLockedPaddingsOntablet, isLockedPaddingsOnMobile } = this.state;
		const { isLockedMarginsOnDesktop , isLockedMarginsOnTablet , isLockedMarginsOnMobile  } = this.state;

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					...{ isLockedPaddingsOnDesktop, isLockedPaddingsOntablet, isLockedPaddingsOnMobile },
					...{ isLockedMarginsOnDesktop, isLockedMarginsOnTablet, isLockedMarginsOnMobile },
					changeState
				}} key='inspector'/>
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
											onClick={ this.playBackgroundVideo }
											className={'getwid-background-video-play'}
											ref={ node => {this.videoButtonRef = node}}
										>
											{
												this.state.videoPlayState === 'paused' &&
												<i className={'getwid-icon getwid-icon-play'}></i>
											}
											{
												this.state.videoPlayState === 'playing' &&
												<i className={'getwid-icon getwid-icon-pause'}></i>
											}
										</button>
										<button
											onClick={ this.muteBackgroundVideo }
											className={'getwid-background-video-mute'}
										>
											{
												this.state.videoMuteState === true &&
												<i className="getwid-icon getwid-icon-mute"></i>
											}
											{
												this.state.videoMuteState === false &&
												<i className="getwid-icon getwid-icon-volume-up"></i>
											}
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
											<div className={`${baseClass}__background-slider-wrapper`}><BackgroundSlider {...{...this.props, baseClass}} /></div>
										}
										{
											!!backgroundVideoUrl &&
											<div className={`${baseClass}__background-video-wrapper`}>
												<BackgroundVideo
													{...{...this.props, baseClass}}
													onVideoEnd={ this.onBackgroundVideoEnd }
													videoAutoplay={ false }
													videoMute={ this.state.videoMuteState }
													videoElemRef={ node => { this.videoRef = node } }
												/>
											</div>
										}
									</div>
									<div className={`${baseClass}__foreground`} style={foregroundStyle}></div>
								</div>
								<div className={`${baseClass}__content`}>

										<div className={`${baseClass}__inner-content`}>
											<InnerBlocks
												template={ TEMPLATE }
												templateInsertUpdatesSelection={ false }
												templateLock={ false }
											/>
										</div>

								</div>
							</div>

					</div>
				</div>
			</Fragment>
			

		);
	}
	componentDidMount(){
		const {
			attributes: {
				entranceAnimation,
			},
		} = this.props;

		if (!!entranceAnimation) {
			this.animate();
		}
	}

	componentDidUpdate(prevProps) {

		const {attributes: {
			entranceAnimation,
			entranceAnimationDuration
		}, baseClass, clientId} = this.props;

		const prevEntranceAnimation = prevProps.attributes.entranceAnimation,
			prevEntranceAnimationDuration = prevProps.attributes.entranceAnimationDuration;

		// Animate only on change effect or duration
		if (!!entranceAnimation && (
				prevEntranceAnimation !== entranceAnimation
				|| prevEntranceAnimationDuration !== entranceAnimationDuration
			)
		) {
			// WOW.js don't update animation-name style so reset it manually
			jQuery(`.${baseClass}-${clientId}`).css('animation-name', '');

			this.animate();
		}
	}

	animate(){
		const {baseClass, clientId} = this.props;

		// Reinit wow only for current block
		new WOW({
			boxClass: `${baseClass}-${clientId}`,
			scrollContainer: '.edit-post-layout__content',
			live: false,
			mobile: false
		}).init();
	}

	playBackgroundVideo(){

		const video = this.videoRef;

		if(!video.paused){
			video.pause();
			this.setState({
				videoPlayState: 'paused'
			})
		}else{
			video.play();
			this.setState({
				videoPlayState: 'playing'
			})
		}
	}

	onBackgroundVideoEnd(){
		this.setState({
			videoPlayState: 'paused'
		})
	}

	muteBackgroundVideo(){

		const video = this.videoRef;

		video.muted = !video.muted;

		this.setState({
			videoMuteState: video.muted
		});

	}

}

export default compose( [
	withColors( 'backgroundColor' ),
] )( Edit );