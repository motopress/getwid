/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	TextControl
} = wp.components;

const {
	Component,
	Fragment
} = wp.element;

/**
* Create an Component
*/
class Save extends Component {
	render() {
		const {
			attributes: {
				label,
				name
			},

			className,
			baseClass

		} = this.props;

		return (
			<Fragment>
				<div className={`${className}`} data-label={label} data-name={name}>
					<div className={`${baseClass}__wrapper`}>
						<label
							className={`${baseClass}__label`}
							for={'name-input'}
						>
							{label ? label : __('Name', 'getwid')}
						</label>
					</div>

					<TextControl
						type={'text'}
						id={'name-input'}
						className={`${baseClass}__name`}
						placeholder={name ? name : __('Name', 'getwid')}
						required
					/>
				</div>
			</Fragment>
		);
	}
}

export default (Save);