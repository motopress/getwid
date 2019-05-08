import classnames from 'classnames';
import { get } from 'lodash';

const { Component, Fragment } = wp.element;
const { select } = wp.data;

const {
	RichText,
	getColorObjectByAttributeValues
} = wp.editor;

class Save extends Component {
	render() {
		const {
			attributes: {
				fillAmount,
				title,
				isAnimated,

				backgroundColor,
				customBackgroundColor,

				textColor,
				customTextColor
			},

			className,
			baseClass
			
		} = this.props;

		const colors = get(select('core/editor').getEditorSettings(), ['colors'], []);

		const textColorBySlug 		= getColorObjectByAttributeValues(colors, textColor);
		const backgroundColorBySlug = getColorObjectByAttributeValues(colors, backgroundColor);

		const wrapperProps = {
			className: classnames(`${baseClass}__wrapper`),

			'data-background-color': backgroundColorBySlug.color ? backgroundColorBySlug.color : customBackgroundColor,
			'data-text-color'      : textColorBySlug.color ? textColorBySlug.color : customTextColor,

			'data-fill-amount': fillAmount ? fillAmount : '0',
			'data-is-animated': isAnimated
		}

		return (
			<Fragment>
				<div className={classnames(className)}>
					<div {...wrapperProps}>

						<div className={classnames(`${baseClass}__header`, { 'has-no-title': !title })}>
							{
								title && <RichText.Content tagName='p' className={`${baseClass}__title`} value={title}/>
							}
							<span className={`${baseClass}__percent`}>
								{
									`${fillAmount ? fillAmount : '0'}%`
								}
							</span>
						</div>

						<div className={`${baseClass}__line-wrapper`}>
							<canvas className={`${baseClass}__canvas`}/>
						</div>

					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;