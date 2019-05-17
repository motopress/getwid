/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	TextareaControl
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
				message
			},

			className,
			baseClass

		} = this.props;

		return (
			<Fragment>
				<div className={`${className}`}>
					<div className={`${baseClass}__wrapper`}>
						<label
							className={`${baseClass}__label`}
							for={'message-textarea'}
						>
							{label ? __(`${label}`, 'getwid') : __('Message', 'getwid')}
						</label>

						<TextareaControl
							id={'message-textarea'}
							className={`${baseClass}__textarea`}
							placeholder={message ? __(`${message}`, 'getwid') : __('Enter message here...', 'getwid')}
						/>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default (Save);