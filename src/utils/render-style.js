/**
* External dependencies
*/
import { isEqual } from 'lodash';
import * as gradientParser from 'gradient-parser';
import * as hexToRgb from 'hex-to-rgb';


/**
* WordPress dependencies
*/
const { __experimentalGradientPicker: GradientPicker } = wp.components;

/* #region Gradient API */
const getRgb = (colorStops, index) =>
	`${colorStops[index].type}(${colorStops[index].value.toString()})`;

const getHex = (colorStops, index) =>
	colorStops[index].value.toString();

const fromHexToRbg = backgroundGradient => {
	const parsedGradient = gradientParser.parse( backgroundGradient )[0];
	const colorStops = parsedGradient.colorStops;

	if ( isEqual( colorStops[0].type, 'hex' ) ) {

		const firstColor = hexToRgb( getHex( colorStops, 0 ) ).toString();
		const secondColor = hexToRgb( getHex( colorStops, 1 ) ).toString();

		const firstLocation = colorStops[0].length.value;
		const secondLocation = colorStops[1].length.value;

		const type = parsedGradient.type;
		const angle = parsedGradient.orientation
			? parsedGradient.orientation.value
			: undefined;

		let gradient;
		if ( isEqual( type, 'linear-gradient' ) ) {
			gradient = `${type}(${angle}deg,rgba(${firstColor}) ${firstLocation}%,rgba(${secondColor}) ${secondLocation}%)`;
		} else {
			gradient = `${type}(rgba(${firstColor}) ${firstLocation}%,rgba(${secondColor}) ${secondLocation}%)`;
		}

		return gradient;
	}

	return backgroundGradient;
}

export default class renderStyle {

	/**
	 *
	 * @param {string} gradientType
	 * @param {Object} props
	 * @return {string}
	 */
	static prepareMultiGradientStyle(gradientType, props) {
		const { backgroundGradientFirstColor, foregroundGradientFirstColor } = props.attributes;

		let { backgroundGradient, foregroundGradient } = props.attributes;

		if ( GradientPicker ) {

			if (gradientType == 'background'){

				if (backgroundGradient){
					return backgroundGradient;
				} else {
					if (backgroundGradientFirstColor){
						backgroundGradient = renderStyle.prepareGradientStyle( 'background', props );
						backgroundGradient = backgroundGradient.backgroundImage;

						if ( backgroundGradient ) {
							backgroundGradient = backgroundGradient.replace( /, /g, () => ',' );
							backgroundGradient = fromHexToRbg( backgroundGradient );
						}

						return backgroundGradient;
					} else {
						return undefined;
					}
				}

			}

			if (gradientType == 'foreground'){

				if (foregroundGradient){
					return foregroundGradient;
				} else {
					if (foregroundGradientFirstColor){
						foregroundGradient = renderStyle.prepareGradientStyle( 'foreground', props );
						foregroundGradient = foregroundGradient.backgroundImage;

						if ( foregroundGradient ) {
							foregroundGradient = foregroundGradient.replace( /, /g, () => ',' );
							foregroundGradient = fromHexToRbg( foregroundGradient );
						}

						return foregroundGradient;
					} else {
						return undefined;
					}
				}

			}

		} else {

			if (gradientType == 'background'){
				if (backgroundGradientFirstColor){
					backgroundGradient = renderStyle.prepareGradientStyle( 'background', props );
					backgroundGradient = backgroundGradient.backgroundImage;
					return backgroundGradient;
				} else {
					return undefined;
				}
			}

			if (gradientType == 'foreground'){
				if (foregroundGradientFirstColor){
					foregroundGradient = renderStyle.prepareGradientStyle( 'foreground', props );
					foregroundGradient = foregroundGradient.backgroundImage;
					return foregroundGradient;
				} else {
					return undefined;
				}
			}

		}

	}


	/**
	 *
	 * @param {string} attrPrefix
	 * @return {Object}
	 */
	static prepareBackgroundImageStyles(attrPrefix, props) {

		const {attributes} = props;
		if ( ! attributes[ `${attrPrefix}Image` ] ) {
			return {};
		}

		let image = attributes[`${attrPrefix}Image`];
		if (typeof image === 'object') {
			image = image.url;
		}

		return {
			backgroundImage     : `url('${image}')`,
			backgroundPosition  : attributes[`${attrPrefix}ImagePosition`  ] != '' ?
				(
					(attributes[`${attrPrefix}ImagePosition`] == 'custom' && attributes[`${attrPrefix}CustomImagePosition`]) ?
					(`${ attributes[`${attrPrefix}CustomImagePosition`].x * 100 }% ${ attributes[`${attrPrefix}CustomImagePosition`].y * 100 }%`) :
					attributes[`${attrPrefix}ImagePosition`]
				)
			: null,
			backgroundRepeat    : attributes[`${attrPrefix}ImageRepeat`    ] != '' ? attributes[`${attrPrefix}ImageRepeat`    ] : null,
			backgroundAttachment: attributes[`${attrPrefix}ImageAttachment`] != '' ? attributes[`${attrPrefix}ImageAttachment`] : null,
			backgroundSize      : attributes[`${attrPrefix}ImageSize`      ] != '' ? attributes[`${attrPrefix}ImageSize`      ] : null
		};
	}

	/**
	 *
	 * @param {string} attrPrefix
	 * @return {Object}
	 */
	static prepareGradientStyle(attrPrefix, props){
		let type  = props.attributes[ `${attrPrefix}GradientType`  ],
			angle = props.attributes[ `${attrPrefix}GradientAngle` ],

			firstColor  = props.attributes[ `${attrPrefix}GradientFirstColor`  ],
			secondColor = props.attributes[ `${attrPrefix}GradientSecondColor` ],

			firstLocation  = props.attributes[ `${attrPrefix}GradientFirstColorLocation`  ],
			secondLocation = props.attributes[ `${attrPrefix}GradientSecondColorLocation` ];

		angle          = angle          !== undefined ? `${angle}deg` : '180deg';
		firstColor     = firstColor     !== undefined ? firstColor : 'rgba(0,0,0,0)';
		firstLocation  = firstLocation  !== undefined ? `${firstLocation}%` : '0%';
		secondColor    = secondColor    !== undefined ? secondColor : 'rgba(0,0,0,0)';
		secondLocation = secondLocation !== undefined ? `${secondLocation}%` : '100%';

		const style = {};

		switch ( type ) {
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
	static convertVerticalAlignToStyle(verticalAlign) {
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
	static convertHorizontalAlignToStyle(horizontalAlign) {
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
}
