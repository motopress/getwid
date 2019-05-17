/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	TextControl,
	Disabled
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
					<div className={`${baseClass}__wrapper`}>
						<textarea
							className={`${baseClass}__label`}
							placeholder={__('Email address', 'getwid')}
							value={label ? label : ''}
							onChange={event => {
								setAttributes({ label: event.target.value });
							}}
						></textarea>
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
