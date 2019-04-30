import Inspector from './inspector';
//import classnames from 'classnames';
//import { isEqual } from 'lodash';

import { __ } from 'wp.i18n';

const { compose } = wp.compose;
const { withColors } = wp.editor;

const { Component, Fragment } = wp.element;
const { TextControl, Button, Disabled, ServerSideRender } = wp.components;

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
				<div className={`${baseClass}__form-wrapper`}>
					<TextControl
						label={__('Email address', 'getwid')}
						placeholder={__('Email', 'getwid')}
						onChange={email => {
							this.setState({ email })
						}}
					/>
					<TextControl
						label={__('Email subject line', 'getwid')}
						placeholder={__('Subject', 'getwid')}
						onChange={subject => {
							this.setState({ subject })
						}}
					/>
					<Button
						isPrimary
						type='submit'
						disabled={ email === '' || subject === ''  ? true : null } >
						{__('Add form', 'getwid')}
					</Button>
				</div>				
			</form>
		);
	}

	onCheckFields(event) {
		event.preventDefault();

		const { email, subject } = this.state;		
		/\S+@\S+\.\S+/.test(email) && subject ? this.setState({ isValid: true }) : null;
	}

	render() {
		const {
			attributes: {
				email,
				subject
			},

		} = this.props;

		if (!this.state.isValid) {
			return this.renderMailForm();
		}

		console.log('email: ' + email);
		console.log('subject: ' + subject);

		return (
			<Fragment>
				<Inspector {...this.props} />
				<Disabled>
					<ServerSideRender
						block='getwid/contact-form'
						attributes={this.props.attributes}
					/>
				</Disabled>
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

// export default compose([
// 	withColors('backgroundColor', { textColor: 'color' }),
// ])(Edit);

export default Edit;