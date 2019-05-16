/**
* External dependencies
*/
import Inspector from './inspector';
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	Component,
	Fragment
} = wp.element;

const {
	Button,
	TextControl
} = wp.components;

const {
	InnerBlocks
} = wp.editor;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [
	'getwid/contact-form-name',  
	'getwid/contact-form-email',
	'getwid/contact-form-message',
	'core/button'
];

const TEMPLATE = [
	['getwid/contact-form-name'],
	[ 'getwid/contact-form-email' ],
	[ 'getwid/contact-form-message' ],
	['core/button', {
		text: __('Submit', 'getwid')
	}]
];

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);
		this.renderForm = this.renderForm.bind(this);
		this.onCreateForm = this.onCreateForm.bind(this);

		this.state = {
			isShowForm: false
		};
	}

	renderForm() {
		const {
			attributes: {
				to,
				subject
			}

		} = this.props;

		return (
			<form onSubmit={this.onCreateForm}>
				<TextControl
					type={'email'}
					label={__('Email address', 'getwid')}
					placeholder={__('Email', 'getwid')}
					onChange={() => {}}
					value={to}
				/>

				<TextControl
					type={'text'}
					label={__('Email subject line', 'getwid')}
					placeholder={__('Subject', 'getwid')}
					onChange={() => {}}
					value={subject}
				/>

				<Button
					isPrimary
					type={'submit'}>
					{__('Add form', 'getwid')}
				</Button>
			</form>
		);
	}

	onCreateForm(event) {
		event.preventDefault();
		this.setState({ isShowForm: true });

		const to 	  = $('form').find('input[type=\'email\']').get(0).value;
		const subject = $('form').find('input[type=\'text\']' ).get(0).value;

		const { setAttributes } = this.props;
		setAttributes({
			to : to ? to : Getwid.settings.admin_email,
			subject: subject ? subject : `Email from ${Getwid.settings.site_name}`
		});
	}

	render() {

		const {
			attributes: {
				to,
				subject
			}
		} = this.props;

		if (!to || !subject) {
			return this.renderForm();
		}

		const { className, baseClass } = this.props;

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div className={`${className}`}>
					<form className={`${baseClass}__form`} method={'post'}>
						<InnerBlocks
							template={TEMPLATE}
							templateInsertUpdatesSelection={false}
							allowedBlocks={ALLOWED_BLOCKS}
							templateLock={'all'}
						/>
					</form>
				</div>				
			</Fragment>
		);
	}
}

export default (Edit);