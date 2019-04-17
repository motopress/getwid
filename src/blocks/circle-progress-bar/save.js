import classnames from 'classnames';
import { get } from 'lodash';

const { Component, Fragment } = wp.element;
const { select} = wp.data;

const {
	RichText,
	getColorClassName,
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
			}			
		} = this.props;

		const className = 'wp-block-getwid-circle-progress-bar';

		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const colors = get( select( 'core/editor' ).getEditorSettings(), [ 'colors' ], [] );
		const colorBySlug = getColorObjectByAttributeValues( colors, textColor );

		const color = textColor === undefined ? customTextColor === undefined ? undefined : customTextColor : colorBySlug.color;
		
		const contentWrapperPropds = {
			className: classnames(`${className}__bar-background`,
				{
					'has-background': backgroundColor || customBackgroundColor,
					[backgroundClass]: backgroundClass,
				}),
			style: { backgroundColor: (backgroundColor ? undefined : customBackgroundColor) }
		}

		return (
			<Fragment>
				<div className={classnames(className)}>
					<div className={`${className}__wrapper`} data-circle-color={color} data-fill-amount={fillAmount} data-is-animated={isAnimated} >
						<div className={`${className}__title-holder`}>
							<RichText.Content tagName="h5" className={`${className}__title`} value={title ? title : ''} />
						</div>

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