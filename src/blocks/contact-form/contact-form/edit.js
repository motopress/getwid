/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import Inspector from './inspector';
import classnames from 'classnames';

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
	[ 'getwid/contact-form-email' ],
	[ 'getwid/contact-form-message' ]
];

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);
		this.renderForm = this.renderForm.bind(this);
		this.onCreateForm = this.onCreateForm.bind(this);
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
			to : to ? to : '',
			subject: subject ? subject : ''
		});
	}

	render() {

		const {
			attributes: {
				to,
				subject,
				text
			},

			setAttributes,

			className,
			baseClass,

			backgroundColor,
			textColor

		} = this.props;

		if (!to && !subject) {
			return this.renderForm();
		}

		const buttonClasses = {
			className: classnames(
				'wp-block-button__link', {
					'has-background': backgroundColor.color,
					[ backgroundColor.class ]: backgroundColor.class,

					'has-text-color': textColor.color,
					[ textColor.class ]: textColor.class
				}
			)
		}

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div className={`${className}`}>

					<div className={`${baseClass}__inner-wrapper`}>
						<InnerBlocks
							template={TEMPLATE}
							templateInsertUpdatesSelection={false}
							allowedBlocks={ALLOWED_BLOCKS}
							templateLock={'all'}
						/>
					</div>

					<div className={`${baseClass}__submit wp-block-button`}>
						<RichText
							placeholder={__('Add text…', 'getwid')}
							value={text}
							onChange={ text => {
								setAttributes({ text });
							}}
							{...buttonClasses}
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