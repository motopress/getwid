import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { SectionEditProps } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
}: SectionEditProps ) {
	const {
		contentMaxWidthPreset,
		contentMaxWidth,
		minHeight,
		gapSize,
		verticalAlign,
		horizontalAlign,
		resetMinHeightTablet,
		resetMinHeightMobile,
	} = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Layout', 'getwid' ) } initialOpen>
				<TextControl
					label={ __( 'Minimum Height', 'getwid' ) }
					value={ minHeight || '' }
					onChange={ ( value ) =>
						setAttributes( { minHeight: value } )
					}
				/>
				<SelectControl
					label={ __( 'Content Width', 'getwid' ) }
					value={ contentMaxWidthPreset || '' }
					onChange={ ( value ) =>
						setAttributes( { contentMaxWidthPreset: value } )
					}
					options={ [
						{ value: '', label: __( 'Default', 'getwid' ) },
						{ value: 'full', label: __( 'Full Width', 'getwid' ) },
						{ value: 'custom', label: __( 'Custom', 'getwid' ) },
					] }
				/>
				{ contentMaxWidthPreset === 'custom' && (
					<TextControl
						label={ __( 'Content Max Width', 'getwid' ) }
						type="number"
						value={ contentMaxWidth || '' }
						onChange={ ( value ) =>
							setAttributes( {
								contentMaxWidth:
									value === '' ? undefined : Number( value ),
							} )
						}
					/>
				) }
				<SelectControl
					label={ __( 'Inner Blocks Gap', 'getwid' ) }
					value={ gapSize || '' }
					onChange={ ( value ) =>
						setAttributes( { gapSize: value } )
					}
					options={ [
						{ value: '', label: __( 'Default', 'getwid' ) },
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{ value: 'small', label: __( 'Small', 'getwid' ) },
						{ value: 'medium', label: __( 'Medium', 'getwid' ) },
						{ value: 'normal', label: __( 'Normal', 'getwid' ) },
						{ value: 'large', label: __( 'Large', 'getwid' ) },
						{ value: 'huge', label: __( 'Huge', 'getwid' ) },
					] }
				/>
				<SelectControl
					label={ __( 'Vertical Align', 'getwid' ) }
					value={ verticalAlign || 'center' }
					onChange={ ( value ) =>
						setAttributes( { verticalAlign: value } )
					}
					options={ [
						{ value: 'top', label: __( 'Top', 'getwid' ) },
						{ value: 'center', label: __( 'Center', 'getwid' ) },
						{ value: 'bottom', label: __( 'Bottom', 'getwid' ) },
					] }
				/>
				<SelectControl
					label={ __( 'Horizontal Align', 'getwid' ) }
					value={ horizontalAlign || 'center' }
					onChange={ ( value ) =>
						setAttributes( { horizontalAlign: value } )
					}
					options={ [
						{ value: 'left', label: __( 'Left', 'getwid' ) },
						{ value: 'center', label: __( 'Center', 'getwid' ) },
						{ value: 'right', label: __( 'Right', 'getwid' ) },
					] }
				/>
				<ToggleControl
					label={ __( 'Reset Min Height on Tablet', 'getwid' ) }
					checked={ resetMinHeightTablet }
					onChange={ () =>
						setAttributes( {
							resetMinHeightTablet: ! resetMinHeightTablet,
						} )
					}
				/>
				<ToggleControl
					label={ __( 'Reset Min Height on Mobile', 'getwid' ) }
					checked={ resetMinHeightMobile }
					onChange={ () =>
						setAttributes( {
							resetMinHeightMobile: ! resetMinHeightMobile,
						} )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
