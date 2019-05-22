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

				nameIsRequired,
				emailIsRequired,

				backgroundColor,
				textColor,

				captcha,

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

		const mainClass = { className: classnames(`${className}`),
			'data-use-captcha' : captcha
		}

		return (
			<Fragment>
				<div {...mainClass}>
					<form className={`${baseClass}__form`}>

						<InnerBlocks.Content/>
						<input type={'hidden'} name={'to'} value={to}/>
						<input type={'hidden'} name={'subject'} value={subject}/>
						
						<div className={`${baseClass}__contact-submit`}>
							<span className={`${baseClass}__response`}> { __('', 'getwid') } </span>

							<div className={`${baseClass}__captcha`}></div>
							<div className={`${baseClass}__submit wp-block-button`}>
								<RichText.Content
									type={'submit'}
									tagName={'button'}
									className={buttonClasses}
									style={buttonStyle}
									value={text}
								/>
							</div>						
						</div>
					</form>
				</div>
			</Fragment>
		);
	}
}

export default (Save);