/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	TextareaControl,
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
				edit		
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
							placeholder={__('Message', 'getwid')}
							value={edit ? edit : ''}
							onChange={event => {
								setAttributes({ edit: event.target.value });
							}}
						> </textarea>
					</div>

					<Disabled>
						<TextareaControl className={`${baseClass}__message`}/>
					</Disabled>					
				</div>
			</Fragment>
		);
	}
}

export default (Edit);
