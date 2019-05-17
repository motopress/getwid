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
class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				label,
				name
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
							placeholder={__('Name', 'getwid')}
							value={label ? label : ''}
							onChange={ event => {
								setAttributes({ label: event.target.value });
							}}
						></textarea>
					</div>

					<TextControl
						type={'text'}
						className={`${baseClass}__name`}
						value={name ? name : ''}						
						onChange={value => {
							setAttributes({ name: value });
						}}
					/>
				</div>
			</Fragment>
		);
	}	
}

export default (Edit);
