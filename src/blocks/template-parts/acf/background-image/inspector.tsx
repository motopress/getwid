import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TabPanel,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { StyleLengthControl } from 'getwid-components';
import { useState } from 'react';

import type {
	TemplateAcfBackgroundImageAttributes,
	TemplateAcfBackgroundImageEditProps,
} from './types';

type PaddingDevice = 'desktop' | 'tablet' | 'mobile';
type PaddingSide = 'Top' | 'Bottom' | 'Left' | 'Right';

const blendModeOptions = [
	{ value: '', label: __( 'None', 'getwid' ) },
	{ value: 'normal', label: __( 'Normal', 'getwid' ) },
	{ value: 'multiply', label: __( 'Multiply', 'getwid' ) },
	{ value: 'screen', label: __( 'Screen', 'getwid' ) },
	{ value: 'overlay', label: __( 'Overlay', 'getwid' ) },
	{ value: 'darken', label: __( 'Darken', 'getwid' ) },
	{ value: 'lighten', label: __( 'Lighten', 'getwid' ) },
	{ value: 'color-dodge', label: __( 'Color Dodge', 'getwid' ) },
	{ value: 'color-burn', label: __( 'Color Burn', 'getwid' ) },
	{ value: 'hard-light', label: __( 'Hard Light', 'getwid' ) },
	{ value: 'soft-light', label: __( 'Soft Light', 'getwid' ) },
	{ value: 'difference', label: __( 'Difference', 'getwid' ) },
	{ value: 'exclusion', label: __( 'Exclusion', 'getwid' ) },
	{ value: 'hue', label: __( 'Hue', 'getwid' ) },
	{ value: 'saturation', label: __( 'Saturation', 'getwid' ) },
	{ value: 'color', label: __( 'Color', 'getwid' ) },
	{ value: 'luminosity', label: __( 'Luminosity', 'getwid' ) },
];

const paddingOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	{ value: 'small', label: __( 'Small', 'getwid' ) },
	{ value: 'medium', label: __( 'Medium', 'getwid' ) },
	{ value: 'normal', label: __( 'Normal', 'getwid' ) },
	{ value: 'large', label: __( 'Large', 'getwid' ) },
	{ value: 'custom', label: __( 'Custom', 'getwid' ) },
	{ value: 'none', label: __( 'None', 'getwid' ) },
];

const responsivePaddingOptions = paddingOptions.filter(
	( option ) => option.value !== 'custom'
);

const imageHeightUnits = [
	{ label: 'px', value: 'px' },
	{ label: 'vh', value: 'vh' },
	{ label: 'vw', value: 'vw' },
	{ label: '%', value: '%' },
];

function getGetwidImageSizes() {
	return (
		(
			window as unknown as {
				Getwid?: {
					settings?: {
						image_sizes?: Array< { value: string; label: string } >;
					};
				};
			}
		 ).Getwid?.settings?.image_sizes || []
	);
}

function getPaddingKey( device: PaddingDevice, side: PaddingSide ) {
	if ( device === 'desktop' ) {
		return `padding${ side }` as keyof TemplateAcfBackgroundImageAttributes;
	}

	const suffix = device === 'tablet' ? 'Tablet' : 'Mobile';
	return `padding${ side }${ suffix }` as keyof TemplateAcfBackgroundImageAttributes;
}

function getPaddingValueKey( side: PaddingSide ) {
	return `padding${ side }Value` as keyof TemplateAcfBackgroundImageAttributes;
}

