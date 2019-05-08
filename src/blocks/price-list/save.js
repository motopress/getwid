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
				title,

				backgroundColor,
				textColor,

				customBackgroundColor,
				customTextColor
			},

			className,
			baseClass

		} = this.props;

		const textClass 	  = getColorClassName('color', textColor);
		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const textStyle = {
			color: (typeof textColor != 'undefined' ? undefined : customTextColor),
		}

		const wrapperPriceListProps = {
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
				<div></div>
			</Fragment>
		);
	}
}

export default Save;