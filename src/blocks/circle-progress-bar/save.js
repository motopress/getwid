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
				isAnimated,

				backgroundColor,
				customBackgroundColor,

				textColor,
				customTextColor,

				size,
				thickness,
			},
			baseClass
			
		} = this.props;

		const className = 'wp-block-getwid-circle-progress-bar';

		const colors = get(select('core/editor').getEditorSettings(), ['colors'], []);

		const textColorBySlug 		= getColorObjectByAttributeValues(colors, textColor);
		const backgroundColorBySlug = getColorObjectByAttributeValues(colors, backgroundColor);

		const circleData = {
			'data-background-color': backgroundColorBySlug.color ? backgroundColorBySlug.color : customBackgroundColor,
			'data-text-color': textColorBySlug.color ? textColorBySlug.color : customTextColor,

			'data-fill-amount': fillAmount,
			'data-is-animated': isAnimated,

			'data-size': size,
			'data-thickness': thickness,
		};

		return (
			<Fragment>
				<div className={classnames(className, align ? `align${align}` : null)} >
					<div className={`${baseClass}__wrapper`} {...circleData} >
						<canvas className={`${baseClass}__canvas`} />											
					</div>
				</div>
			</Fragment>
		);
	}
}

export default (Save);