/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import Inspector from './inspector';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { InnerBlocks, RichText, withColors } = wp.editor;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [
	'getwid/contact-form-name',
	'getwid/contact-form-email',
	'getwid/contact-form-message',
	'getwid/contact-form-captcha',
	'core/paragraph',
	'core/columns',
	'core/spacer'
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
	}

	render() {

		const {
			attributes: {
				text
			},

			setAttributes,

			className,
			baseClass,

			backgroundColor,
			textColor

		} = this.props;

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
					<div className={`${baseClass}__wrapper`}>
						<InnerBlocks
							template={TEMPLATE}
							templateInsertUpdatesSelection={false}
							allowedBlocks={ALLOWED_BLOCKS}
						/>
					</div>
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
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);