function PaddingSelect( {
	attributes,
	setAttributes,
	device,
	side,
	locked,
}: TemplateAcfBackgroundImageEditProps & {
	device: PaddingDevice;
	side: PaddingSide;
	locked: boolean;
} ) {
	const key = getPaddingKey( device, side );
	const valueKey = getPaddingValueKey( side );
	const value = attributes[ key ] as string;
	const isDesktop = device === 'desktop';

	return (
		<>
			<SelectControl
				label={ __( `Padding ${ side }`, 'getwid' ) }
				disabled={ side !== 'Top' && locked }
				value={ value || '' }
				onChange={ ( nextValue ) => {
					const nextAttributes: Partial< TemplateAcfBackgroundImageAttributes > =
						{ [ key ]: nextValue };

					if ( side === 'Top' && locked ) {
						(
							[ 'Bottom', 'Left', 'Right' ] as PaddingSide[]
						 ).forEach( ( nextSide ) => {
							nextAttributes[
								getPaddingKey( device, nextSide )
							] = nextValue;
						} );
					}

					setAttributes( nextAttributes );
				} }
				options={
					isDesktop ? paddingOptions : responsivePaddingOptions
				}
			/>
			{ isDesktop && value === 'custom' && (
				<StyleLengthControl
					value={ attributes[ valueKey ] as string | undefined }
					isLocked={ side !== 'Top' && locked }
					onChange={ ( nextPaddingValue ) => {
						const nextAttributes: Partial< TemplateAcfBackgroundImageAttributes > =
							{
								[ valueKey ]:
									nextPaddingValue !== undefined
										? nextPaddingValue
										: '',
							};

						if ( side === 'Top' && locked ) {
							(
								[ 'Bottom', 'Left', 'Right' ] as PaddingSide[]
							 ).forEach( ( nextSide ) => {
								nextAttributes[
									getPaddingValueKey( nextSide )
								] =
									nextPaddingValue !== undefined
										? nextPaddingValue
										: '';
							} );
						}

						setAttributes( nextAttributes );
					} }
				/>
			) }
		</>
	);
}

function PaddingPanel( props: TemplateAcfBackgroundImageEditProps ) {
	const { attributes, setAttributes } = props;
	const [ lockedDevice, setLockedDevice ] = useState<
		Record< PaddingDevice, boolean >
	>( {
		desktop: false,
		tablet: false,
		mobile: false,
	} );
	const hasPadding = [
		'paddingTopValue',
		'paddingBottomValue',
		'paddingLeftValue',
		'paddingRightValue',
		'paddingTop',
		'paddingBottom',
		'paddingLeft',
		'paddingRight',
		'paddingTopTablet',
		'paddingBottomTablet',
		'paddingLeftTablet',
		'paddingRightTablet',
		'paddingTopMobile',
		'paddingBottomMobile',
		'paddingLeftMobile',
		'paddingRightMobile',
	].some( ( key ) => attributes[ key as keyof typeof attributes ] );

	function resetPadding() {
		setAttributes( {
			paddingTopValue: undefined,
			paddingBottomValue: undefined,
			paddingLeftValue: undefined,
			paddingRightValue: undefined,
			paddingTop: '',
			paddingBottom: '',
			paddingLeft: '',
			paddingRight: '',
			paddingTopTablet: '',
			paddingBottomTablet: '',
			paddingLeftTablet: '',
			paddingRightTablet: '',
			paddingTopMobile: '',
			paddingBottomMobile: '',
			paddingLeftMobile: '',
			paddingRightMobile: '',
		} );
	}

	return (
		<PanelBody title={ __( 'Padding', 'getwid' ) } initialOpen={ false }>
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
				{ ( tab ) => {
					const device = tab.name as PaddingDevice;
					const locked = lockedDevice[ device ];

					return (
						<>
							<Button
								icon={ locked ? 'lock' : 'unlock' }
								onClick={ () =>
									setLockedDevice( {
										...lockedDevice,
										[ device ]: ! locked,
									} )
								}
								label={
									locked
										? __( 'Unlock', 'getwid' )
										: __( 'Lock', 'getwid' )
								}
							/>
							{ (
								[
									'Top',
									'Bottom',
									'Left',
									'Right',
								] as PaddingSide[]
							 ).map( ( side ) => (
								<PaddingSelect
									key={ `${ device }-${ side }` }
									{ ...props }
									device={ device }
									side={ side }
									locked={ locked }
								/>
							) ) }
						</>
					);
				} }
			</TabPanel>
			<Button
				variant="link"
				onClick={ resetPadding }
				disabled={ ! hasPadding }
			>
				{ __( 'Reset All', 'getwid' ) }
			</Button>
		</PanelBody>
	);
}

