import { InspectorControls } from '@wordpress/block-editor';
import {
	CheckboxControl,
	PanelBody,
	RangeControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { CustomColorPalette } from 'getwid-components';

import type { ProgressBarEditProps } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
	backgroundColor,
	textColor,
	setBackgroundColor,
	setTextColor,
}: ProgressBarEditProps ) {
	const { fillAmount, isAnimated, customBackgroundColor, customTextColor } =
		attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
				<RangeControl
					label={ __( 'Value', 'getwid' ) }
					value={ Number.parseInt( fillAmount, 10 ) }
					onChange={ ( nextFillAmount ) => {
						setAttributes( {
							fillAmount: String( nextFillAmount ?? 0 ),
						} );
					} }
					initialPosition={ Number.parseInt( fillAmount, 10 ) }
					min={ 0 }
					max={ 100 }
					step={ 1 }
				/>
				<CheckboxControl
					label={ __( 'Animate', 'getwid' ) }
					help={ __(
						'Progress bar animates when it becomes visible on screen.',
						'getwid'
					) }
					checked={ isAnimated === 'true' }
					onChange={ ( value ) => {
						setAttributes( {
							isAnimated: value ? 'true' : 'false',
						} );
					} }
				/>
				<CustomColorPalette
					colorSettings={ [
						{
							title: __( 'Progress Color', 'getwid' ),
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
