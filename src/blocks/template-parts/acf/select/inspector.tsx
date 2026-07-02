import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { FontSizePicker } from 'getwid-components';

import type { TemplateAcfSelectEditProps } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
}: TemplateAcfSelectEditProps ) {
	const { customField, labelName, separator, fontSize, customFontSize } =
		attributes;

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
				<TextControl
					label={ __( 'Label', 'getwid' ) }
					value={ labelName || '' }
					onChange={ ( nextLabelName ) =>
						setAttributes( { labelName: nextLabelName } )
					}
				/>
				<TextControl
					label={ __( 'Separator', 'getwid' ) }
					help={ __( 'For multiple values.', 'getwid' ) }
					value={ separator !== undefined ? separator : ',' }
					onChange={ ( nextSeparator ) =>
						setAttributes( { separator: nextSeparator } )
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
