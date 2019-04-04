import classnames from 'classnames';

import './style.scss';

const { __ } = wp.i18n;
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

				title,
				currency,
				amount,
				features,

				backgroundColor,
				textColor,

				customBackgroundColor,
				customTextColor,
			}
		} = this.props;

		const className = 'wp-block-getwid-pricing-table';

		const textClass = getColorClassName('color', textColor);
		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const textStyle = {
			color: (typeof textColor != 'undefined' ? undefined : customTextColor),
		}

		const wrapperPricingTableProps = {
			className: classnames(`${className}`,
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
						tagName="h5"
						className={`${className}__title`}
						value={title ? title : ''}
						style={textStyle}
					/>

					<div className={`${className}__price-wrapper`}>
						<RichText.Content
							tagName="h5"
							className={`${className}__currency`}
							value={currency ? currency : ''}
							style={textStyle}
						/>

						<RichText.Content
							tagName="h5"
							className={`${className}__amount`}
							value={amount ? amount : ''}
							style={textStyle}
						/>
					</div>

					<RichText.Content
						tagName="h5"
						className={`${className}__features`}
						value={features ? features : ''}
						style={textStyle}
					/>

					<InnerBlocks.Content/>
				</div>
			</Fragment>
		);
	}
}

export default Save;