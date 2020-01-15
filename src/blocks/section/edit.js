/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { isEqual, pick } from 'lodash';
import default_attributes from './attributes';

/**
* Internal dependencies
*/
import Dividers 				from './sub-components/dividers';
import BackgroundVideo 			from './sub-components/video';
import GetwidRullers 			from './sub-components/getwid-rullers';

import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';
import Dropdown from 'GetwidControls/custom-dropdown-control';
import { BackgroundSliderEdit as BackgroundSlider } from './sub-components/slider';

import Inspector from './inspector';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { select } = wp.data;
const { Button, IconButton, SelectControl, ButtonGroup, BaseControl, Dashicon, Tooltip, Toolbar, DropdownMenu, Path, SVG } = wp.components;
const { InnerBlocks, withColors, BlockControls, BlockAlignmentToolbar, MediaPlaceholder, MediaUpload, PanelColorSettings } = wp.blockEditor || wp.editor;
const { compose } = wp.compose;

const { jQuery: $ } = window;

/**
* Module Constants
*/
const TEMPLATE = [];
const baseClass = 'wp-block-getwid-section';
const ALLOWED_IMAGE_MEDIA_TYPES = [ 'image' ];

/**
* Create an Component
*/
class Edit extends Component {

	constructor(props) {
		super( props );

		this.videoRef = null;
		this.videoButtonRef = null;

		this.state = {
			skipLayout : false,
			draggablesObj: {},
			showRullers: true,
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

		this.changeState = this.changeState.bind( this );
	}

	changeState(param, value) {
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
	}

	render() {

		const { align, minHeight, gapSize, anchor, customBackgroundColor } = this.props.attributes;
		const { resetMinHeightTablet, resetMinHeightMobile, sliderImages, backgroundVideoUrl } = this.props.attributes;
		const { backgroundVideoControlsPosition, foregroundOpacity, foregroundColor, foregroundFilter, dividersBringTop } = this.props.attributes;
		
		const { contentMaxWidth, contentMaxWidthPreset, entranceAnimation, entranceAnimationDuration, entranceAnimationDelay } = this.props.attributes;
		const { backgroundImage, backgroundImagePosition, backgroundImageAttachment, backgroundImageRepeat, backgroundImageSize } = this.props.attributes;
		const { paddingTopValue, paddingBottomValue, paddingLeftValue, paddingRightValue, marginTopValue, marginBottomValue, marginLeftValue, marginRightValue } = this.props.attributes;
		
		const { paddingTop, paddingRight, paddingBottom, paddingLeft } = this.props.attributes;
		const { paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet } = this.props.attributes;
		const { paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile } = this.props.attributes;

		const { marginTop, marginRight, marginBottom, marginLeft } = this.props.attributes;
		const { marginTopTablet, marginRightTablet, marginBottomTablet, marginLeftTablet } = this.props.attributes;
		const { verticalAlign, verticalAlignTablet, verticalAlignMobile, horizontalAlign, horizontalAlignTablet, horizontalAlignMobile } = this.props.attributes;

		const { marginTopMobile, marginRightMobile, marginBottomMobile, marginLeftMobile } = this.props.attributes;
		const { className,backgroundColor,setBackgroundColor, prepareGradientStyle, prepareBackgroundImageStyles, setAttributes, isSelected } = this.props;

		const { showRullers, skipLayout } = this.state;
		const { isLockedPaddingsOnDesktop, isLockedPaddingsOntablet, isLockedPaddingsOnMobile } = this.state;
		const { isLockedMarginsOnDesktop , isLockedMarginsOnTablet , isLockedMarginsOnMobile  } = this.state;

		const changeState = this.changeState;

		const { clientId } = this.props;

		const sectionStyle = {
			...(marginTop === 'custom' ? { marginTop: marginTopValue } : []),
			...(marginBottom === 'custom' ? { marginBottom: marginBottomValue } : [])
		};

        const wrapperStyle = {
			minHeight: minHeight,
			...(marginLeft  === 'custom' ? { marginLeft: marginLeftValue   } : []),
			...(marginRight === 'custom' ? { marginRight: marginRightValue } : []),
			...(paddingTop  === 'custom' ? { paddingTop: paddingTopValue   } : []),

			...(paddingBottom === 'custom' ? { paddingBottom: paddingBottomValue } : []),
			...(paddingLeft   === 'custom' ? { paddingLeft  : paddingLeftValue   } : []),
			...(paddingRight  === 'custom' ? { paddingRight : paddingRightValue  } : [])
        };

		const wrapperClasses = classnames( `${baseClass}__wrapper`, {
				[ `getwid-padding-top-${paddingTop}`       ]: paddingTop    !== 'custom' && paddingTop    !== '',
				[ `getwid-padding-bottom-${paddingBottom}` ]: paddingBottom !== 'custom' && paddingBottom !== '',
				[ `getwid-padding-left-${paddingLeft}`     ]: paddingLeft   !== 'custom' && paddingLeft   !== '',
				[ `getwid-padding-right-${paddingRight}`   ]: paddingRight  !== 'custom' && paddingRight  !== '',

				[ `getwid-padding-tablet-top-${paddingTopTablet}`      ]: paddingTopTablet    !== '',
				[ `getwid-padding-tablet-bottom-${paddingBottomTablet}`]: paddingBottomTablet !== '',
				[ `getwid-padding-tablet-left-${paddingLeftTablet}`    ]: paddingLeftTablet   !== '',
				[ `getwid-padding-tablet-right-${paddingRightTablet}`  ]: paddingRightTablet  !== '',

				[ `getwid-padding-mobile-top-${paddingTopMobile}`      ]: paddingTopMobile    !== '',
				[ `getwid-padding-mobile-bottom-${paddingBottomMobile}`]: paddingBottomMobile !== '',
				[ `getwid-padding-mobile-left-${paddingLeftMobile}`    ]: paddingLeftMobile   !== '',
				[ `getwid-padding-mobile-right-${paddingRightMobile}`  ]: paddingRightMobile  !== '',

				[ `getwid-margin-left-${marginLeft}`   ]: marginLeft  !== 'custom' && marginLeft  !== '',
				[ `getwid-margin-right-${marginRight}` ]: marginRight !== 'custom' && marginRight !== '',

				[ `getwid-margin-tablet-left-${marginLeftTablet}`  ]: marginLeftTablet !== '',
				[ `getwid-margin-tablet-right-${marginRightTablet}`]: marginRightTablet !== '',

				[ `getwid-margin-mobile-left-${marginLeftMobile}`  ]: marginLeftMobile !== '',
				[ `getwid-margin-mobile-right-${marginRightMobile}`]: marginRightMobile !== '',

				[ `getwid-align-items-${verticalAlign}`             ]: verticalAlign       !== 'center',
				[ `getwid-align-items-tablet-${verticalAlignTablet}`]: verticalAlignTablet !== '',
				[ `getwid-align-items-mobile-${verticalAlignMobile}`]: verticalAlignMobile !== '',

				[ `getwid-justify-content-${horizontalAlign}`             ]: horizontalAlign       !== 'center',
				[ `getwid-justify-content-tablet-${horizontalAlignTablet}`]: horizontalAlignTablet !== '',
				[ `getwid-justify-content-mobile-${horizontalAlignMobile}`]: horizontalAlignMobile !== '',

				'getwid-reset-min-height-tablet': resetMinHeightTablet !== false,
				'getwid-reset-min-height-mobile': resetMinHeightMobile !== false
			}
		);

		const backgroundStyle = {
			backgroundColor: backgroundColor.color ? backgroundColor.color : customBackgroundColor,
			...prepareGradientStyle( 'background', this.props ),
			...prepareBackgroundImageStyles( 'background', this.props )
		};

		const backgroundClass = classnames(`${baseClass}__background`, {
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		});

		const foregroundStyle = {
			opacity: foregroundOpacity !== undefined ? foregroundOpacity / 100 : undefined,
			backgroundColor: foregroundColor,
			...prepareGradientStyle( 'foreground', this.props ),
			...prepareBackgroundImageStyles( 'foreground', this.props ),
			mixBlendMode: foregroundFilter
		};

		const innerWrapperStyle = {
			maxWidth: (contentMaxWidth && contentMaxWidthPreset === 'custom') ? `${contentMaxWidth}px` : undefined
		};

		const wowData = !!entranceAnimation ? {
			'data-wow-duration':  entranceAnimationDuration !== undefined ? entranceAnimationDuration : '2000ms',
			'data-wow-delay'   : entranceAnimationDelay     !== undefined ? entranceAnimationDelay    : '500ms'
		} : {};

		const sectionClasses = classnames(className,
			`${baseClass}-${clientId}`,
			{
				[ `has-inner-blocks-gap-${gapSize}` ]: gapSize   !== undefined && gapSize   !== '',
				[ `getwid-margin-top-${marginTop}`  ]: marginTop !== 'custom'  && marginTop !== '',
				[ `getwid-anim ${entranceAnimation}`]: !!entranceAnimation,

				[ `getwid-margin-bottom-${marginBottom}`       ]: marginBottom    !== 'custom' && marginBottom    !== '',
				[ `getwid-margin-tablet-top-${marginTopTablet}`]: marginTopTablet !== 'custom' && marginTopTablet !== '',

				[ `getwid-margin-tablet-bottom-${marginBottomTablet}`]: marginBottomTablet !== 'custom' && marginBottomTablet !== '',
				[ `getwid-margin-mobile-top-${marginTopMobile}`      ]: marginTopMobile    !== 'custom' && marginTopMobile    !== '',
				[ `getwid-margin-mobile-bottom-${marginBottomMobile}`]: marginBottomMobile !== 'custom' && marginBottomMobile !== '',

				'getwid-section-content-full-width'  : contentMaxWidthPreset === 'full',
				'getwid-section-content-custom-width': contentMaxWidthPreset === 'custom',
			}
		);

		const id = anchor ? anchor : undefined;
		
		const templates = [
			{
				'title': __( 'Wide Screen. Section full width, content fixed.', 'getwid' ),
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48" width="48" height="48"><path d="M41,32.99v-2.13v-0.71v-3.53v-0.71v-3.53v-0.71v-3.53v-0.71v-2.42c0-0.32-0.08-0.62-0.22-0.9l0,0c0,0,0,0,0,0	c-0.33-0.66-1-1.11-1.79-1.11h-1.33h-0.71H33.4h-0.71h-3.53h-0.71h-3.53h-0.71h-3.53h-0.71h-3.53h-0.71H12.2h-0.71H9.01	C7.9,13,7,13.9,7,15.01v2.48v0.71v3.53v0.71v3.53v0.71v3.53v0.71v2.07c0,0.41,0.13,0.8,0.34,1.12l0,0c0,0,0,0,0,0	c0.09,0.14,0.21,0.26,0.33,0.37l0,0l0,0C8.03,34.8,8.5,35,9.01,35h1.68h0.71h3.55h0.71h3.53h0.71h3.53h0.71h3.53h0.71h3.53h0.71	h3.53h0.71h2.13C40.1,35,41,34.1,41,32.99z M38.99,23.68L37,25.67v-3.53l1.99-1.99V23.68z M38.99,19.44L37,21.43v-0.42	c0-0.84-0.52-1.56-1.25-1.86l3.24-3.24V19.44z M38.99,15v0.2l-3.82,3.82h0C35.11,19.01,35.05,19,34.99,19h-3.33l4-4H38.99z	 M13,26.99L13.01,21h21.98v6L13,26.99z M34.95,15l-4,4H27.4l4-4H34.95z M30.69,15l-4,4h-3.53l4-4H30.69z M26.45,15l-4,4h-3.53l4-4	H26.45z M22.21,15l-4,4h-3.53l4-4H22.21z M9.01,15h0.48l-0.48,0.48L9.01,15z M9.01,16.19L10.2,15h3.53l-4.72,4.72L9.01,16.19z	 M9.01,20.43L14.44,15h3.53l-4,4h-0.96C11.9,19,11,19.9,11,21.01v0.96l-1.99,1.99L9.01,20.43z M9,24.67l2-2v3.53l-2,2L9,24.67z	 M9,28.92l2-2v0.07c0,0.94,0.65,1.72,1.52,1.94L9,32.45L9,28.92z M9.17,32.99L13.16,29h3.53l-3.99,3.99L9.17,32.99z M13.41,32.99	L17.4,29h3.55l-3.99,3.99L13.41,32.99z M17.66,32.99L21.66,29h3.53l-3.99,3.99L17.66,32.99z M21.9,32.99L25.9,29h3.53l-4,4	L21.9,32.99z M26.14,33l4-4h3.53l-4,4L26.14,33z M30.38,33l4-4h0.61C36.1,29,37,28.1,37,26.99v-0.61l1.99-1.99v3.53L33.91,33	L30.38,33z M34.62,33l4.37-4.37v3.53L38.15,33L34.62,33z M38.86,33l0.13-0.13V33L38.86,33z"/><path d="M6.01,6H9V4H6.01C4.9,4,4,4.9,4,6.01V9h2.01V6z"/><path d="M41.99,4H39v2h2.99v3H44V6.01C44,4.9,43.1,4,41.99,4z"/><path d="M6.01,39H4v2.99C4,43.1,4.9,44,6.01,44H9v-2H6.01V39z"/><path d="M41.99,42H39v2h2.99C43.1,44,44,43.1,44,41.99V39h-2.01V42z"/></svg>,
				'layout': () => {
					this.setState( () => ({ skipLayout: true }) );
					setAttributes( {						
						align: 'full'
					} );
				}
			},
			{
				'title': __( 'Full Width. Section and content full width.', 'getwid' ),
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48" width="48" height="48"><path d="M41,32.99v-2.13v-0.71V29V19v-3.99c0-0.32-0.08-0.62-0.22-0.9l0,0c0,0,0,0,0,0c-0.33-0.66-1-1.11-1.79-1.11h-1.33h-0.71	H33.4h-0.71h-3.53h-0.71h-3.53h-0.71h-3.53h-0.71h-3.53h-0.71H12.2h-0.71H9.01C7.9,13,7,13.9,7,15.01v2.48v0.71V19v10v1.21v0.71	v2.07c0,0.41,0.13,0.8,0.34,1.12l0,0c0,0,0,0,0,0c0.09,0.14,0.21,0.26,0.33,0.37l0,0l0,0C8.03,34.8,8.5,35,9.01,35h1.68h0.71h3.55	h0.71h3.53h0.71h3.53h0.71h3.53h0.71h3.53h0.71h3.53h0.71h2.13C40.1,35,41,34.1,41,32.99z M9.01,21h29.98v6H9L9.01,21z M38.99,19	H35.9l3.09-3.09V19z M38.99,15v0.2l-3.8,3.8h-3.53l4-4H38.99z M34.95,15l-4,4H27.4l4-4H34.95z M30.69,15l-4,4h-3.53l4-4H30.69z	 M26.45,15l-4,4h-3.53l4-4H26.45z M22.21,15l-4,4h-3.53l4-4H22.21z M17.97,15l-4,4h-3.53l4-4H17.97z M9.01,15h0.48l-0.48,0.48	L9.01,15z M9.01,16.19L10.2,15h3.53l-4,4H9.01L9.01,16.19z M9,29h3.45L9,32.45L9,29z M9.17,32.99L13.16,29h3.53l-3.99,3.99	L9.17,32.99z M13.41,32.99L17.4,29h3.55l-3.99,3.99L13.41,32.99z M17.66,32.99L21.66,29h3.53l-3.99,3.99L17.66,32.99z M21.9,32.99	L25.9,29h3.53l-4,4L21.9,32.99z M26.14,33l4-4h3.53l-4,4L26.14,33z M30.38,33l4-4h3.53l-4,4L30.38,33z M34.62,33l4-4h0.37v3.16	L38.15,33L34.62,33z M38.86,33l0.13-0.13V33L38.86,33z"/><path d="M6.01,6H9V4H6.01C4.9,4,4,4.9,4,6.01V9h2.01V6z"/><path d="M41.99,4H39v2h2.99v3H44V6.01C44,4.9,43.1,4,41.99,4z"/><path d="M6.01,39H4v2.99C4,43.1,4.9,44,6.01,44H9v-2H6.01V39z"/><path d="M41.99,42H39v2h2.99C43.1,44,44,43.1,44,41.99V39h-2.01V42z"/></svg>,
				'layout': () => {
					this.setState( () => ({ skipLayout: true }) );
					setAttributes( {						
						align: 'full',
						contentMaxWidthPreset: 'full'
					} );
				}
			},
			{
				'title': __( 'Full Screen. Section full screen, content fixed.', 'getwid' ),
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48" width="48" height="48"><path d="M6.01,6H9V4H6.01C4.9,4,4,4.9,4,6.01V9h2.01V6z"/><path d="M41.99,4H39v2h2.99v3H44V6.01C44,4.9,43.1,4,41.99,4z"/><path d="M6.01,39H4v2.99C4,43.1,4.9,44,6.01,44H9v-2H6.01V39z"/><path d="M41.99,42H39v2h2.99C43.1,44,44,43.1,44,41.99V39h-2.01V42z"/><path d="M39.38,40.96c0.8-0.16,1.42-0.78,1.58-1.58l0,0c0.02-0.13,0.04-0.26,0.04-0.39v-0.36V35.1v-0.71v-3.53v-0.71v-3.53v-0.71	v-3.53v-0.71v-3.53v-0.71V13.9v-0.71V9.66V9.01c0-0.02-0.01-0.04-0.01-0.06l0,0C40.97,8,40.28,7.21,39.36,7.04l0,0	C39.24,7.01,39.12,7,38.99,7h-0.3h-3.53h-0.71h-3.53h-0.71h-3.53h-0.71h-3.53h-0.71H18.2h-0.71h-3.53h-0.71H9.01C7.9,7,7,7.9,7,9.01	v4.24v0.71v3.53v0.71v3.53v0.71v3.53v0.71v3.53v0.71v3.53v0.71v3.53v0.3c0,0.13,0.01,0.25,0.04,0.37l0,0	c0.17,0.91,0.96,1.6,1.92,1.63l0,0c0.02,0,0.04,0.01,0.06,0.01h0.65h3.53h0.71h3.53h0.71h3.53h0.71h3.53h0.71h3.53h0.71h3.53h0.71	h3.53h0.36C39.12,41,39.25,40.99,39.38,40.96L39.38,40.96z M38.99,23.68L37,25.67v-3.53l1.99-1.99V23.68z M38.99,19.44L37,21.43	v-0.42c0-0.84-0.52-1.56-1.25-1.86l3.24-3.24V19.44z M38.99,15.2l-3.82,3.82h0C35.11,19.01,35.05,19,34.99,19h-3.33l7.33-7.33V15.2z	 M13,26.99L13.01,21h21.98v6L13,26.99z M38.99,9v1.96L30.95,19H27.4l10-10H38.99z M36.69,9l-10,10h-3.53l10-10H36.69z M32.45,9	l-10,10h-3.53l10-10H32.45z M28.21,9l-10,10h-3.53l10-10H28.21z M9.01,9h2.24l-2.24,2.24L9.01,9z M9.01,11.95L11.96,9h3.53	l-6.48,6.48L9.01,11.95z M9.01,16.19L16.2,9h3.53L9.01,19.72L9.01,16.19z M9.01,20.43L20.44,9h3.53l-10,10h-0.96	C11.9,19,11,19.9,11,21.01v0.96l-1.99,1.99L9.01,20.43z M9,24.67l2-2v3.53l-2,2L9,24.67z M9,28.92l2-2v0.07	c0,0.94,0.65,1.72,1.52,1.94L9,32.45L9,28.92z M9,33.16L13.16,29h3.53L9,36.69L9,33.16z M9,38.99l0-1.59l8.4-8.4h3.55l-9.99,9.99	L9,38.99z M11.66,38.99L21.66,29h3.53l-9.99,9.99L11.66,38.99z M15.9,38.99L25.9,29h3.53l-9.99,9.99L15.9,38.99z M20.14,38.99	L30.14,29h3.53l-9.99,9.99L20.14,38.99z M24.38,39l10-10h0.61C36.1,29,37,28.1,37,26.99v-0.61l1.99-1.99v3.53L27.91,39L24.38,39z	 M28.62,39l10.37-10.37v3.53L32.15,39L28.62,39z M32.86,39l6.13-6.13v3.53l-2.6,2.6L32.86,39z M37.1,39l1.89-1.89V39L37.1,39z"/></svg>,
				'layout': () => {
					this.setState( () => ({ skipLayout: true }) );
					setAttributes( {						
						align: 'full',
						minHeight: '100vh'
					} );
				}
			},
		];

		const verticalAlignControls = [ 'flex-start', 'center', 'flex-end' ];
		const verticalAligns = {
			'flex-start': {
				title: __( 'Top', 'getwid' ),
				icon: <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z" /></SVG>
			},
			'center': {
				title: __( 'Middle', 'getwid' ),
				icon: <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M8 19h3v4h2v-4h3l-4-4-4 4zm8-14h-3V1h-2v4H8l4 4 4-4zM4 11v2h16v-2H4z"/></SVG>
			},
			'flex-end': {
				title: __( 'Bottom', 'getwid' ),
				icon: <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z" /></SVG>
			}
		};

		const horizontalAlignControls = [ 'flex-start', 'center', 'flex-end' ];
		const horizontalAligns = {
			'flex-start': {
				title: __( 'Left', 'getwid' ),
				icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 20 20"><path d="M2,15V5c0-0.55,0.45-1,1-1h0c0.55,0,1,0.45,1,1v10c0,0.55-0.45,1-1,1h0C2.45,16,2,15.55,2,15z"/><path d="M6,10l3,3v-2h8c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H9V7L6,10z"/></svg>
			},
			'center': {
				title: __( 'Center', 'getwid' ),
				icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 20 20"><path d="M9,15V5c0-0.55,0.45-1,1-1h0c0.55,0,1,0.45,1,1v10c0,0.55-0.45,1-1,1h0C9.45,16,9,15.55,9,15z"/><path d="M12,10l3,3v-2h2c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1h-2V7L12,10z"/><path d="M8,10l-3,3v-2H3c-0.55,0-1-0.45-1-1v0c0-0.55,0.45-1,1-1h2V7L8,10z"/></svg>
			},
			'flex-end': {
				title: __( 'Right', 'getwid' ),
				icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 20 20"><path d="M16,15V5c0-0.55,0.45-1,1-1h0c0.55,0,1,0.45,1,1v10c0,0.55-0.45,1-1,1h0C16.45,16,16,15.55,16,15z"/><path d="M14,10l-3,3v-2H3c-0.55,0-1-0.45-1-1v0c0-0.55,0.45-1,1-1h8V7L14,10z"/></svg>
			}
		};

		const hasInnerBlocks =  select( 'core/block-editor' ).getBlocks( clientId ).length > 0;

		let hasAttributesChanges = false;

		$.each(this.props.attributes, function (key, value) { 
			if (!isEqual(value, default_attributes[key].default)){
				hasAttributesChanges = true;
				return false;
			}
		});

		return (
			<Fragment>
				{ (
					!hasInnerBlocks && skipLayout == false && !hasAttributesChanges ) ? (
					<div className='components-placeholder block-editor-inner-blocks__template-picker has-many-options'>
						<div className='components-placeholder__label'>
							<Dashicon icon='layout' />{__( 'Choose Section Layout', 'getwid' )}
						</div>
						<div className='components-placeholder__instructions'>{__('Select a layout to start with, or make one yourself.', 'getwid')}</div>
						<div className='components-placeholder__fieldset'>
							<ul className='block-editor-inner-blocks__template-picker-options'>
								{
								templates.map((key, index) => {
									return (
										<li>
											<Tooltip text={key.title}>
												<Button
													className='components-icon-button block-editor-inner-blocks__template-picker-option is-button is-default is-large'
													key={ index }
													onClick={
														() => {
															key.layout();
														}
													}
												>
													{key.icon}
												</Button>
											</Tooltip>
										</li>
									);
								})
							}
							</ul>
							<div class='block-editor-inner-blocks__template-picker-skip'>
								<Button
									className='components-button is-link'
									onClick={
										() => {
											this.setState( () => ({ skipLayout: true }) );
										}
									}
								>
									{__( 'Skip', 'getwid' )}
								</Button>
							</div>
						</div>
					</div>
				) : (
					<Fragment>
						<BlockControls>
							<BlockAlignmentToolbar
								value={align}
								isCollapsed={false}
								controls={[ 'wide', 'full' ]}
								onChange={ value => setAttributes({ align: value }) }
							/>							

							<DropdownMenu
								icon={verticalAligns[ verticalAlign ].icon}
								hasArrowIndicator={true}
								className='components-toolbar'
								label={__( 'Vertical Alignment', 'getwid' )}
								controls={
									verticalAlignControls.map( control => {
										return {
											...verticalAligns[ control ],
											isActive: verticalAlign === control,
											onClick: () => {
												setAttributes({ verticalAlign: control });
											}
										};
									} )
								}
							/>
							<DropdownMenu
								icon={horizontalAligns[ horizontalAlign ].icon}
								hasArrowIndicator={true}
								className='components-toolbar'
								label={__( 'Horizontal Alignment', 'getwid' )}
								controls={
									horizontalAlignControls.map( control => {
										return {
											...horizontalAligns[ control ],
											isActive: horizontalAlign === control,
											onClick: ()=>{
												setAttributes({ horizontalAlign: control });
											},
										};
									} )
								}
							/>

							<Dropdown
								className='components-toolbar'
								renderToggle={({ isOpen, onToggle }) => (
									<IconButton
										icon={<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 20 20" width="20" height="20"><path d="M3,16h14c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H3c-0.55,0-1-0.45-1-1v0C2,16.45,2.45,16,3,16z"/><path d="M9.05,13.95L13.3,9.7c0.39-0.39,0.39-1.02,0-1.41L9.05,4.05L8.34,3.34L7.63,2.63c-0.39-0.39-1.02-0.39-1.41,0L6.22,2.64	c-0.39,0.39-0.39,1.02,0,1.41l0.7,0.7L3.39,8.3C3,8.69,3,9.31,3.39,9.7l4.24,4.25C8.02,14.34,8.66,14.34,9.05,13.95z M9.04,6.87	L11.17,9H5.51l2.13-2.13C8.02,6.49,8.66,6.49,9.04,6.87z"/><path d="M13,13c0,0.55,0.45,1,1,1s1-0.45,1-1s-1-3-1-3S13,12.45,13,13z"/></svg>}
										className='alignright'
										onClick={onToggle}
									/>
								)}
								renderContent={({ onClose }) => (
									<Fragment>
										<div class='components-getwid-toolbar-popup-wrapper-close small-icon'>
											<IconButton
												icon='no-alt'
												className='alignright'
												onClick={() => {
													onClose(true);
												}}
											/>
										</div>

										<PanelColorSettings
											title={__( 'Colors', 'getwid' )}
											initialOpen={true}
											className='getwid-custom-pallete'
											colorSettings={[
												{
													value: backgroundColor.color,
													onChange: setBackgroundColor,
													label: __( 'Text Color', 'getwid' )
												},						
											]}
										/>
									</Fragment>
								)}
							/>

							<Dropdown
								className='components-toolbar'
								contentClassName={`getwid-popover-wrapper`}
								renderToggle={({ isOpen, onToggle }) =>
									<IconButton
										icon='format-image'
										className='alignright'
										onClick={() => { onToggle(); }}
									/>
								}
								renderContent={({ onClose }) => (
									<Fragment>
										<div class='components-getwid-toolbar-popup-wrapper-close small-icon'>
											{ backgroundImage && (
												<IconButton
													icon='no-alt'
													className='alignright'
													onClick={() => {
														onClose(true);
													}}
												/>
											)}
										</div>

										{ ! backgroundImage && (
											<MediaPlaceholder
												icon='format-image'
												labels={{
													title: __( 'Background Image', 'getwid' ),
													instructions: __( 'Upload an image file or pick one from your media library.', 'getwid' )
												}}
												onSelect={backgroundImage => {

													setAttributes({
														backgroundImage: backgroundImage !== undefined ? pick( backgroundImage, [ 'alt', 'id', 'url' ] ) : {}
													});
													onClose(true);
												} }
												accept='image/*'
												allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
											/>
										)}

										{ !!backgroundImage && (
											<MediaUpload
												onSelect={backgroundImage => {

													setAttributes({
														backgroundImage: backgroundImage !== undefined ? pick( backgroundImage, [ 'alt', 'id', 'url' ] ) : {}
													});
													onClose(true);
												}}
												allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
												value={backgroundImage !== undefined ? backgroundImage.id : ''}
												render={({ open }) => (
													<BaseControl>
														{ !!backgroundImage.url &&
															<div
																onClick={open}
																className='getwid-background-image-wrapper'
															>
																<img src={backgroundImage.url}/>
															</div>
														}

														<ButtonGroup>
															<Button
																isPrimary
																onClick={open}
															>
																{!backgroundImage.id  && __( 'Select Image', 'getwid' )}
																{!!backgroundImage.id && __( 'Replace Image', 'getwid' )}
															</Button>

															{!!backgroundImage.id && (
																<Button
																	isDefault
																	onClick={() => {
																		setAttributes({ backgroundImage: undefined })
																	}}
																>
																	{__( 'Remove Image', 'getwid' )}
																</Button>
															)}
														</ButtonGroup>
													</BaseControl>
												) }
											/>
										)}

										{!!backgroundImage && (
											<Fragment>
												<SelectControl
													label={__( 'Position', 'getwid' )}
													value={backgroundImagePosition !== undefined ? backgroundImagePosition : ''}
													onChange={backgroundImagePosition => setAttributes({ backgroundImagePosition })}
													options={[
														/*Center*/
														{ value: ''             , label: __( 'Default'	    , 'getwid' ) },
														{ value: 'top left'     , label: __( 'Top Left'	    , 'getwid' ) },
														{ value: 'top center'   , label: __( 'Top Center'   , 'getwid' ) },
														{ value: 'top right'    , label: __( 'Top Right'    , 'getwid' ) },
														{ value: 'center left'  , label: __( 'Center Left ' , 'getwid' ) },
														{ value: 'center center', label: __( 'Center Center', 'getwid' ) },
														{ value: 'center right' , label: __( 'Center Right' , 'getwid' ) },
														{ value: 'bottom left'  , label: __( 'Bottom Left'  , 'getwid' ) },
														{ value: 'bottom center', label: __( 'Bottom Center', 'getwid' ) },
														{ value: 'bottom right' , label: __( 'Bottom Right' , 'getwid' ) }
													]}
												/>
												<SelectControl
													label={__( 'Attachment', 'getwid' )}
													value={backgroundImageAttachment !== undefined ? backgroundImageAttachment : ''}
													onChange={backgroundImageAttachment => setAttributes({ backgroundImageAttachment })}
													options={[
														/*Inherit*/
														{ value: ''      , label: __( 'Default', 'getwid' ) },
														{ value: 'scroll', label: __( 'Scroll' , 'getwid' ) },
														{ value: 'fixed' , label: __( 'Fixed'  , 'getwid' ) }
													]}
												/>
												<SelectControl
													label={__( 'Repeat', 'getwid' )}
													value={backgroundImageRepeat !== undefined ? backgroundImageRepeat : ''}
													onChange={backgroundImageRepeat => setAttributes({ backgroundImageRepeat })}
													options={[
														/*Inherit*/
														{ value: ''         , label: __( 'Default'  , 'getwid' ) },
														{ value: 'no-repeat', label: __( 'No Repeat', 'getwid' ) },
														{ value: 'repeat'   , label: __( 'Repeat'   , 'getwid' ) },
														{ value: 'repeat-x' , label: __( 'Repeat X' , 'getwid' ) },
														{ value: 'repeat-y' , label: __( 'Repeat Y' , 'getwid' ) },
														{ value: 'space'    , label: __( 'Space'    , 'getwid' ) },
														{ value: 'round'    , label: __( 'Round'    , 'getwid' ) }
													]}
												/>
												<SelectControl
													label={__('Size', 'getwid')}
													value={backgroundImageSize !== undefined ? backgroundImageSize : ''}
													onChange={backgroundImageSize => setAttributes({ backgroundImageSize })}
													options={[
														/*Cover*/
														{ value: ''       , label: __( 'Cover'  , 'getwid' ) },
														{ value: 'contain', label: __( 'Contain', 'getwid' ) },
														{ value: 'auto'   , label: __( 'Auto'   , 'getwid' ) }
													]}
												/>
											</Fragment>
										)}
									</Fragment>
								)}
							/>

							<Toolbar controls={[
								{
									icon: <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><g><path d="M24.4003906,22.5996094H7.5996094c-0.5527344,0-1-0.4472656-1-1V10.4003906c0-0.5527344,0.4472656-1,1-1h16.8007813    c0.5527344,0,1,0.4472656,1,1v11.1992188C25.4003906,22.1523438,24.953125,22.5996094,24.4003906,22.5996094z     M8.5996094,20.5996094h14.8007813v-9.1992188H8.5996094V20.5996094z"/></g><g><path d="M2,11.5996094c-0.5527344,0-1-0.4472656-1-1V5c0-0.5527344,0.4472656-1,1-1h5.5996094c0.5527344,0,1,0.4472656,1,1    s-0.4472656,1-1,1H3v4.5996094C3,11.1523438,2.5527344,11.5996094,2,11.5996094z"/></g><g><path d="M30,11.5996094c-0.5527344,0-1-0.4472656-1-1V6h-4.5996094c-0.5527344,0-1-0.4472656-1-1s0.4472656-1,1-1H30    c0.5527344,0,1,0.4472656,1,1v5.5996094C31,11.1523438,30.5527344,11.5996094,30,11.5996094z"/></g><g><path d="M7.5996094,28H2c-0.5527344,0-1-0.4472656-1-1v-5.5996094c0-0.5527344,0.4472656-1,1-1s1,0.4472656,1,1V26h4.5996094    c0.5527344,0,1,0.4472656,1,1S8.1523438,28,7.5996094,28z"/></g><g><path d="M30,28h-5.5996094c-0.5527344,0-1-0.4472656-1-1s0.4472656-1,1-1H29v-4.5996094c0-0.5527344,0.4472656-1,1-1    s1,0.4472656,1,1V27C31,27.5527344,30.5527344,28,30,28z"/></g></g></svg>,
									title: __( 'Show Guides', 'getwid' ),
									isActive: showRullers,
									onClick: () => {
										this.setState({ showRullers: !showRullers });
									}
								}
							]}/>							
						</BlockControls>

						<Inspector {...{
							...this.props,
							...{ isLockedPaddingsOnDesktop, isLockedPaddingsOntablet, isLockedPaddingsOnMobile },
							...{ isLockedMarginsOnDesktop, isLockedMarginsOnTablet, isLockedMarginsOnMobile },
							baseClass,
							changeState
						}} key='inspector'/>
						<div
							id={id}
							className={sectionClasses}
							style={sectionStyle}
							{...wowData}
						>
							<GetwidRullers {...{
								...{ paddingBottom, paddingRight, paddingLeft, paddingTop },
								...{ paddingBottomValue, paddingRightValue, paddingLeftValue, paddingTopValue },

								...{ marginBottom, marginRight, marginLeft, marginTop },
								...{ marginBottomValue, marginRightValue, marginLeftValue, marginTopValue },

								changeState,
								setAttributes,
                                showRullers,
                                isSelected,
                                baseClass,
								clientId,
                                isLayoutSet : (hasInnerBlocks || skipLayout || hasAttributesChanges),
							}}>
								<div className={wrapperClasses} style={wrapperStyle}>
									<Dividers {...{...this.props, baseClass}} />
										{
											(!!backgroundVideoUrl && backgroundVideoControlsPosition !== 'none') && (
												<div
													className={
														classnames( 'getwid-background-video-controls', {
																[ `is-position-${backgroundVideoControlsPosition}` ]: backgroundVideoControlsPosition !== 'top-right'
															}
														)
													}
												>
													<button
														onClick={this.playBackgroundVideo}
														className='getwid-background-video-play'
														ref={node => this.videoButtonRef = node}
													>
														{
															this.state.videoPlayState === 'paused' &&
															<i className='getwid-icon getwid-icon-play'></i>
														}
														{
															this.state.videoPlayState === 'playing' &&
															<i className='getwid-icon getwid-icon-pause'></i>
														}
													</button>
													<button
														onClick={this.muteBackgroundVideo}
														className='getwid-background-video-mute'
													>
														{
															this.state.videoMuteState === true &&
															<i className='getwid-icon getwid-icon-mute'></i>
														}
														{
															this.state.videoMuteState === false &&
															<i className='getwid-icon getwid-icon-volume-up'></i>
														}
													</button>
												</div>
											)
										}

										<div className={classnames( `${baseClass}__inner-wrapper`, {
												[ `has-dividers-over` ]: dividersBringTop,
											})} style={innerWrapperStyle}>
											<div className={`${baseClass}__background-holder`}>
												<div className={backgroundClass} style={backgroundStyle}>
													{
														!!backgroundImage && (
															<div className={`${baseClass}__background-image-wrapper`}><img className={`${baseClass}__background-image`} src={backgroundImage.url}
																alt={backgroundImage.alt} data-id={backgroundImage.id}/></div>
														)
													}
													{
														!!sliderImages.length && (
															<div className={`${baseClass}__background-slider-wrapper`}><BackgroundSlider {...{...this.props, baseClass}}/></div>
														)													
													}
													{
														!!backgroundVideoUrl &&
														<div className={`${baseClass}__background-video-wrapper`}>
															<BackgroundVideo
																{...{...this.props, baseClass}}
																onVideoEnd={this.onBackgroundVideoEnd}
																videoAutoplay={false}
																videoMute={this.state.videoMuteState}
																videoElemRef={node => this.videoRef = node}
															/>
														</div>
													}
												</div>
												<div className={`${baseClass}__foreground`} style={foregroundStyle}></div>
											</div>
											<div className={`${baseClass}__content`}>

												<div className={`${baseClass}__inner-content`}>
													<InnerBlocks
														renderAppender={ () => (
															<InnerBlocks.ButtonBlockAppender/>
														) }
														defaultBlock={false}
														template={TEMPLATE}
														templateInsertUpdatesSelection={false}
														templateLock={false}
													/>
												</div>
											</div>
										</div>
								</div>
							</GetwidRullers>
						</div>
					</Fragment>
				)}
			</Fragment>
		);
	}

	componentDidMount() {
		const { entranceAnimation } = this.props.attributes;

		if ( !! entranceAnimation ) {
			this.animate();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { entranceAnimation, entranceAnimationDuration } = this.props.attributes;
		const { baseClass, clientId, isSelected } = this.props;

		const prevEntranceAnimation = prevProps.attributes.entranceAnimation;
		const prevEntranceAnimationDuration = prevProps.attributes.entranceAnimationDuration;

		//Animate only on change effect or duration
		if ( !! entranceAnimation && (
				prevEntranceAnimation !== entranceAnimation
				|| prevEntranceAnimationDuration !== entranceAnimationDuration
			)
		) {
			//WOW.js don't update animation-name style so reset it manually
			$( `.${baseClass}-${clientId}` ).css( 'animation-name', '' );

			this.animate();
		}
	}

	animate() {
		const {baseClass, clientId} = this.props;

		// Reinit wow only for current block
		new WOW({
			boxClass: `${baseClass}-${clientId}`,
			scrollContainer: '.edit-post-layout__content',
			live: false,
			mobile: false
		}).init();
	}

	playBackgroundVideo() {

		const video = this.videoRef;

		if( ! video.paused) {
			video.pause();
			this.setState({
				videoPlayState: 'paused'
			});
		} else {
			video.play();
			this.setState({
				videoPlayState: 'playing'
			});
		}
	}

	onBackgroundVideoEnd() {
		this.setState({
			videoPlayState: 'paused'
		});
	}

	muteBackgroundVideo() {
		const video = this.videoRef;

		video.muted = ! video.muted;

		this.setState({
			videoMuteState: video.muted
		});
	}
}

export default compose([
	withColors( 'backgroundColor' )
])( Edit );