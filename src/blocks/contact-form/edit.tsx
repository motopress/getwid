import {
	InnerBlocks,
	RichText,
	useBlockProps,
	withColors,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';

import CustomColorPalette from '../../components/custom-color-palette';
import {
	allowedBlocks,
	allowedFormats,
	contactFormTemplate,
} from './constants';
import Recaptcha from './recaptcha';
import type { ContactFormEditProps } from './types';

import './editor.scss';
import './style.scss';

function Edit( props: ContactFormEditProps ) {
	const {
		attributes,
		setAttributes,
		textColor,
		backgroundColor,
		setTextColor,
		setBackgroundColor,
		contactFormClass,
	} = props;
	const {
		text,
		subject,
		recaptchaTheme,
		customBackgroundColor,
		customTextColor,
	} = attributes;
	const blockProps = useBlockProps();

	const buttonSubmitClass = classnames( 'wp-block-button__link', {
		'has-background': backgroundColor.color,
		[ backgroundColor.class || '' ]: backgroundColor.class,
		'has-text-color': textColor.color,
		[ textColor.class || '' ]: textColor.class,
	} );

	return (
		<>
			<div { ...blockProps }>
				<div className={ `${ contactFormClass }__wrapper` }>
					<InnerBlocks
						templateInsertUpdatesSelection={ false }
						allowedBlocks={ allowedBlocks }
						template={ contactFormTemplate }
					/>
				</div>
				<div className="wp-block-button">
					<RichText
						placeholder={ __( 'Write text…', 'getwid' ) }
						value={ text }
						allowedFormats={ allowedFormats }
						onChange={ ( nextText ) =>
							setAttributes( { text: nextText } )
						}
						className={ buttonSubmitClass }
						style={ {
							backgroundColor: backgroundColor.color,
							color: textColor.color,
						} }
					/>
				</div>
			</div>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
					<TextControl
						label={ __( 'Subject', 'getwid' ) }
						value={ subject || '' }
						onChange={ ( nextSubject ) =>
							setAttributes( { subject: nextSubject } )
						}
						__nextHasNoMarginBottom
					/>
					<CustomColorPalette
						colorSettings={ [
							{
								title: __( 'Button Text Color', 'getwid' ),
								colors: {
									customColor: customTextColor,
									defaultColor: textColor,
								},
								changeColor: setTextColor,
							},
							{
								title: __(
									'Button Background Color',
									'getwid'
								),
								colors: {
									customColor: customBackgroundColor,
									defaultColor: backgroundColor,
								},
								changeColor: setBackgroundColor,
							},
						] }
					/>
				</PanelBody>
			</InspectorControls>

			<Recaptcha
				theme={ recaptchaTheme }
				setTheme={ ( theme ) =>
					setAttributes( { recaptchaTheme: theme } )
				}
			/>
		</>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
