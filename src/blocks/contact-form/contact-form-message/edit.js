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
	Fragment,
	Component
} = wp.element;

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {

		const {
			attributes: {
				label,
				message		
			},

			baseClass,
			className,
			setAttributes

		} = this.props;

		return (
			<Fragment>
				<div className={`${className}`}>
					<div className={`${baseClass}__wrapper`}>
						<textarea
							className={`${baseClass}__label`}
							placeholder={__('Message', 'getwid')}
							value={label ? label : ''}
							onChange={ event => {
								setAttributes({ label: event.target.value });
							}}
						> </textarea>
					</div>

					<TextareaControl
						className={`${baseClass}__textarea`}
						value={message ? message : ''}
						onChange={value => {
							setAttributes({ message: value });
						}}
					/>
				</div>
			</Fragment>
		);
	}
}

export default (Edit);
