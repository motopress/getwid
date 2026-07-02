import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { FontSizePicker } from 'getwid-components';

import type { TemplateAcfWysiwygEditProps } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
}: TemplateAcfWysiwygEditProps ) {
	const { customField, fontSize, customFontSize } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<TextControl
					label={ __( 'Field Name', 'getwid' ) }
					value={ customField || '' }
					onChange={ ( nextCustomField ) =>
						setAttributes( { customField: nextCustomField } )
					}
				/>
				<FontSizePicker
					fontSizeAttributeName="fontSize"
					fontSize={ { fontSize, customFontSize } }
					setAttributes={ setAttributes }
				/>
				<PanelColorSettings
					title={ __( 'Text Color', 'getwid' ) }
					colorSettings={ [
						{
							value: textColor.color,
							onChange: setTextColor,
							label: __( 'Text Color', 'getwid' ),
						},
					] }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
