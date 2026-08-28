import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { TemplatePostLinkEditProps } from './types';

export default function Inspector( {
	textColor,
	setTextColor,
}: TemplatePostLinkEditProps ) {
	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
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
