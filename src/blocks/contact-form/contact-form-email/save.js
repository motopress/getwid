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
							placeholder={__('Email address', 'getwid')}
							value={edit ? edit : 'Email address'}
							disabled
						></textarea>
					</div>

					<TextControl
						type={'email'}
						id={'text-control'}
						className={`${baseClass}__from`}
						placeholder={__('Email', 'getwid')}
						required
					/>
				</div>
			</Fragment>
		);
	}
}

export default (Save);