function AlignmentPanel( {
	attributes,
	setAttributes,
}: TemplateAcfBackgroundImageEditProps ) {
	const {
		verticalAlign,
		horizontalAlign,
		verticalAlignTablet,
		horizontalAlignTablet,
		verticalAlignMobile,
		horizontalAlignMobile,
	} = attributes;

	return (
		<PanelBody title={ __( 'Alignment', 'getwid' ) } initialOpen={ false }>
			<TabPanel
				className="getwid-editor-tabs"
				activeClass="is-active"
				tabs={ [
					{ name: 'desktop', title: __( 'Desktop', 'getwid' ) },
					{ name: 'tablet', title: __( 'Tablet', 'getwid' ) },
					{ name: 'mobile', title: __( 'Mobile', 'getwid' ) },
				] }
			>
				{ ( tab ) => {
					const isDesktop = tab.name === 'desktop';
					const verticalKey = isDesktop
						? 'verticalAlign'
						: tab.name === 'tablet'
						? 'verticalAlignTablet'
						: 'verticalAlignMobile';
					const horizontalKey = isDesktop
						? 'horizontalAlign'
						: tab.name === 'tablet'
						? 'horizontalAlignTablet'
						: 'horizontalAlignMobile';

					return (
						<>
							<SelectControl
								label={ __( 'Vertical Alignment', 'getwid' ) }
								value={
									( attributes[
										verticalKey as keyof typeof attributes
									] as string ) || 'center'
								}
								onChange={ ( value ) =>
									setAttributes( { [ verticalKey ]: value } )
								}
								options={ [
									...( isDesktop
										? []
										: [
												{
													value: '',
													label: __(
														'Default',
														'getwid'
													),
												},
										  ] ),
									{
										value: 'flex-start',
										label: __( 'Top', 'getwid' ),
									},
									{
										value: 'center',
										label: __( 'Middle', 'getwid' ),
									},
									{
										value: 'flex-end',
										label: __( 'Bottom', 'getwid' ),
									},
								] }
							/>
							<SelectControl
								label={ __( 'Horizontal Alignment', 'getwid' ) }
								value={
									( attributes[
										horizontalKey as keyof typeof attributes
									] as string ) || 'center'
								}
								onChange={ ( value ) =>
									setAttributes( {
										[ horizontalKey ]: value,
									} )
								}
								options={ [
									...( isDesktop
										? []
										: [
												{
													value: '',
													label: __(
														'Default',
														'getwid'
													),
												},
										  ] ),
									{
										value: 'flex-start',
										label: __( 'Left', 'getwid' ),
									},
									{
										value: 'center',
										label: __( 'Center', 'getwid' ),
									},
									{
										value: 'flex-end',
										label: __( 'Right', 'getwid' ),
									},
								] }
							/>
						</>
					);
				} }
			</TabPanel>
		</PanelBody>
	);
}

