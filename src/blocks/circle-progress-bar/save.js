import classnames from 'classnames';
import { get } from 'lodash';

const { Component, Fragment } = wp.element;
const { select } = wp.data;

const {
	RichText,
	getColorClassName,
	getColorObjectByAttributeValues
} = wp.editor;

class Save extends Component {
	render() {
		const {
			attributes: {
				align,
				fillAmount,
				title,
				isAnimated,

				backgroundColor,
				customBackgroundColor,

				textColor,
				customTextColor,

				/* #region new attributes */
				diameter,
				thickness,
				/* #endregion */
			}
		} = this.props;

		const className = 'wp-block-getwid-circle-progress-bar';

		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const colors = get(select('core/editor').getEditorSettings(), ['colors'], []);
		const colorBySlug = getColorObjectByAttributeValues(colors, textColor);

		const color = textColor === undefined ? customTextColor === undefined ? undefined : customTextColor : colorBySlug.color;

		const contentWrapperPropds = {
			className: classnames(`${className}__bar-background`,
				{
					'has-background': backgroundColor || customBackgroundColor,
					[backgroundClass]: backgroundClass,
				}),
			style: { backgroundColor: (backgroundColor ? undefined : customBackgroundColor) }
		}

		//change later data-circle-color to data-fill
		//add later data-empty-fill for set background

		const circleData = {
			'data-circle-color': color,
			'data-fill-amount': fillAmount,
			'data-is-animated': isAnimated,

			/* #region new data attributes */
			'data-diameter': diameter,
			'data-thickness': thickness,
			/* #endregion */
		};

		return (
			<Fragment>
				<div className={classnames(className,
					align ? `align${align}` : null
				)}>
					<div className={`${className}__wrapper`} {...circleData} >
						<RichText.Content tagName='p' className={`${className}__title`} value={title} />

						<div className={`${className}__content-wrapper`}>

							<div {...contentWrapperPropds}></div>

							<div className={`${className}__circle-foreground`}></div>
							<canvas className={`${className}__counter`} height="200" width="200" />
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default (Save);