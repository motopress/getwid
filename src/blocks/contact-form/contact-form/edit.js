/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
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
	'getwid/contact-form-message',
	'getwid/contact-form-captcha'
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

		this.onFormSettingsSet = this.onFormSettingsSet.bind(this);
	}	

	onFormSettingsSet(event) {
		event.preventDefault();

		const { className } = this.props;

		//const rorm = $(ReactDOM.findDOMNode(this));

		const to 	  = $(`.${className}`).find('input[type=\'email\']').get(0).value;
		const subject = $(`.${className}`).find('input[type=\'text\']' ).get(0).value;

		const { setAttributes } = this.props;
		setAttributes({
			to: to ? to : '',
			subject: subject ? subject : ''
		});
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

		let hasFormSettingsSet = false;

		if (to != undefined && subject != undefined) {
			hasFormSettingsSet = !hasFormSettingsSet;
		}

		const buttonSubmitClass = classnames(
			'wp-block-button__link', {
				'has-background': backgroundColor.color,
				[backgroundColor.class]: backgroundColor.class,

				'has-text-color': textColor.color,
				[textColor.class]: textColor.class
			}
		);

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div className={`${className}`}>
					{ ! hasFormSettingsSet && (
						<form onSubmit={this.onFormSettingsSet}>
							<TextControl
								type={'email'}
								label={__('Email address', 'getwid')}
								placeholder={__('Email', 'getwid')}								
								onChange={() => { }}
								value={to}
								autofocus={'true'}
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
					)}
					{ hasFormSettingsSet && (
						<div className={`${baseClass}__wrapper`}>
							<InnerBlocks
								template={TEMPLATE}
								templateInsertUpdatesSelection={false}
								allowedBlocks={ALLOWED_BLOCKS}
							/>
						</div>
					)}
					{ hasFormSettingsSet && (
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
					)}
				</div>
			</Fragment>
		);
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);