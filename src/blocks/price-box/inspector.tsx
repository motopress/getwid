import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { CustomColorPalette } from 'getwid-components';

import type { PriceBoxEditProps } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
	backgroundColor,
	textColor,
	setBackgroundColor,
	setTextColor,
}: PriceBoxEditProps ) {
	const { headerTag, customBackgroundColor, customTextColor } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
				<SelectControl
					label={ __( 'Title Tag', 'getwid' ) }
					value={ headerTag }
					options={ [
						{ value: 'p', label: __( 'Paragraph', 'getwid' ) },
						{ value: 'h2', label: __( 'Heading 2', 'getwid' ) },
						{ value: 'h3', label: __( 'Heading 3', 'getwid' ) },
						{ value: 'h4', label: __( 'Heading 4', 'getwid' ) },
						{ value: 'h5', label: __( 'Heading 5', 'getwid' ) },
						{ value: 'h6', label: __( 'Heading 6', 'getwid' ) },
					] }
					onChange={ ( nextHeaderTag ) =>
						setAttributes( {
							headerTag:
								nextHeaderTag as PriceBoxEditProps[ 'attributes' ][ 'headerTag' ],
						} )
					}
				/>
				<CustomColorPalette
					colorSettings={ [
						{
							title: __( 'Text Color', 'getwid' ),
							colors: {
								customColor: customTextColor,
								defaultColor: textColor,
							},
							changeColor: setTextColor,
						},
						{
							title: __( 'Background Color', 'getwid' ),
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
	);
}
