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
				email
			},

			className,
			baseClass

		} = this.props;

		return (
			<Fragment>
				<div className={`${className}`} data-email-is-required={isRequired} data-label={label} data-email={email}>
					<div className={`${baseClass}__wrapper`}>
						<label
							className={`${baseClass}__label`}
							for={'email-input'}
						>
							{ label ? label : __('Email address', 'getwid') }
							{ $.parseJSON(isRequired) && <span>{__(' (required)', 'getwid')}</span> }
						</label>

						<input
							type={'email'}
							name={'email'}
							id={'email-input'}							
							placeholder={email ? email : __('Email', 'getwid')}
						>
						</input>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default (Save);