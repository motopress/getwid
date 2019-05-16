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
				edit,
				name
			},

			baseClass,
			className,
			setAttributes

		} = this.props;

		return (
			<Fragment>
				<div className={`${className}`}>
					<div className={`${baseClass}__edit-wrapper`}>
						<textarea
							className={`${baseClass}__edit`}
							placeholder={__('Name', 'getwid')}
							value={edit ? edit : ''}
							onChange={event => {
								setAttributes({ edit: event.target.value });
							}}
						></textarea>
					</div>

					<Disabled>
						<TextControl
							type={'text'}
							id={'text-control'}
							className={`${baseClass}__name`}
							required
						/>
					</Disabled>
										
				</div>
			</Fragment>
		);
	}	
}

export default (Edit);
