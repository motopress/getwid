import classnames from 'classnames';

const { Component, Fragment } = wp.element;

const {
	RichText,
	getColorClassName
} = wp.editor;

class Save extends Component {
	render() {
		const {
			attributes: {
				align,
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
			className: classnames(`${className}__number`,
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
				<div className={classnames(className,
					align ? `align${align}` : null
				)}>
					<div className={`${className}__wrapper`} {...counterData}>

						<div className={`${className}__title-holder`}>
							<RichText.Content tagName='p' className={`${className}__title`} value={ title } />
						</div>

						<div className={`${className}__number-wrapper`}>
							<RichText.Content
								tagName='p'
								className={`${className}__prefix`}
								value={ prefix }
							/>
							<span {...wrapperProps}>0</span>
							<RichText.Content
								tagName='p'
								className={`${className}__suffix`}
								value={ suffix }
							/>
						</div>

					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;