import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { ButtonGroupEditProps } from './types';

const spacingOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	{ value: 'small', label: __( 'Small', 'getwid' ) },
	{ value: 'medium', label: __( 'Medium', 'getwid' ) },
	{ value: 'normal', label: __( 'Normal', 'getwid' ) },
	{ value: 'large', label: __( 'Large', 'getwid' ) },
	{ value: 'none', label: __( 'None', 'getwid' ) },
];

const alignmentOptions = [
	{ value: 'left', label: __( 'Left', 'getwid' ) },
	{ value: 'center', label: __( 'Center', 'getwid' ) },
	{ value: 'right', label: __( 'Right', 'getwid' ) },
];

const inheritedAlignmentOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	...alignmentOptions,
];

const directionOptions = [
	{ value: 'row', label: __( 'Horizontal', 'getwid' ) },
	{ value: 'column', label: __( 'Vertical', 'getwid' ) },
];

const inheritedDirectionOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	...directionOptions,
];

const widthOptions = [
	{ value: 'auto', label: __( 'Auto', 'getwid' ) },
	{ value: '100', label: __( '100%', 'getwid' ) },
	{ value: '50', label: __( '50%', 'getwid' ) },
	{ value: '33', label: __( '33%', 'getwid' ) },
	{ value: '25', label: __( '25%', 'getwid' ) },
	{ value: '20', label: __( '20%', 'getwid' ) },
];

export default function Inspector( {
	attributes,
	setAttributes,
}: ButtonGroupEditProps ) {
	const {
		spacing,
		alignment,
		alignmentTablet,
		alignmentMobile,
		direction,
		directionTablet,
		directionMobile,
		width,
		widthTablet,
		widthMobile,
	} = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<SelectControl
					label={ __( 'Horizontal space between buttons', 'getwid' ) }
					value={ spacing !== undefined ? spacing : '' }
					onChange={ ( nextSpacing ) =>
						setAttributes( { spacing: nextSpacing } )
					}
					options={ spacingOptions }
				/>
				<TabPanel
					className="getwid-editor-tabs"
					activeClass="is-active"
					tabs={ [
						{
							name: 'desktop',
							title: __( 'Desktop', 'getwid' ),
							className: 'components-button is-link is-small',
						},
						{
							name: 'tablet',
							title: __( 'Tablet', 'getwid' ),
							className: 'components-button is-link is-small',
						},
						{
							name: 'mobile',
							title: __( 'Mobile', 'getwid' ),
							className: 'components-button is-link is-small',
						},
					] }
				>
					{ ( tab ) => (
						<>
							{ tab.name === 'desktop' && (
								<>
									<SelectControl
										label={ __(
											'Horizontal Alignment',
											'getwid'
										) }
										value={ alignment }
										onChange={ ( nextAlignment ) =>
											setAttributes( {
												alignment: nextAlignment,
											} )
										}
										options={ alignmentOptions }
									/>
									<SelectControl
										label={ __( 'Direction', 'getwid' ) }
										value={ direction }
										onChange={ ( nextDirection ) =>
											setAttributes( {
												direction: nextDirection,
											} )
										}
										options={ directionOptions }
									/>
									<SelectControl
										label={ __( 'Button Width', 'getwid' ) }
										value={ width }
										onChange={ ( nextWidth ) =>
											setAttributes( {
												width: nextWidth,
											} )
										}
										options={ widthOptions }
									/>
								</>
							) }
							{ tab.name === 'tablet' && (
								<>
									<SelectControl
										label={ __(
											'Horizontal Alignment',
											'getwid'
										) }
										value={ alignmentTablet }
										onChange={ ( nextAlignmentTablet ) =>
											setAttributes( {
												alignmentTablet:
													nextAlignmentTablet,
											} )
										}
										options={ inheritedAlignmentOptions }
									/>
									<SelectControl
										label={ __( 'Direction', 'getwid' ) }
										value={ directionTablet }
										onChange={ ( nextDirectionTablet ) =>
											setAttributes( {
												directionTablet:
													nextDirectionTablet,
											} )
										}
										options={ inheritedDirectionOptions }
									/>
									<SelectControl
										label={ __( 'Button Width', 'getwid' ) }
										value={ widthTablet }
										onChange={ ( nextWidthTablet ) =>
											setAttributes( {
												widthTablet: nextWidthTablet,
											} )
										}
										options={ widthOptions }
									/>
								</>
							) }
							{ tab.name === 'mobile' && (
								<>
									<SelectControl
										label={ __(
											'Horizontal Alignment',
											'getwid'
										) }
										value={ alignmentMobile }
										onChange={ ( nextAlignmentMobile ) =>
											setAttributes( {
												alignmentMobile:
													nextAlignmentMobile,
											} )
										}
										options={ inheritedAlignmentOptions }
									/>
									<SelectControl
										label={ __( 'Direction', 'getwid' ) }
										value={ directionMobile }
										onChange={ ( nextDirectionMobile ) =>
											setAttributes( {
												directionMobile:
													nextDirectionMobile,
											} )
										}
										options={ inheritedDirectionOptions }
									/>
									<SelectControl
										label={ __( 'Button Width', 'getwid' ) }
										value={ widthMobile }
										onChange={ ( nextWidthMobile ) =>
											setAttributes( {
												widthMobile: nextWidthMobile,
											} )
										}
										options={ widthOptions }
									/>
								</>
							) }
						</>
					) }
				</TabPanel>
			</PanelBody>
		</InspectorControls>
	);
}
