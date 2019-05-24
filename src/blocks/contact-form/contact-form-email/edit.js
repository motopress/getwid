/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	TextControl,
	ToggleControl
} = wp.components;

const {
	Component,
	Fragment
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
				email		
			},

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
							placeholder={__('Email address', 'getwid')}
							value={label ? label : ''}
							onChange={ event => {
								setAttributes({ label: event.target.value });
							}}
						></textarea>

						<div className={`${baseClass}__required`}>
							<ToggleControl
								label={__('Required', 'getwid')}
								checked={ isRequired == 'true' ? true : false }
								onChange={ value => {
									setAttributes({ isRequired: value ? 'true' : 'false' });
								}}
							/>
						</div>
					</div>

					<TextControl
						type={'email'}
						className={`${baseClass}__from`}
						value={email ? email : ''}
						onChange={ value => {
							setAttributes({ email: value });
						}}
					/>
					
				</div>
			</Fragment>
		);
	}
}

export default (Edit);
