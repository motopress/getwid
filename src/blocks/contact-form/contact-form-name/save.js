/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
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
				isRequired,

				label,
				name
			},

			className,
			baseClass

		} = this.props;		

		return (
			<Fragment>
				<div className={`${className}`} data-name-is-required={isRequired} data-label={label} data-name={name}>
					<div className={`${baseClass}__wrapper`}>
						<label
							className={`${baseClass}__label`}
							for={'name-input'}
						>
							{ label ? label : __('Name', 'getwid') }
							{ $.parseJSON(isRequired) && <span>{__(' (required)', 'getwid')}</span> }
						</label>

						<input
							type={'text'}
							name={'name'}
							id={'name-input'}
							placeholder={name ? name : __('Name', 'getwid')}
						>
						</input>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default (Save);