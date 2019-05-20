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

		const buttonClasses = {
			className: classnames('wp-block-button__link', {
				'has-text-color': textColor || customTextColor,
				[textClass]: textClass,

				'has-background': backgroundColor || customBackgroundColor,
				[backgroundClass]: backgroundClass
			})
		};
	
		const buttonStyle = {
			style: {
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
				color: textClass ? undefined : customTextColor
			}			
		};

		return (
			<Fragment>
				<div className={`${className}`}>
					<form className={`${baseClass}__form`} method={'post'}>
					
						<div className={`${baseClass}__fields-wrapper`}>
							<div className={`${baseClass}__edit-fields`}>
								<InnerBlocks.Content/>
							</div>
							
							<input className={`${baseClass}__to`} type={'hidden'} value={to}/>
							<input className={`${baseClass}__subject`} type={'hidden'} value={subject}/>
						</div>

						<span
							className={`${baseClass}__response`}
						>
							{__('', 'getwid')}
						</span>

						<div className={'wp-block-button'}>
							<RichText.Content
								type={'submit'}
								tagName={'button'}
								{...buttonClasses}
								{...buttonStyle}								
								value={text}
							/>
						</div>

					</form>
				</div>				
			</Fragment>
		);
	}
}

export default (Save);