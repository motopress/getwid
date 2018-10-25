import classnames from 'classnames';
import { BackgroundSliderEdit as BackgroundSlider } from './sub-components/slider';
import Dividers from './sub-components/dividers';
import BackgroundVideo from './sub-components/video';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component} = wp.element;
const {
	InnerBlocks
} = wp.editor;
/**
 * Create an Inspector Controls wrapper Component
 */
export default class Edit extends Component {

	render() {
		const {
			attributes: {
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				backgroundColor,
				backgroundImage,
				sliderImages,
				backgroundVideoUrl,
				foregroundOpacity,
				foregroundColor,
				foregroundFilter,
				align,
				contentMaxWidth,
				minHeight,
				verticalAlign,
				horizontalAlign,
				entranceAnimation,
				entranceAnimationDuration,
				entranceAnimationDelay,
			},
			className,
			baseClass,
			clientId,
			prepareGradientStyle,
			prepareBackgroundImageStyles,
			convertHorizontalAlignToStyle,
			convertVerticalAlignToStyle
		} = this.props;

		const wrapperStyle = {
			minHeight: minHeight,
			justifyContent: convertHorizontalAlignToStyle(horizontalAlign),
			alignItems: convertVerticalAlignToStyle(verticalAlign),
			marginTop,
			marginBottom,
			marginLeft,
			marginRight,
		};

		const style = {
			paddingTop,
			paddingBottom,
			paddingLeft,
			paddingRight,
		}

		const backgroundStyle = {
			backgroundColor: backgroundColor,
			...prepareGradientStyle('background', this.props),
			...prepareBackgroundImageStyles('background', this.props)
		};

		const foregroundStyle = {
			opacity: foregroundOpacity !== undefined ? foregroundOpacity / 100 : undefined,
			backgroundColor: foregroundColor,
			...prepareGradientStyle('foreground', this.props),
			...prepareBackgroundImageStyles('foreground', this.props),
			mixBlendMode: foregroundFilter,
		};

		const innerWrapperStyle = {
			maxWidth: contentMaxWidth ? `${contentMaxWidth}px` : undefined,
		};

		const wowData = !!entranceAnimation ? {
			'data-wow-duration':  entranceAnimationDuration !== undefined ? entranceAnimationDuration : '2000ms',
			'data-wow-delay': entranceAnimationDelay !== undefined ? entranceAnimationDelay : '500ms',
			'data-wow-offset': '20'
		} : {};

		return (
			<div
				className={classnames(className, {
					[`getwid-animated`]: !!entranceAnimation,
					[`${entranceAnimation}`]: !!entranceAnimation,
					[`${baseClass}-${clientId}`]: true,
					'alignfull': align === 'full',
					'alignwide': align === 'wide'
				})}
				style={wrapperStyle}
				{...wowData}
			>
				<Dividers {...{...this.props, baseClass}} />
				<div className={`${baseClass}__inner-wrapper`} style={innerWrapperStyle}>
					<div className={`${baseClass}__background-holder`}>
						<div className={`${baseClass}__background`} style={backgroundStyle}>
							{
								backgroundImage &&
								<img className={`${baseClass}__background-image`} src={backgroundImage.url}
								     alt={backgroundImage.alt} data-id={backgroundImage.id}/>
							}
							{
								backgroundVideoUrl &&
								<BackgroundVideo {...{...this.props, baseClass}} />
							}
							{
								!!sliderImages.length &&
								<BackgroundSlider {...{...this.props, baseClass}} />
							}
						</div>
						<div className={`${baseClass}__foreground`} style={foregroundStyle}></div>
					</div>
					<div className={`${baseClass}__content`}>
						<div style={style}>
							<InnerBlocks/>
						</div>
					</div>
				</div>
			</div>
		);
	}
	componentDidMount(){
		const {attributes: {
			entranceAnimation
		}} = this.props;

		if (!!entranceAnimation) {
			this.animate();
		}
	}

	componentDidUpdate(prevProps){
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
			live: false,
			mobile: false
		}).init();
	}

}
