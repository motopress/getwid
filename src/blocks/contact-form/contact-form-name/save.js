/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const { TextControl } = wp.components;
const { Component, Fragment } = wp.element;

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
							placeholder={__('Name', 'getwid')}
							value={edit ? edit : 'Name'}
							disabled
						></textarea>
					</div>
					
					<TextControl
						type={'text'}
						id={'text-control'}
						className={`${baseClass}__name`}
						placeholder={__('Name', 'getwid')}
						required
					/>
				</div>
			</Fragment>
		);
	}
}

export default (Save);