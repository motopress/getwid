/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	TextareaControl,
	ToggleControl
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
				isRequired,
				label,
				message
			},

			isSelected,

			baseClass,
			className,
			setAttributes

		} = this.props;

		return (
			<Fragment>
				<div className={`${className}`}>
					<div className={`${baseClass}__label-wrapper`}>
						<textarea
							className={`${baseClass}__label`}
							placeholder={__('Message', 'getwid')}
							value={label ? label : ''}
							onChange={event => {
								setAttributes({ label: event.target.value });
							}}
						> </textarea>

						<div className={`${baseClass}__required`}>
							{
								isSelected && (<ToggleControl
									label={__('Required', 'getwid')}
									checked={isRequired == 'true' ? true : false}
									onChange={value => {
										setAttributes({ isRequired: value ? 'true' : 'false' });
									}}
								/>
								)}
						</div>
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
