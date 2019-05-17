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
							{label ? label : __('Message', 'getwid')}
						</label>
					</div>
					<TextareaControl
						id={'message-textarea'}
						className={`${baseClass}__textarea`}
						placeholder={message ? message : __('Enter message here...', 'getwid')}
					/>
				</div>
			</Fragment>
		);
	}
}

export default (Save);