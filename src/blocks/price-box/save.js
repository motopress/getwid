import classnames from 'classnames';

import './style.scss';

const { Component, Fragment } = wp.element;

const {
	RichText,
	getColorClassName,
	InnerBlocks
} = wp.editor;

class Save extends Component {
	render() {
		const {
			attributes: {
				align,
				title,
				currency,
				amount,
				period,
				features,

				backgroundColor,
				textColor,

				customBackgroundColor,
				customTextColor
			},

			className,
			baseClass

		} = this.props;

		const textClass = getColorClassName('color', textColor);
		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const textStyle = {
			color: (typeof textColor != 'undefined' ? undefined : customTextColor),
		}

		const wrapperPricingTableProps = {
			className: classnames(`${className}`,
				align ? `align${ align }` : null,
				{
					'has-background': backgroundColor || customBackgroundColor,
					[backgroundClass]: backgroundClass,

					'has-text-color': textColor || customTextColor,
					[textClass]: textClass,
				}),
				style: { backgroundColor: (backgroundColor ? undefined : customBackgroundColor) }
		}

		return (
			<Fragment>
				<div {...wrapperPricingTableProps}>
					<RichText.Content 
						tagName='p'
						className={`${baseClass}__title`}
						value={ title ? title : '' }
						style={textStyle}
					/>

					<div className={`${baseClass}__price-wrapper`}>
						<RichText.Content
							tagName='p'
							className={`${baseClass}__currency`}
							value={ currency ? currency : '' }
							style={textStyle}
						/>

						<RichText.Content
							tagName='p'
							className={`${baseClass}__amount`}
							value={ amount ? amount : '' }
							style={textStyle}
						/>

						<RichText.Content
							tagName='p'
							className={`${baseClass}__period`}
							value={ period ? period : '' }
							style={ textStyle }
						/>
					</div>

					<RichText.Content
						tagName="ul"
						className={`${baseClass}__features`}
						value={features ? features : ''}
						style={ textStyle }
					/>

					<InnerBlocks.Content/>
				</div>
			</Fragment>
		);
	}
}

export default Save;