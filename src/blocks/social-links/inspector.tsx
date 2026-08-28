import { InspectorControls, withColors } from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	RadioControl,
	SelectControl,
	TabPanel,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { CustomColorPalette } from 'getwid-components';

import type { SocialLinksEditProps } from './types';

type ResponsiveTab = 'desktop' | 'tablet' | 'mobile';

function Inspector( props: SocialLinksEditProps ) {
	const {
		attributes,
		setAttributes,
		setBackgroundColor,
		setTextColor,
		backgroundColor,
		textColor,
	} = props;
	const {
		iconsStyle,
		iconsSize,
		iconsSpacing,
		customBackgroundColor,
		customTextColor,
	} = attributes;
	const useSecondaryColor =
		iconsStyle === 'stacked' || iconsStyle === 'framed';

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
				<ResponsiveAlignmentControls { ...props } />
				<RadioControl
					label={ __( 'Layout', 'getwid' ) }
					selected={ iconsStyle || 'default' }
					options={ [
						{ value: 'default', label: __( 'Icon', 'getwid' ) },
						{
							value: 'stacked',
							label: __( 'Background', 'getwid' ),
						},
						{
							value: 'framed',
							label: __( 'Outline', 'getwid' ),
						},
					] }
					onChange={ ( nextIconsStyle ) =>
						setAttributes( {
							iconsStyle:
								nextIconsStyle as SocialLinksEditProps[ 'attributes' ][ 'iconsStyle' ],
						} )
					}
				/>
				<CustomColorPalette
					colorSettings={ [
						{
							title: __( 'Icon Color', 'getwid' ),
							colors: {
								customColor: customTextColor,
								defaultColor: textColor,
							},
							changeColor: setTextColor,
						},
						...( useSecondaryColor && iconsStyle === 'stacked'
							? [
									{
										title: __(
											'Background Color',
											'getwid'
										),
										colors: {
											customColor: customBackgroundColor,
											defaultColor: backgroundColor,
										},
										changeColor: setBackgroundColor,
									},
							  ]
							: [] ),
					] }
				/>
				<TextControl
					type="number"
					label={ __( 'Icon Size', 'getwid' ) }
					value={ iconsSize !== undefined ? iconsSize : '' }
					onChange={ ( nextIconsSize ) => {
						const parsedIconsSize = Number.parseInt(
							nextIconsSize,
							10
						);

						setAttributes( {
							iconsSize: Number.isNaN( parsedIconsSize )
								? undefined
								: parsedIconsSize,
						} );
					} }
					min={ 0 }
					step={ 1 }
				/>
				<SelectControl
					label={ __( 'Space between icons', 'getwid' ) }
					value={ iconsSpacing }
					options={ [
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{
							value: 'default',
							label: __( 'Default', 'getwid' ),
						},
						{ value: 'small', label: __( 'Small', 'getwid' ) },
						{
							value: 'medium',
							label: __( 'Medium', 'getwid' ),
						},
						{ value: 'large', label: __( 'Large', 'getwid' ) },
					] }
					onChange={ ( nextIconsSpacing ) =>
						setAttributes( {
							iconsSpacing:
								nextIconsSpacing as SocialLinksEditProps[ 'attributes' ][ 'iconsSpacing' ],
						} )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}

function ResponsiveAlignmentControls( {
	attributes,
	setAttributes,
}: SocialLinksEditProps ) {
	const [ responsiveTab, setResponsiveTab ] =
		useState< ResponsiveTab >( 'desktop' );
	const { textAlignmentDesktop, textAlignmentTablet, textAlignmentMobile } =
		attributes;

	const alignmentValue =
		responsiveTab === 'desktop'
			? textAlignmentDesktop
			: responsiveTab === 'tablet'
			? textAlignmentTablet
			: textAlignmentMobile;

	return (
		<BaseControl>
			<TabPanel
				className="getwid-editor-tabs"
				activeClass="is-active"
				onSelect={ ( nextResponsiveTab ) =>
					setResponsiveTab( nextResponsiveTab as ResponsiveTab )
				}
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
				{ () => (
					<RadioControl
						label={ __( 'Horizontal Alignment', 'getwid' ) }
						selected={
							alignmentValue !== undefined
								? alignmentValue
								: 'left'
						}
						options={ [
							{ value: 'left', label: __( 'Left', 'getwid' ) },
							{
								value: 'center',
								label: __( 'Center', 'getwid' ),
							},
							{ value: 'right', label: __( 'Right', 'getwid' ) },
						] }
						onChange={ ( nextAlignmentValue ) => {
							if ( responsiveTab === 'desktop' ) {
								setAttributes( {
									textAlignmentDesktop: nextAlignmentValue,
								} );
								return;
							}

							if ( responsiveTab === 'tablet' ) {
								setAttributes( {
									textAlignmentTablet: nextAlignmentValue,
								} );
								return;
							}

							setAttributes( {
								textAlignmentMobile: nextAlignmentValue,
							} );
						} }
					/>
				) }
			</TabPanel>
		</BaseControl>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )(
	Inspector
);
