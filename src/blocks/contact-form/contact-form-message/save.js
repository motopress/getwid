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
				edit
			},

			className,
			baseClass

		} = this.props;		

		return (
			<Fragment>
				<div className={`${className}`}>
					<div className={`${baseClass}__edit-wrapper`}>
						<textarea
							className={`${baseClass}__edit`}
							placeholder={__('Email address', 'getwid')}
							value={edit ? edit : 'Message'}
							disabled
						> </textarea>
					</div>

					<TextareaControl
						className={`${baseClass}__message`}
						placeholder={__('Enter message here...', 'getwid')}
					/>
				</div>
			</Fragment>
		);
	}
}

export default (Save);