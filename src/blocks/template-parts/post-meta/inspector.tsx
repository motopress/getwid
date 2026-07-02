import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { TemplatePostMetaEditProps } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
}: TemplatePostMetaEditProps ) {
	const { direction, blockDivider } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<SelectControl
					label={ __( 'Divider', 'getwid' ) }
					value={ blockDivider }
					onChange={ ( nextBlockDivider ) =>
						setAttributes( { blockDivider: nextBlockDivider } )
					}
					options={ [
						{ value: '', label: __( 'None', 'getwid' ) },
						{ value: '/', label: '/' },
						{ value: '|', label: '|' },
						{ value: '•', label: '•' },
						{ value: '·', label: '·' },
					] }
				/>
				<SelectControl
					label={ __( 'Direction', 'getwid' ) }
					value={ direction }
					onChange={ ( nextDirection ) =>
						setAttributes( { direction: nextDirection } )
					}
					options={ [
						{ value: 'row', label: __( 'Horizontal', 'getwid' ) },
						{ value: 'column', label: __( 'Vertical', 'getwid' ) },
					] }
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
