import classnames from 'classnames';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

const {
	RichText,
	getColorClassName
} = wp.editor;

class Save extends Component {
	render() {
		const {
			attributes: {
				start,
				end,
				decimalPlaces,
				duration,
				useEasing,
				useGrouping,

				easing,

				separator,
				decimal,
				numerals,

				title,
				prefix,
				suffix,

				textColor,
				customTextColor,
			}
		} = this.props;

		const className = 'wp-block-getwid-counter';
		const textClass = getColorClassName('color', textColor);

		const wrapperProps = {
			className: classnames(`${className}__number-wrapper`,
				{
					'has-text-color': textColor || customTextColor,
					[textClass]: textClass,
				}),
			style: {
				color: (typeof textColor != 'undefined' ? undefined : customTextColor)
			}
		}

		const counterData = {
			'data-start' 		  : start,
			'data-end' 			  : end,
			'data-decimal-places' : decimalPlaces,
			'data-duration'       : duration,
			'data-use-easing' 	  : useEasing,
			'data-use-grouping'   : useGrouping,
			'data-separator' 	  : separator,
			'data-decimal'		  : decimal,
			'data-easing-fn'      : easing,
			'data-numerals'		  : numerals
		};

		return (
			<Fragment>
				<div className={classnames(className)}>
					<div className={`${className}__wrapper`} {...counterData}>

						<div className={`${className}__title-holder`}>
							<RichText.Content tagName="h5" className={`${className}__title`} value={title ? title : ''} />
						</div>

						<div {...wrapperProps}>
							<span className={`${className}__prefix`} >{prefix} </span>
							<span className={`${className}__number`}>0</span>
							<span className={`${className}__suffix`}> {suffix}</span>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;