import classnames from 'classnames';
import BackgroundSlider from './sub-components/slider';
import Dividers from './sub-components/dividers';
import BackgroundVideo from './sub-components/video';

import './style.scss'

import attributes from './attributes';
import Inspector from './inspector';
import Edit from './edit';

const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	InnerBlocks
} = wp.editor;

/**
 *
 * @param {string} attrPrefix
 * @return {Object}
 */
function prepareBackgroundImageStyles(attrPrefix, props){

	const {attributes} = props;

	if (!attributes[`${attrPrefix}Image`]) {
		return {};
	}

	let image = attributes[`${attrPrefix}Image`];
	if (typeof image === 'object') {
		image = image.url;
	}

	return {
		backgroundImage: `url('${image}')`,
		backgroundPosition: attributes[`${attrPrefix}ImagePosition`],
		backgroundRepeat: attributes[`${attrPrefix}ImageRepeat`],
		backgroundAttachment: attributes[`${attrPrefix}ImageAttachment`],
		backgroundSize: attributes[`${attrPrefix}ImageSize`]
	};
}

/**
 *
 * @param {string} attrPrefix
 * @return {Object}
 */
function prepareGradientStyle(attrPrefix, props){
	let type = props.attributes[`${attrPrefix}GradientType`],
		angle = props.attributes[`${attrPrefix}GradientAngle`],
		firstColor = props.attributes[`${attrPrefix}GradientFirstColor`],
		secondColor = props.attributes[`${attrPrefix}GradientSecondColor`],
		firstLocation = props.attributes[`${attrPrefix}GradientFirstColorLocation`],
		secondLocation = props.attributes[`${attrPrefix}GradientSecondColorLocation`];

	angle = angle !== undefined ? `${angle}deg` : '180deg';
	firstColor = firstColor !== undefined ? firstColor : 'rgba(0,0,0,0)';
	firstLocation = firstLocation !== undefined ? `${firstLocation}%` : '0%';
	secondColor = secondColor !== undefined ? secondColor : 'rgba(0,0,0,0)';
	secondLocation = secondLocation !== undefined ? `${secondLocation}%` : '100%';

	const style = {};

	switch (type) {
		case 'linear':
			style['backgroundImage'] = `linear-gradient(${angle}, ${firstColor} ${firstLocation}, ${secondColor} ${secondLocation})`;
			break;
		case 'radial':
			style['backgroundImage'] = `radial-gradient(${firstColor} ${firstLocation}, ${secondColor} ${secondLocation})`;
			break;
	}

	return style;
}


/**
 * Convert vertical align setting to align-items rule value
 *
 * @param {string} verticalAlign Possible value is top, middle or bottom
 * @return {string|undefined}
 */
function convertVerticalAlignToStyle(verticalAlign) {
	let align = undefined;
	switch (verticalAlign) {
		case 'top':
			align = 'flex-start';
			break;
		case 'bottom':
			align = 'flex-end';
			break;
		case'center':
			align = 'center';
			break;
	}
	return align;
}

/**
 * Convert horizontal align setting to justify-content rule value
 *
 * @param {string} horizontalAlign Possible value is left, center or right
 * @return {string|undefined}
 */
function convertHorizontalAlignToStyle(horizontalAlign) {
	let align = undefined;
	switch (horizontalAlign) {
		case 'left':
			align = 'flex-start';
			break;
		case 'right':
			align = 'flex-end';
			break;
		case'center':
			align = 'center';
			break;
	}
	return align;
}

// Prefix for block classes
const baseClass = 'wp-block-getwid-section';

// Register the block
registerBlockType( 'getwid/section', {
	title: __( 'Getwid Section', 'getwid' ),
	description: __( '@todo description', 'getwid' ),
	icon: {
		foreground: '#bf3737',		
		src: 'editor-table',
	},		
	category: 'layout',
	keywords: [
		__( 'container', 'getwid' ),
		__( 'section', 'getwid' ),
		__( 'getwid', 'getwid' ),
	],

	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],
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
		} = props;

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
			...prepareGradientStyle('background', props),
			...prepareBackgroundImageStyles('background', props)
		};

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
			'data-wow-delay': entranceAnimationDelay !== undefined ? entranceAnimationDelay : '500ms',
			'data-wow-offset': '20'
		} : {};

		return (
			<div
				className={classnames(baseClass, {
					[`getwid-animated ${entranceAnimation}`]: !!entranceAnimation,
				})}
				style={wrapperStyle}
				{...wowData}
			>
				<Dividers {...{...props, baseClass}} />
				<div className={`${baseClass}__inner-wrapper`} style={innerWrapperStyle}>
					<div className={`${baseClass}__background-holder`}>
						<div className={`${baseClass}__background`} style={backgroundStyle}>
							{
								!!backgroundImage &&
								<img className={`${baseClass}__background-image`} src={backgroundImage.url}
								     alt={backgroundImage.alt} data-id={backgroundImage.id}/>
							}
							{
								!!backgroundVideoUrl &&
								<BackgroundVideo {...{...props, baseClass}} />
							}
							{
								!!sliderImages.length &&
								<BackgroundSlider {...{...props, baseClass}} />
							}
						</div>
						<div className={`${baseClass}__foreground`} style={foregroundStyle}></div>
					</div>
					<div className={`${baseClass}__content`}>
						<div className={`${baseClass}__inner-content`} style={style}>
							<InnerBlocks.Content/>
						</div>
					</div>
				</div>
			</div>
		);
	},
} );