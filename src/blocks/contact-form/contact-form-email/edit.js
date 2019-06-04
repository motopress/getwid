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
				required,
				label,
				placeholder
			},

			isSelected,

			baseClass,
			className,
			setAttributes

		} = this.props;

		const _required = required == 'true' ? true : false;

		return (
			<Fragment>
				<div className={`${className}`}>
					<div className={`${baseClass}__label-wrapper`}>
						<textarea
							className={`${baseClass}__label`}
							placeholder={__('Email address', 'getwid')}
							value={label ? label : ''}
							onChange={event => {
								setAttributes({ label: event.target.value });
							}}
						></textarea>

						{ isSelected && (
							<ToggleControl
								label={__('Required', 'getwid')}
								className={`${baseClass}__required`}
								checked={_required}
								onChange={value => {
									setAttributes({ required: value ? 'true' : 'false' });
								}}
							/>
						) }
						{ ! isSelected && _required && (
							<span className={'required'}>{__('(required)', 'getwid')}</span>
						)}
					</div>

					<TextControl
						type={'email'}
						className={`${baseClass}__from`}
						value={placeholder ? placeholder : ''}
						onChange={value => {
							setAttributes({ placeholder: value });
						}}
					/>
				</div>
			</Fragment>
		);
	}
}

export default (Edit);
