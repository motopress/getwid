import classnames from 'classnames';
import { get } from 'lodash';

const { Component, Fragment } = wp.element;
const { select } = wp.data;

const {
	getColorObjectByAttributeValues
} = wp.editor;

class Save extends Component {
	render() {
		const {
			attributes: {
				fillAmount,
				isAnimated,

				wrapperAlign,

				backgroundColor,
				customBackgroundColor,

				textColor,
				customTextColor,

				size,
				thickness,
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
			'data-text-color': textColorBySlug.color ? textColorBySlug.color : customTextColor,

			'data-fill-amount': fillAmount,
			'data-is-animated': isAnimated,

			'data-size'		: size,
			'data-thickness': thickness,

			style: { textAlign: wrapperAlign ? wrapperAlign : null }
		}

		return (
			<Fragment>
				<div className={classnames(className)}>
					<div {...wrapperProps}>
						<canvas className={`${baseClass}__canvas`}/>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;