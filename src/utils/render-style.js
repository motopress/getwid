export default class renderStyle {

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
			backgroundPosition  : attributes[`${attrPrefix}ImagePosition`  ] != '' ? attributes[`${attrPrefix}ImagePosition`  ] : null,
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