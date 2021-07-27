/**
 * External dependencies
 */
import Inspector from './inspector';
import './editor.scss';
import classnames from "classnames";
import render_style from 'GetwidUtils/render-style';


/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;
const {
	Dashicon
} = wp.components;
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	InnerBlocks,
} = wp.blockEditor || wp.editor;
const { prepareGradientStyle } = render_style;


/**
 * Module Constants
 */
const TEMPLATE = [
	[ 'core/paragraph' ],
];
const baseClass = 'wp-block-getwid-template-post-featured-background-image';


/**
 * Create an Component
 */
class Edit extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const {
			attributes: {
				minHeight,
				contentMaxWidth,

				foregroundOpacity,
				foregroundColor,
				foregroundFilter,

				verticalAlign, verticalAlignTablet, verticalAlignMobile,
				horizontalAlign, horizontalAlignTablet, horizontalAlignMobile,

				paddingTopValue,
				paddingBottomValue,
				paddingLeftValue,
				paddingRightValue,

				paddingTop, paddingRight, paddingBottom, paddingLeft,
				paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
				paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,
			},
			className,
			setAttributes,
		} = this.props;

		const wrapperClass = classnames(
			className,
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

				[`getwid-align-items-${verticalAlign}`]: verticalAlign !== 'center',
				[`getwid-align-items-tablet-${verticalAlignTablet}`]: verticalAlignTablet !== '',
				[`getwid-align-items-mobile-${verticalAlignMobile}`]: verticalAlignMobile !== '',

				[`getwid-justify-content-${horizontalAlign}`]: horizontalAlign !== 'center',
				[`getwid-justify-content-tablet-${horizontalAlignTablet}`]: horizontalAlignTablet !== '',
				[`getwid-justify-content-mobile-${horizontalAlignMobile}`]: horizontalAlignMobile !== '',
			}

		);

		const wrapperStyle = {
			minHeight: minHeight,
		};

		const containerClass = classnames(
			`${baseClass}__content`,
		);

		const containerStyle = {
			maxWidth: contentMaxWidth,
			...(paddingTop === 'custom' ? {paddingTop: paddingTopValue} : []),
			...(paddingBottom === 'custom' ? {paddingBottom: paddingBottomValue} : []),
			...(paddingLeft === 'custom' ? {paddingLeft: paddingLeftValue} : []),
			...(paddingRight === 'custom' ? {paddingRight: paddingRightValue} : [])
		};

		const foregroundStyle = {
			// opacity: foregroundOpacity !== undefined ? foregroundOpacity / 100 : undefined,
			backgroundColor: foregroundColor,
			...prepareGradientStyle('foreground', this.props),
			mixBlendMode: foregroundFilter,
		};

		const foregroundClass = classnames(
			`${baseClass}__foreground`,
			{
				[ `getwid-opacity-${foregroundOpacity}` ]: foregroundOpacity != 35,
			}
		);

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
				}} key='inspector'/>

				<div style={wrapperStyle} className={wrapperClass}>

					<div className="components-placeholder editor-media-placeholder wp-block-getwid-template-post-featured-background-image__image">
						<div className="components-placeholder__label">
							<Dashicon icon="format-image" />
						</div>
						<div className="components-placeholder__instructions">{__('Background Featured Image', 'getwid')}</div>
					</div>

					<div className={foregroundClass} style={foregroundStyle}></div>

					<div className={containerClass} style={containerStyle}>
						<InnerBlocks
							template={ TEMPLATE }
							templateInsertUpdatesSelection={ false }
							templateLock={ false }
						/>
					</div>
				</div>
			</Fragment>
		);

	}
}

export default ( Edit );
