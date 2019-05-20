/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

/**
* WordPress dependencies
*/
const {
	InnerBlocks,
	RichText,
	getColorClassName
} = wp.editor;

const {
	Component,
	Fragment
} = wp.element;

/**
* Create an Component
*/
class Save extends Component {
	render() {
		const {
			attributes: {
				to,
				subject,
				text,

				backgroundColor,
				textColor,

				customBackgroundColor,
				customTextColor,
			},

			className,
			baseClass

		} = this.props;

		const textClass 	  = getColorClassName( 'color', textColor 				   );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const buttonClasses = classnames('wp-block-button__link', {
			'has-text-color': textColor || customTextColor,
			[textClass]: textClass,

			'has-background': backgroundColor || customBackgroundColor,
			[backgroundClass]: backgroundClass
		});
	
		const buttonStyle = {
			backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			color: textClass ? undefined : customTextColor
		};

		return (
			<Fragment>
				<div className={`${className}`}>
					<form className={`${baseClass}__form`} method={'post'}>

						<div class="g-recaptcha" data-sitekey="#siteKey"></div>

						<InnerBlocks.Content/>
						
						<div className={`${baseClass}__contact-submit`}>
							<span
								className={`${baseClass}__response`}
							>
								{ __('', 'getwid') }
							</span>

							<div className={'wp-block-button'}>
								<RichText.Content
									type={'submit'}
									tagName={'button'}
									className={buttonClasses}
									style={buttonStyle}
									value={text}
								/>
							</div>

							<input type={'hidden'} name={'to'} value={to}/>
							<input type={'hidden'} name={'subject'} value={subject}/>
						</div>
					</form>
				</div>
			</Fragment>
		);
	}
}

export default (Save);