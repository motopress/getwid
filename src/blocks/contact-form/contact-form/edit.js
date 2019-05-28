/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import Inspector from './inspector';
import { isEqual } from 'lodash';
import { addScript } from 'GetwidUtils/help-functions';

/**
* WordPress dependencies
*/
const {
	Component,
	Fragment
} = wp.element;

const {
	Button,
	TextControl,
	Disabled
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

		this.renderForm = this.renderForm.bind(this);
		this.onFormSettingsSet = this.onFormSettingsSet.bind(this);

		this.changeState = this.changeState.bind(this);
		this.changeStates = this.changeStates.bind(this);
		this.getState = this.getState.bind(this);

		this.manageRecaptchaAPIKey = this.manageRecaptchaAPIKey.bind(this);
		this.removeRecaptchaAPIScript = this.removeRecaptchaAPIScript.bind(this);
		this.addRecaptchaAPIScript = this.addRecaptchaAPIScript.bind(this);
		this.addCaptchaElement = this.addCaptchaElement.bind(this);

		this.renderCaptcha = this.renderCaptcha.bind(this);

		this.state = {
			recaptchaSiteKey: Getwid.settings.recaptcha_site_key != '' ? Getwid.settings.recaptcha_site_key : '',
			recaptchaSecretKey: Getwid.settings.recaptcha_secret_key != '' ? Getwid.settings.recaptcha_secret_key : '',

			checkSiteKey: Getwid.settings.recaptcha_site_key != '' ? Getwid.settings.recaptcha_site_key : ' ',
			checkSecretKey: Getwid.settings.recaptcha_secret_key != '' ? Getwid.settings.recaptcha_secret_key : '',

			scriptInit: false,
			allowRender: true,
			reloadScript: false,
			someState: false
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
				<form onSubmit={this.onFormSettingsSet}>
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

	onFormSettingsSet(event) {
		event.preventDefault();

		const { clientId } = this.props;

		//const rorm = $(ReactDOM.findDOMNode(this));

		const to = $(`.${clientId}`).find('input[type=\'email\']').get(0).value;
		const subject = $(`.${clientId}`).find('input[type=\'text\']').get(0).value;

		const { setAttributes } = this.props;
		setAttributes({
			to: to ? to : '',
			subject: subject ? subject : ''
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

			this.setState({ reloadScript: true, scriptInit: false  });   //???????????????????????????????????????????????????????????????????????????

			const { baseClass } = this.props;
			$(`.${baseClass}__reCAPTCHA`).remove();

			console.log($(ReactDOM.findDOMNode(this))[0]);
			//this.setState({ someState: true });

		} else if (option == 'delete') {

			Getwid.settings.recaptcha_site_key = '';
			Getwid.settings.recaptcha_secret_key = '';
		}

		$.post(Getwid.ajax_url, data, () => { });
	}

	renderCaptcha() {
		const { baseClass } = this.props;
		const getState = this.getState;	
		
		grecaptcha.ready(() => {
			// let captcha;			
			// if (getState('someState')) {
			// 	this.addCaptchaElement();
			
			// } else {
			// 	captcha = $(`.${baseClass}__captcha`).get(0);
			// }

			console.log('renderCaptcha');
			console.log($(ReactDOM.findDOMNode(this))[0]);

			const captcha = $(`.${baseClass}__reCAPTCHA`).get(0);

			this.captchaId = grecaptcha.render(captcha, {
				'sitekey': getState('checkSiteKey'),
				'theme'  : 'dark'
			});
		});
	}

	addRecaptchaAPIScript() {
		console.log('addRecaptchaAPIScript');
		const changeState = this.changeState;

		const changeStates = this.changeStates;
		
		addScript('https://www.google.com/recaptcha/api.js?render=explicit&hl=en', (script) => {
			script.id = 'reCAPTCHA_api_js';			

			//console.log('script is loaded');
			changeStates({ scriptInit: true, allowRender: true, reloadScript: false, someState: true });
		});
	}

	removeRecaptchaAPIScript() {
		const changeState = this.changeState;
		const $main_google_js = $('#reCAPTCHA_api_js');

		if ($main_google_js.length) {
			$main_google_js.remove();
		}

		const $other_google_js = $('script[src*=\'www.google.com\']');

		if ($other_google_js.length) {
			$.each($other_google_js, (index, value) => {
				$(value).remove();
			});
		}

		const $_other_google_js = $('script[src*=\'www.gstatic.com\']');

		if ($_other_google_js.length) {
			$.each($_other_google_js, (index, value) => {
				$(value).remove();
			});
		}

		window.grecaptcha = {};
	}

	addCaptchaElement() {
		//console.log('addCaptchaElement');

		const { className, baseClass } = this.props;

		const captchaElement = document.createElement('div');
		$(captchaElement).addClass(`${baseClass}__reCAPTCHA`);
		//captchaElement.className = `${baseClass}__reCAPTCHA`;

		$(`.${className}`).find(`.${className}__wrapper`).after($(captchaElement));

		//var buttonSubmit = $('.wp-block-button');
		//document.getElementsByClassName(`${className}`)[0].insertBefore(captchaElement, buttonSubmit[0]);
	}

	changeState(param, value) {
		this.setState({ [param]: value });
	}

	changeStates(value) {
		this.setState(value);
	}

	getState(value) {
		return this.state[value];
	}

	render() {

		const {
			attributes: {
				text,
				to,
				subject,
				captcha
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

		const showCaptcha = $.parseJSON(captcha);

		const removeRecaptchaAPIScript = this.removeRecaptchaAPIScript;
		const manageRecaptchaAPIKey = this.manageRecaptchaAPIKey;

		const changeState = this.changeState;
		const changeStates = this.changeStates;
		const getState = this.getState;

		const buttonSubmitClass = classnames(
			'wp-block-button__link', {
				'has-background': backgroundColor.color,
				[backgroundColor.class]: backgroundColor.class,

				'has-text-color': textColor.color,
				[textColor.class]: textColor.class
			}
		);

		// const chooseElement = () => {
		// 	if ($.parseJSON(captcha)) {
		// 		debugger;
		// 		if (getState('someState')) {
		// 			console.log('__captcha_0');
		// 			return (<Disabled><div className={`${baseClass}__captcha_0`}></div></Disabled>);
		// 		} else {
		// 			console.log('__captcha_1');
		// 			return (<Disabled><div className={`${baseClass}__captcha_1`}></div></Disabled>);
		// 		}
		// 	}
		// }

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					...{ removeRecaptchaAPIScript },
					...{ manageRecaptchaAPIKey },
					...{ changeState },
					...{ changeStates },
					...{ getState }
				}} />
				<div className={`${className}`}>

					{/* inner-wrapper */}
					<div className={`${baseClass}__wrapper`}>
						<InnerBlocks
							template={TEMPLATE}
							templateInsertUpdatesSelection={false}
							allowedBlocks={ALLOWED_BLOCKS}
						/>
					</div>

					{/* {
						showCaptcha && (<Disabled>
							<div className={`${baseClass}__captcha`}></div>
						</Disabled>)
					} */}

					<div className={'wp-block-button'}>
						<RichText
							placeholder={__('Add text…', 'getwid')}
							value={text}
							onChange={text => {
								setAttributes({ text });
							}}
							className={buttonSubmitClass}
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

	componentDidMount() {
		
		const {
			attributes: {
				to,
				subject,
				captcha
			}
		} = this.props;

		const getState = this.getState;

		if (to != undefined && subject != undefined) {
			if ($.parseJSON(captcha)) {
				this.addCaptchaElement();
			}
		}

		if ( getState('checkSiteKey') != '' ) {
			this.addRecaptchaAPIScript();
		}
	}	

	componentDidUpdate(prevProps, prevState) {
		const { attributes: { captcha }, setAttributes } = this.props;

		//console.log($(ReactDOM.findDOMNode(this))[0]);

		const getState = this.getState;
		if ( prevProps.isSelected === this.props.isSelected ) {
			if (getState('reloadScript')) {
				//console.log('addRecaptchaAPIScript after reload');
				this.addRecaptchaAPIScript();
			}
			if ( $.parseJSON(captcha) &&  getState('scriptInit') && getState('allowRender')) {
				//console.log('render captcha');
				this.addCaptchaElement();
				this.renderCaptcha();
			}
		}
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);