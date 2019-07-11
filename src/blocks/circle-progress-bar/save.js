import classnames from 'classnames';
import { get } from 'lodash';

const { Component, Fragment } = wp.element;

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

				size,
				thickness,

				backgroundColor,
				textColor,				
			},

			className,
			baseClass
			
		} = this.props;

		const wrapperProps = {
			className: classnames(`${baseClass}__wrapper`),

			'data-background-color': backgroundColor,
			'data-text-color': textColor,

			'data-fill-amount': fillAmount,
			'data-is-animated': isAnimated,

			'data-size'		: size,
			'data-thickness': thickness,

			style: { textAlign: wrapperAlign ? wrapperAlign : null }
		}

		return (
			<Fragment>
				<div className={classnames( className )}>
					<div {...wrapperProps}>
						<canvas className={`${baseClass}__canvas`}/>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;