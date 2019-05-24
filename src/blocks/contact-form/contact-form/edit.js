/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import Inspector from './inspector';

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
	InnerBlocks,
	RichText,
	withColors
} = wp.editor;

const {
	compose
} = wp.compose;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [
	'getwid/contact-form-name',
	'getwid/contact-form-email',
	'getwid/contact-form-message'
];

const TEMPLATE = [
	['getwid/contact-form-name'],
	['getwid/contact-form-email'],
	['getwid/contact-form-message']
];

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.renderForm   = this.renderForm.bind(this);
		this.onCreateForm = this.onCreateForm.bind(this);	

		this.changeState = this.changeState.bind(this);
		this.getState 	 = this.getState.bind(this);

		this.manageRecaptchaAPIKey = this.manageRecaptchaAPIKey.bind(this);

		this.state = {
			recaptchaSiteKey  : Getwid.settings.recaptcha_site_key 	 != '' ? Getwid.settings.recaptcha_site_key   : '',
			recaptchaSecretKey: Getwid.settings.recaptcha_secret_key != '' ? Getwid.settings.recaptcha_secret_key : '',

			checkSiteKey  : Getwid.settings.recaptcha_site_key 	 != '' ? Getwid.settings.recaptcha_site_key   : '',
			checkSecretKey: Getwid.settings.recaptcha_secret_key != '' ? Getwid.settings.recaptcha_secret_key : '',

			firstInit: true
		};
	}

	renderForm() {
		const {
			attributes: {
				to,
				subject
			},

			clientId,
			baseClass

		} = this.props;

		return (
			<div className={`${baseClass}__settings ${clientId}`}>
				<form onSubmit={this.onCreateForm}>
					<TextControl
						type={'email'}
						label={__('Email address', 'getwid')}
						placeholder={__('Email', 'getwid')}
						onChange={() => { }}
						value={to}
					/>

					<TextControl
						type={'text'}
						label={__('Email subject line', 'getwid')}
						placeholder={__('Subject', 'getwid')}
						onChange={() => { }}
						value={subject}
					/>

					<Button
						isPrimary
						type={'submit'}>
						{__('Add form', 'getwid')}
					</Button>
				</form>
			</div>
		);
	}

	onCreateForm(event) {
		event.preventDefault();

		const { clientId } = this.props;

		const to 	  = $(`.${clientId}`).find('input[type=\'email\']').get(0).value;
		const subject = $(`.${clientId}`).find('input[type=\'text\']' ).get(0).value;

		const { setAttributes } = this.props;
		setAttributes({
			to: to ? to : '',
			subject: subject ? subject : '',
			isFormShowing: true
		});
	}

	manageRecaptchaAPIKey(event, option) {
		event.preventDefault();

		const getState = this.getState;

		const data = {
			'action': 'getwid_recaptcha_api_key',
			'data': {
				'site_api_key': getState('checkSiteKey'),
				'secret_api_key': getState('checkSecretKey'),
			},
			'option': option
		};

		if (option == 'set') {

			Getwid.settings.recaptcha_site_key = getState('checkSiteKey');
			Getwid.settings.recaptcha_secret_key = getState('checkSecretKey');

		} else if (option == 'delete') {

			Getwid.settings.recaptcha_site_key   = '';
			Getwid.settings.recaptcha_secret_key = '';
		}

		$.post(Getwid.ajax_url, data, () => { });
	}

	changeState(param, value) {
		this.setState({ [param]: value });
	}

	getState(value) {
		return this.state[value];
	}	

	render() {

		const {
			attributes: {
				text,
				to,
				subject
			},

			setAttributes,

			className,
			baseClass,

			backgroundColor,
			textColor

		} = this.props;

		if (to == undefined && subject == undefined) {
			return this.renderForm();
		}

		const manageRecaptchaAPIKey    = this.manageRecaptchaAPIKey;

		const changeState = this.changeState;
		const getState 	  = this.getState;

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					...{ manageRecaptchaAPIKey },
					...{ changeState },
					...{ getState }
				}} />
				<div className={`${className}`}>

					<div className={`${baseClass}__inner-wrapper`}>
						<InnerBlocks
							template={TEMPLATE}
							templateInsertUpdatesSelection={false}
							allowedBlocks={ALLOWED_BLOCKS}
							templateLock={'all'}
						/>
					</div>

					<div className={`wp-block-button`}>
						<RichText
							placeholder={__('Add text…', 'getwid')}
							value={text}
							onChange={text => {
								setAttributes({ text });
							}}
							style={{
								backgroundColor: backgroundColor.color,
								color: textColor.color
							}}
							keepPlaceholderOnFocus
						/>
					</div>

				</div>
			</Fragment>
		);
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);