export default function Inspector(
	props: TemplateAcfBackgroundImageEditProps
) {
	const { attributes, setAttributes } = props;
	const {
		minHeight,
		contentMaxWidth,
		imageSize,
		customField,
		foregroundOpacity,
		foregroundColor,
		foregroundFilter,
		foregroundGradientType,
		foregroundGradientFirstColor,
		foregroundGradientFirstColorLocation,
		foregroundGradientSecondColor,
		foregroundGradientSecondColorLocation,
		foregroundGradientAngle,
	} = attributes;

	function resetForegroundGradient() {
		setAttributes( {
			foregroundGradientType: undefined,
			foregroundGradientFirstColor: undefined,
			foregroundGradientFirstColorLocation: undefined,
			foregroundGradientSecondColor: undefined,
			foregroundGradientSecondColorLocation: undefined,
			foregroundGradientAngle: undefined,
		} );
	}

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
				<StyleLengthControl
					label={ __( 'Image Height', 'getwid' ) }
					value={ minHeight }
					units={ imageHeightUnits }
					onChange={ ( nextMinHeight ) =>
						setAttributes( { minHeight: nextMinHeight } )
					}
				/>
				<RangeControl
					label={ __( 'Content Width', 'getwid' ) }
					value={ contentMaxWidth ?? undefined }
					onChange={ ( nextContentMaxWidth ) =>
						setAttributes( {
							contentMaxWidth: nextContentMaxWidth ?? undefined,
						} )
					}
					allowReset
					min={ 0 }
					max={ 2000 }
					step={ 1 }
				/>
				<SelectControl
					label={ __( 'Image Size', 'getwid' ) }
					help={ __(
						'For images from Media Library only.',
						'getwid'
					) }
					value={ imageSize }
					onChange={ ( nextImageSize ) =>
						setAttributes( { imageSize: nextImageSize } )
					}
					options={ getGetwidImageSizes() }
				/>
			</PanelBody>
			<AlignmentPanel { ...props } />
			<PaddingPanel { ...props } />
			<PanelBody
				title={ __( 'Overlay', 'getwid' ) }
				initialOpen={ false }
			>
				<RangeControl
					label={ __( 'Overlay Layer Opacity', 'getwid' ) }
					value={ foregroundOpacity }
					onChange={ ( nextForegroundOpacity ) =>
						setAttributes( {
							foregroundOpacity: nextForegroundOpacity ?? 35,
						} )
					}
					min={ 0 }
					max={ 100 }
					step={ 5 }
					allowReset
				/>
				<SelectControl
					label={ __( 'Blend Mode', 'getwid' ) }
					value={ foregroundFilter || '' }
					onChange={ ( nextForegroundFilter ) =>
						setAttributes( {
							foregroundFilter: nextForegroundFilter,
						} )
					}
					options={ blendModeOptions }
				/>
				<PanelColorSettings
					title={ __( 'Overlay Color', 'getwid' ) }
					colorSettings={ [
						{
							value: foregroundColor,
							onChange: ( nextForegroundColor ) =>
								setAttributes( {
									foregroundColor: nextForegroundColor,
								} ),
							label: __( 'Overlay Color', 'getwid' ),
						},
					] }
					initialOpen={ false }
				/>
				<PanelBody
					title={ __( 'Overlay Gradient', 'getwid' ) }
					initialOpen={ false }
				>
					<SelectControl
						value={ foregroundGradientType || '' }
						onChange={ ( nextForegroundGradientType ) =>
							setAttributes( {
								foregroundGradientType:
									nextForegroundGradientType,
							} )
						}
						options={ [
							{ value: '', label: __( 'None', 'getwid' ) },
							{
								value: 'linear',
								label: __( 'Linear', 'getwid' ),
							},
							{
								value: 'radial',
								label: __( 'Radial', 'getwid' ),
							},
						] }
					/>
					{ foregroundGradientType && (
						<>
							<Button isSmall onClick={ resetForegroundGradient }>
								{ __( 'Reset', 'getwid' ) }
							</Button>
							<PanelColorSettings
								title={ __( 'Gradient Colors', 'getwid' ) }
								colorSettings={ [
									{
										value: foregroundGradientFirstColor,
										onChange: ( value ) =>
											setAttributes( {
												foregroundGradientFirstColor:
													value,
											} ),
										label: __( 'First Color', 'getwid' ),
									},
									{
										value: foregroundGradientSecondColor,
										onChange: ( value ) =>
											setAttributes( {
												foregroundGradientSecondColor:
													value,
											} ),
										label: __( 'Second Color', 'getwid' ),
									},
								] }
							/>
							<RangeControl
								label={ __( 'First Color Location', 'getwid' ) }
								value={ foregroundGradientFirstColorLocation }
								onChange={ ( value ) =>
									setAttributes( {
										foregroundGradientFirstColorLocation:
											value ?? 0,
									} )
								}
								placeholder="0"
								min={ 0 }
								max={ 100 }
								step={ 1 }
							/>
							<RangeControl
								label={ __(
									'Second Color Location',
									'getwid'
								) }
								value={ foregroundGradientSecondColorLocation }
								onChange={ ( value ) =>
									setAttributes( {
										foregroundGradientSecondColorLocation:
											value ?? 100,
									} )
								}
								placeholder="100"
								min={ 0 }
								max={ 100 }
								step={ 1 }
							/>
							{ foregroundGradientType === 'linear' && (
								<RangeControl
									label={ __( 'Angle', 'getwid' ) }
									value={ foregroundGradientAngle }
									onChange={ ( value ) =>
										setAttributes( {
											foregroundGradientAngle:
												value ?? 180,
										} )
									}
									placeholder="180"
									min={ 0 }
									max={ 360 }
									step={ 1 }
								/>
							) }
						</>
					) }
				</PanelBody>
			</PanelBody>
		</InspectorControls>
	);
}
