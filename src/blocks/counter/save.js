import classnames from 'classnames';

const { Component, Fragment } = wp.element;

const {
	RichText,
	getColorClassName
} = wp.blockEditor || wp.editor;

const { safeHTML } = wp.dom;
const { decodeEntities } = wp.htmlEntities;

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

				prefix,
				suffix,

				textColor,
				customTextColor,

				wrapperAlign,
			},
			className,
			baseClass

		} = this.props;

		const textClass = getColorClassName( 'color', textColor );

		const wrapperProps = {
			className: classnames(`${baseClass}__wrapper`),

			style: {
				textAlign: wrapperAlign ? wrapperAlign : null
			},

			'data-start' 		  : start,
			'data-end' 			  : end,
			'data-decimal-places' : decimalPlaces,
			'data-duration'       : duration,
			'data-use-easing' 	  : useEasing,
			'data-use-grouping'   : useGrouping,
			'data-separator' 	  : safeHTML( decodeEntities( separator ) ),
			'data-decimal'		  : safeHTML( decodeEntities( decimal ) ),
			'data-easing-fn'      : easing,
			'data-numerals'		  : numerals
		}

		const numberProps = {
			className: classnames(`${baseClass}__number`,
				{
					'has-text-color': textColor || customTextColor,
					[textClass]: textClass,
				}),
			style: {
				color: (typeof textColor != 'undefined' ? undefined : customTextColor)
			}
		};

		return (
			<Fragment>
				<div className={classnames(className)} >
					<div {...wrapperProps}>

						{
							prefix && <RichText.Content
								tagName='p'
								className={`${baseClass}__prefix`}
								value={prefix}
							/>
						}

						<span {...numberProps}>0</span>

						{
							suffix && <RichText.Content
								tagName='p'
								className={`${baseClass}__suffix`}
								value={suffix}
							/>
						}

					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;
