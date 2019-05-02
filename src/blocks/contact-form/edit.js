import Inspector from './inspector';
//import classnames from 'classnames';
//import { isEqual } from 'lodash';

import { __ } from 'wp.i18n';

const { compose } = wp.compose;
const { withColors } = wp.editor;

const { Component, Fragment } = wp.element;
const { TextControl, Button, ServerSideRender, TextareaControl  } = wp.components;

class Edit extends Component {

	constructor() {
		super(...arguments);
		this.renderMailForm = this.renderMailForm.bind(this);
		this.onCheckFields = this.onCheckFields.bind(this);

		this.state = {
			isValid: false,

			email: '',
			subject: ''
		};
	}

	renderMailForm() {
		const { email, subject } = this.state;
		const { className, baseClass } = this.props;

		return (
			<form className={`${className}__email-form`} onSubmit={this.onCheckFields}>
				<div className={`${baseClass}__fields-wrapper`}>

					<div class={`${baseClass}__email-wrapper`}>
						<label class={`${baseClass}__label`}>{__('Email address', 'getwid')}</label>
						<input
							className={`${baseClass}__edit components-textarea-control__input`}
							type={'text'}
							placeholder={__('Email', 'getwid')}
							required
						/>
					</div>

					<div class={`${baseClass}__subject-wrapper`}>
						<label class={`${baseClass}__label`}>{__('Email subject line', 'getwid')}</label>
						<input
							className={`${baseClass}__edit components-textarea-control__input`}
							type={'text'}
							placeholder={__('Subject', 'getwid')}
							required
						/>
					</div>
				</div>
				<button
					className={`${baseClass}__button`}
					type={'submit'}
					isPrimary
				>
					{__('Add form', 'getwid')}
				</button>
			</form>
		);
	}

	onCheckFields(event) {
		event.preventDefault();

		//console.log('Here');

		//regexpr = '/([a-z0-9_.-]+)@([a-z0-9.-]+){2,255}.([a-z]+){2,10}/i';  // 

		const regexpr = /([0-9])/;

		const { email, subject } = this.state;
		if (/\S+@\S+\.\S+/.test(email) && subject) {

			console.log('here');

			// const { setAttributes } = this.props;

			// setAttributes({ email, subject });
			// this.setState({ isValid: true });
		}
	}

	render() {
		const {
			attributes: {
				email,
				subject
			},

			/* #region  test */
			backgroundColor
			/* #endregion */

		} = this.props;

		//console.log(this.props);

		if (!this.state.isValid) {
			return this.renderMailForm();
		}

		// console.log('email: ' + email);
		// console.log('subject: ' + subject);		

		return (
			<Fragment>
				<Inspector {...this.props} />
				<ServerSideRender
					block='getwid/contact-form'
					attributes={this.props.attributes}
				/>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {

		if (prevProps.isSelected === this.props.isSelected) {
			/* */
		}
	}

	componentDidMount() {
		/* */
	}

	componentWillUnmount() {
		/* */
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);
