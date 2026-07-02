import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { BaseControl, PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { FontSizePicker, IconPicker } from 'getwid-components';

import type { TemplatePostTagsEditProps } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
	iconColor,
	setIconColor,
}: TemplatePostTagsEditProps ) {
	const { divider, icon, fontSize, customFontSize } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<SelectControl
					label={ __( 'Divider', 'getwid' ) }
					value={ divider }
					onChange={ ( nextDivider ) =>
						setAttributes( { divider: nextDivider } )
					}
					options={ [
						{ value: '', label: __( 'None', 'getwid' ) },
						{ value: ',', label: ',' },
					] }
				/>
				<FontSizePicker
					fontSizeAttributeName="fontSize"
					fontSize={ { fontSize, customFontSize } }
					setAttributes={ setAttributes }
				/>
				<BaseControl label={ __( 'Icon', 'getwid' ) }>
					<IconPicker
						value={ icon }
						onChange={ ( nextIcon ) =>
							setAttributes( { icon: nextIcon } )
						}
					/>
				</BaseControl>
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
				<PanelColorSettings
					initialOpen={ false }
					title={ __( 'Icon Color', 'getwid' ) }
					colorSettings={ [
						{
							value: iconColor.color,
							onChange: setIconColor,
							label: __( 'Icon Color', 'getwid' ),
						},
					] }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
