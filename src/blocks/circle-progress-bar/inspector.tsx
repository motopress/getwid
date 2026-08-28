import { InspectorControls } from '@wordpress/block-editor';
import {
	CheckboxControl,
	PanelBody,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { CustomColorPalette } from 'getwid-components';

import type { CircleProgressBarEditProps } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
}: CircleProgressBarEditProps ) {
	const {
		fillAmount,
		isAnimated,
		size,
		thickness,
		backgroundColor,
		textColor,
		value,
	} = attributes;
	const parsedSize = Number.parseInt( size, 10 );
	const thicknessValue = thickness || String( Math.round( parsedSize / 14 ) );

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
				<RangeControl
					label={ __( 'Progress', 'getwid' ) }
					value={ Number.parseInt( fillAmount, 10 ) }
					onChange={ ( nextValue ) =>
						setAttributes( {
							fillAmount: String( nextValue ?? 0 ),
						} )
					}
					initialPosition={ Number.parseInt( fillAmount, 10 ) }
					min={ 0 }
					max={ 100 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Size', 'getwid' ) }
					value={ parsedSize }
					onChange={ ( nextValue ) => {
						const nextSize = nextValue ?? 50;
						const nextAttributes = {
							size: String( nextSize ),
						};

						if (
							Number.parseInt( thickness, 10 ) >
							parsedSize / 2
						) {
							setAttributes( {
								...nextAttributes,
								thickness: String( Math.floor( nextSize / 2 ) ),
							} );
							return;
						}

						setAttributes( nextAttributes );
					} }
					initialPosition={ parsedSize }
					min={ 50 }
					max={ 600 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Thickness', 'getwid' ) }
					value={ Number.parseInt( thicknessValue, 10 ) }
					onChange={ ( nextValue ) =>
						setAttributes( {
							thickness: String( nextValue ?? 1 ),
						} )
					}
					initialPosition={ Number.parseInt( thickness, 10 ) }
					min={ 1 }
					max={ Math.floor( parsedSize / 2 ) }
					step={ 1 }
				/>
				<TextControl
					label={ __( 'Value', 'getwid' ) }
					value={ value ?? '' }
					onChange={ ( nextValue ) =>
						setAttributes( { value: nextValue } )
					}
				/>
				<CheckboxControl
					label={ __( 'Animate', 'getwid' ) }
					checked={ isAnimated === 'true' }
					onChange={ ( nextValue ) =>
						setAttributes( {
							isAnimated: nextValue ? 'true' : 'false',
						} )
					}
				/>
				<CustomColorPalette
					colorSettings={ [
						{
							title: __( 'Background Color', 'getwid' ),
							colors: {
								customColor: backgroundColor,
							},
							changeColor: ( nextValue ) =>
								setAttributes( {
									backgroundColor: nextValue,
								} ),
						},
						{
							title: __( 'Bar Color', 'getwid' ),
							colors: {
								customColor: textColor,
							},
							changeColor: ( nextValue ) =>
								setAttributes( {
									textColor: nextValue,
								} ),
						},
					] }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
