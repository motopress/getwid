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
				<div className={`${className}`}>
					<div className={`${baseClass}__wrapper`}>
						{/* <label
							className={`${baseClass}__label`}
							for={'name-input'}
						>
							{ label ? __(`${label}`, 'getwid') : __('Name', 'getwid') }
						</label> */}

						<TextControl
							type={'text'}
							id={'name-input'}
							className={`${baseClass}__input`}
							placeholder={name ? name : ''} //__(`${name}`, 'getwid') : __('Name', 'getwid')}
							onChange={() => {}}
							//required
						/>
					</div>									
				</div>
			</Fragment>
		);
	}
}

export default (Save);