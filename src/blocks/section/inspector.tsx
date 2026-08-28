import {
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	ButtonGroup,
	CheckboxControl,
	Dashicon,
	Dropdown,
	ExternalLink,
	FocalPointPicker,
	GradientPicker,
	PanelBody,
	RadioControl,
	RangeControl,
	SelectControl,
	TabPanel,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	AnimationSelectControl,
	CustomColorPalette,
	MediaControl,
	Notice,
	StyleLengthControl,
	TabsControl,
} from 'getwid-components';

import CustomBackgroundControl from './controls/custom-background-control';
import type { ColorValue, SectionEditProps, SectionMedia } from './types';

declare const Getwid: {
	options_url: {
		appearance: string;
	};
};

type TabName = 'general' | 'style' | 'advanced';
type ResponsiveTabName = 'desktop' | 'tablet' | 'mobile';
type BackgroundType = 'color' | 'image' | 'gradient' | 'slider' | 'video';
type ForegroundType = 'color' | 'image' | 'gradient';
type SpacingType = 'padding' | 'margin';

type EditorSettings = {
	colors?: Array< { name: string; slug: string; color: string } >;
	gradients?: Array< { name: string; slug: string; gradient: string } >;
	disableCustomColors?: boolean;
	disableCustomGradients?: boolean;
};

const imageAllowedTypes = [ 'image' ];
const videoAllowedTypes = [ 'video' ];
const responsiveTabs = [
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
];
const spacingPresetOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	{ value: 'small', label: __( 'Small', 'getwid' ) },
	{ value: 'medium', label: __( 'Medium', 'getwid' ) },
	{ value: 'normal', label: __( 'Normal', 'getwid' ) },
	{ value: 'large', label: __( 'Large', 'getwid' ) },
	{ value: 'custom', label: __( 'Custom', 'getwid' ) },
	{ value: 'none', label: __( 'None', 'getwid' ) },
];
const responsiveSpacingPresetOptions = spacingPresetOptions.filter(
	( option ) => option.value !== 'custom'
);
const imagePositionOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	{ value: 'custom', label: __( 'Custom', 'getwid' ) },
	{ value: 'top left', label: __( 'Top Left', 'getwid' ) },
	{ value: 'top center', label: __( 'Top Center', 'getwid' ) },
	{ value: 'top right', label: __( 'Top Right', 'getwid' ) },
	{ value: 'center left', label: __( 'Center Left', 'getwid' ) },
	{ value: 'center center', label: __( 'Center Center', 'getwid' ) },
	{ value: 'center right', label: __( 'Center Right', 'getwid' ) },
	{ value: 'bottom left', label: __( 'Bottom Left', 'getwid' ) },
	{ value: 'bottom center', label: __( 'Bottom Center', 'getwid' ) },
	{ value: 'bottom right', label: __( 'Bottom Right', 'getwid' ) },
];
const imageRepeatOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	{ value: 'no-repeat', label: __( 'No Repeat', 'getwid' ) },
	{ value: 'repeat', label: __( 'Repeat', 'getwid' ) },
	{ value: 'repeat-x', label: __( 'Repeat X', 'getwid' ) },
	{ value: 'repeat-y', label: __( 'Repeat Y', 'getwid' ) },
	{ value: 'space', label: __( 'Space', 'getwid' ) },
	{ value: 'round', label: __( 'Round', 'getwid' ) },
];
const imageSizeOptions = [
	{ value: '', label: __( 'Cover', 'getwid' ) },
	{ value: 'contain', label: __( 'Contain', 'getwid' ) },
	{ value: 'auto', label: __( 'Auto', 'getwid' ) },
];
const imageAttachmentOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	{ value: 'scroll', label: __( 'Scroll', 'getwid' ) },
	{ value: 'fixed', label: __( 'Fixed', 'getwid' ) },
];
const verticalAlignOptions = [
	{ value: 'flex-start', label: __( 'Top', 'getwid' ) },
	{ value: 'center', label: __( 'Middle', 'getwid' ) },
	{ value: 'flex-end', label: __( 'Bottom', 'getwid' ) },
];
const responsiveVerticalAlignOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	...verticalAlignOptions,
];
const horizontalAlignOptions = [
	{ value: 'flex-start', label: __( 'Left', 'getwid' ) },
	{ value: 'center', label: __( 'Center', 'getwid' ) },
	{ value: 'flex-end', label: __( 'Right', 'getwid' ) },
];
const responsiveHorizontalAlignOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	...horizontalAlignOptions,
];
const dividersOptions = [
	{ value: '', label: __( 'None', 'getwid' ) },
	{ value: 'tilt', label: __( 'Tilt', 'getwid' ) },
	{ value: 'tilt-negative', label: __( 'Tilt Negative', 'getwid' ) },
	{ value: 'tilt-layered-1', label: __( 'Tilt Layered 1', 'getwid' ) },
	{ value: 'tilt-layered-2', label: __( 'Tilt Layered 2', 'getwid' ) },
	{ value: 'tilt-layered-3', label: __( 'Tilt Layered 3', 'getwid' ) },
	{ value: 'split', label: __( 'Split', 'getwid' ) },
	{ value: 'split-negative', label: __( 'Split Negative', 'getwid' ) },
	{ value: 'clouds', label: __( 'Clouds', 'getwid' ) },
	{ value: 'clouds-negative', label: __( 'Clouds Negative', 'getwid' ) },
	{ value: 'book', label: __( 'Book', 'getwid' ) },
	{ value: 'book-negative', label: __( 'Book Negative', 'getwid' ) },
	{ value: 'arrow', label: __( 'Arrow', 'getwid' ) },
	{ value: 'arrow-negative', label: __( 'Arrow Negative', 'getwid' ) },
	{
		value: 'triangle-rounded',
		label: __( 'Triangle Rounded', 'getwid' ),
	},
	{
		value: 'triangle-negative-rounded',
		label: __( 'Triangle Rounded Negative', 'getwid' ),
	},
	{
		value: 'triangle-asymmetrical-rounded',
		label: __( 'Triangle Rounded Asymmetrical', 'getwid' ),
	},
	{
		value: 'triangle-asymmetrical-negative-rounded',
		label: __( 'Triangle Rounded Asymmetrical Negative', 'getwid' ),
	},
	{ value: 'triangle', label: __( 'Triangle', 'getwid' ) },
	{ value: 'triangle-negative', label: __( 'Triangle Negative', 'getwid' ) },
	{
		value: 'triangle-asymmetrical',
		label: __( 'Triangle Asymmetrical', 'getwid' ),
	},
	{
		value: 'triangle-asymmetrical-negative',
		label: __( 'Triangle Asymmetrical Negative', 'getwid' ),
	},
	{
		value: 'triangle-layered-asymmetrical',
		label: __( 'Triangle Layered Asymmetrical', 'getwid' ),
	},
	{ value: 'waves', label: __( 'Waves', 'getwid' ) },
	{ value: 'waves-light', label: __( 'Waves Light', 'getwid' ) },
	{ value: 'waves-large', label: __( 'Waves Large', 'getwid' ) },
	{
		value: 'waves-large-negative',
		label: __( 'Waves Large Negative', 'getwid' ),
	},
	{ value: 'waves-layered', label: __( 'Waves Layered', 'getwid' ) },
	{ value: 'mountains', label: __( 'Waves Multi-Layered', 'getwid' ) },
	{ value: 'waves-pattern', label: __( 'Waves Pattern', 'getwid' ) },
	{ value: 'drips', label: __( 'Drips', 'getwid' ) },
	{ value: 'drips-negative', label: __( 'Drips Negative', 'getwid' ) },
	{ value: 'drops', label: __( 'Drops', 'getwid' ) },
	{ value: 'drops-negative', label: __( 'Drops Negative', 'getwid' ) },
	{ value: 'tilted-drips', label: __( 'Tilted Drips', 'getwid' ) },
	{
		value: 'tilted-drips-negative',
		label: __( 'Tilted Drips Negative', 'getwid' ),
	},
	{ value: 'pyramids', label: __( 'Pyramids', 'getwid' ) },
	{ value: 'pyramids-negative', label: __( 'Pyramids Negative', 'getwid' ) },
	{ value: 'pyramids-round', label: __( 'Pyramids Rounded', 'getwid' ) },
	{
		value: 'pyramids-round-negative',
		label: __( 'Pyramids Rounded Negative', 'getwid' ),
	},
	{ value: 'opacity-pyramids', label: __( 'Pyramids Layered', 'getwid' ) },
	{ value: 'curve', label: __( 'Curve', 'getwid' ) },
	{ value: 'curve-negative', label: __( 'Curve Negative', 'getwid' ) },
	{ value: 'curve-1', label: __( 'Curve 1', 'getwid' ) },
	{ value: 'curve-2', label: __( 'Curve 2', 'getwid' ) },
	{ value: 'curve-3', label: __( 'Curve 3', 'getwid' ) },
	{ value: 'curve-4', label: __( 'Curve 4', 'getwid' ) },
	{ value: 'curve-5', label: __( 'Curve 5', 'getwid' ) },
	{ value: 'curve-6', label: __( 'Curve 6', 'getwid' ) },
	{ value: 'curve-7', label: __( 'Curve 7', 'getwid' ) },
	{ value: 'curve-8', label: __( 'Curve 8', 'getwid' ) },
	{ value: 'curve-layered-1', label: __( 'Curve Layered 1', 'getwid' ) },
	{ value: 'curve-layered-2', label: __( 'Curve Layered 2', 'getwid' ) },
	{ value: 'curve-layered-3', label: __( 'Curve Layered 3', 'getwid' ) },
	{ value: 'curve-layered-4', label: __( 'Curve Layered 4', 'getwid' ) },
	{ value: 'zigzag-ice', label: __( 'Zigzag', 'getwid' ) },
	{ value: 'zigzag-ice-negative', label: __( 'Zigzag Negative', 'getwid' ) },
	{ value: 'zigzag-pattern', label: __( 'Zigzag Pattern', 'getwid' ) },
];
const dividerHeightUnits = [
	{ label: 'px', value: 'px' },
	{ label: 'vh', value: 'vh' },
	{ label: 'vw', value: 'vw' },
];

function pickMedia( media: SectionMedia ): SectionMedia {
	return {
		alt: media.alt,
		id: media.id,
		url: media.url,
	};
}

export default function Inspector( props: SectionEditProps ) {
	const [ tabName, setTabName ] = useState< TabName >( 'general' );
	const [ backgroundType, setBackgroundType ] =
		useState< BackgroundType >( 'color' );
	const [ foregroundType, setForegroundType ] =
		useState< ForegroundType >( 'color' );

	return (
		<InspectorControls>
			<TabsControl
				state={ tabName }
				onChangeTab={ ( nextTabName ) =>
					setTabName( nextTabName as TabName )
				}
				tabs={ [ 'general', 'style', 'advanced' ] }
			/>
			{ tabName === 'general' && <GeneralSettings { ...props } /> }
			{ tabName === 'style' && (
				<StyleSettings
					{ ...props }
					backgroundType={ backgroundType }
					setBackgroundType={ setBackgroundType }
					foregroundType={ foregroundType }
					setForegroundType={ setForegroundType }
				/>
			) }
			{ tabName === 'advanced' && <AdvancedSettings { ...props } /> }
		</InspectorControls>
	);
}

function GeneralSettings( props: SectionEditProps ) {
	return (
		<PanelBody initialOpen>
			<SizeSettings { ...props } />
			<AlignmentSettings { ...props } />
		</PanelBody>
	);
}

function SizeSettings( { attributes, setAttributes }: SectionEditProps ) {
	const {
		contentMaxWidthPreset,
		contentMaxWidth,
		minHeight,
		gapSize,
		resetMinHeightTablet,
		resetMinHeightMobile,
	} = attributes;

	return (
		<>
			<Notice>
				<p>
					{ __(
						'Set the default width of the content area in Getwid Settings.',
						'getwid'
					) }{ ' ' }
					<ExternalLink href={ Getwid.options_url.appearance }>
						{ __( 'Getwid Settings', 'getwid' ) }
					</ExternalLink>
				</p>
			</Notice>
			<BaseControl>
				<BaseControl.VisualLabel>
					{ __( 'Content Area Width', 'getwid' ) }
				</BaseControl.VisualLabel>
				<RadioControl
					className="getwid-content-area-width-control"
					selected={ contentMaxWidthPreset || 'boxed' }
					options={ [
						{ value: 'boxed', label: __( 'Default', 'getwid' ) },
						{ value: 'full', label: __( 'Full Width', 'getwid' ) },
						{
							value: 'custom',
							label: __( 'Custom Width', 'getwid' ),
						},
					] }
					onChange={ ( nextContentMaxWidthPreset ) =>
						setAttributes( {
							contentMaxWidthPreset: nextContentMaxWidthPreset,
						} )
					}
				/>
				{ contentMaxWidthPreset === 'custom' && (
					<RangeControl
						value={ contentMaxWidth }
						onChange={ ( nextContentMaxWidth ) =>
							setAttributes( {
								contentMaxWidth: nextContentMaxWidth,
							} )
						}
						allowReset
						min={ 0 }
						max={ 2000 }
						step={ 1 }
					/>
				) }
			</BaseControl>
			<BaseControl>
				<BaseControl.VisualLabel>
					{ __( 'Section Height', 'getwid' ) }
				</BaseControl.VisualLabel>
				<TabPanel
					className="getwid-editor-tabs"
					activeClass="is-active"
					tabs={ responsiveTabs }
				>
					{ ( tab: { name: ResponsiveTabName } ) => {
						if ( tab.name === 'desktop' ) {
							return (
								<StyleLengthControl
									value={ minHeight }
									units={ [
										{ label: 'px', value: 'px' },
										{ label: 'vh', value: 'vh' },
										{ label: 'vw', value: 'vw' },
										{ label: '%', value: '%' },
									] }
									onChange={ ( nextMinHeight ) =>
										setAttributes( {
											minHeight: nextMinHeight,
										} )
									}
								/>
							);
						}

						if ( tab.name === 'tablet' ) {
							return (
								<CheckboxControl
									label={ __(
										'Reset height on tablet',
										'getwid'
									) }
									checked={ !! resetMinHeightTablet }
									onChange={ ( nextResetMinHeightTablet ) =>
										setAttributes( {
											resetMinHeightTablet:
												nextResetMinHeightTablet,
										} )
									}
								/>
							);
						}

						return (
							<CheckboxControl
								label={ __(
									'Reset height on mobile',
									'getwid'
								) }
								checked={ !! resetMinHeightMobile }
								onChange={ ( nextResetMinHeightMobile ) =>
									setAttributes( {
										resetMinHeightMobile:
											nextResetMinHeightMobile,
									} )
								}
							/>
						);
					} }
				</TabPanel>
			</BaseControl>
			<SelectControl
				label={ __( 'Vertical space between blocks', 'getwid' ) }
				value={ gapSize }
				onChange={ ( nextGapSize ) =>
					setAttributes( { gapSize: nextGapSize } )
				}
				options={ [
					{ value: '', label: __( 'Default', 'getwid' ) },
					{ value: 'small', label: __( 'Small', 'getwid' ) },
					{ value: 'medium', label: __( 'Medium', 'getwid' ) },
					{ value: 'normal', label: __( 'Normal', 'getwid' ) },
					{ value: 'large', label: __( 'Large', 'getwid' ) },
					{ value: 'huge', label: __( 'Huge', 'getwid' ) },
					{ value: 'none', label: __( 'None', 'getwid' ) },
				] }
			/>
		</>
	);
}

function AlignmentSettings( { attributes, setAttributes }: SectionEditProps ) {
	const {
		verticalAlign,
		verticalAlignTablet,
		verticalAlignMobile,
		horizontalAlign,
		horizontalAlignTablet,
		horizontalAlignMobile,
	} = attributes;

	return (
		<BaseControl>
			<BaseControl.VisualLabel>
				{ __( 'Content Area Alignment', 'getwid' ) }
			</BaseControl.VisualLabel>
			<TabPanel
				className="getwid-editor-tabs"
				activeClass="is-active"
				tabs={ responsiveTabs }
			>
				{ ( tab: { name: ResponsiveTabName } ) => {
					let verticalValue = verticalAlign || 'center';
					let horizontalValue = horizontalAlign || 'center';

					if ( tab.name === 'tablet' ) {
						verticalValue = verticalAlignTablet || 'center';
						horizontalValue = horizontalAlignTablet || 'center';
					} else if ( tab.name === 'mobile' ) {
						verticalValue = verticalAlignMobile || 'center';
						horizontalValue = horizontalAlignMobile || 'center';
					}

					return (
						<>
							<SelectControl
								label={ __( 'Vertical Alignment', 'getwid' ) }
								value={ verticalValue }
								onChange={ ( value ) => {
									if ( tab.name === 'desktop' ) {
										setAttributes( {
											verticalAlign: value,
										} );
										return;
									}

									if ( tab.name === 'tablet' ) {
										setAttributes( {
											verticalAlignTablet: value,
										} );
										return;
									}

									setAttributes( {
										verticalAlignMobile: value,
									} );
								} }
								options={
									tab.name === 'desktop'
										? verticalAlignOptions
										: responsiveVerticalAlignOptions
								}
							/>
							<SelectControl
								label={ __( 'Horizontal Alignment', 'getwid' ) }
								value={ horizontalValue }
								onChange={ ( value ) => {
									if ( tab.name === 'desktop' ) {
										setAttributes( {
											horizontalAlign: value,
										} );
										return;
									}

									if ( tab.name === 'tablet' ) {
										setAttributes( {
											horizontalAlignTablet: value,
										} );
										return;
									}

									setAttributes( {
										horizontalAlignMobile: value,
									} );
								} }
								options={
									tab.name === 'desktop'
										? horizontalAlignOptions
										: responsiveHorizontalAlignOptions
								}
							/>
						</>
					);
				} }
			</TabPanel>
		</BaseControl>
	);
}

type StyleSettingsProps = SectionEditProps & {
	backgroundType: BackgroundType;
	setBackgroundType: ( value: BackgroundType ) => void;
	foregroundType: ForegroundType;
	setForegroundType: ( value: ForegroundType ) => void;
};

function StyleSettings( props: StyleSettingsProps ) {
	const {
		backgroundType,
		setBackgroundType,
		foregroundType,
		setForegroundType,
	} = props;

	return (
		<>
			<PanelBody title={ __( 'Background', 'getwid' ) } initialOpen>
				<CustomBackgroundControl
					state={ backgroundType }
					stateName="backgroundType"
					onChangeBackgroundType={ ( _stateName, value ) =>
						setBackgroundType( value )
					}
					types={ [
						'color',
						'image',
						'gradient',
						'slider',
						'video',
					] }
				/>
				{ backgroundType === 'color' && (
					<ColorSettings
						{ ...props }
						prefix="background"
						title={ __( 'Background Color', 'getwid' ) }
					/>
				) }
				{ backgroundType === 'image' && (
					<ImageSettings { ...props } prefix="background" />
				) }
				{ backgroundType === 'gradient' && (
					<GradientSettings { ...props } prefix="background" />
				) }
				{ backgroundType === 'slider' && (
					<SliderSettings { ...props } />
				) }
				{ backgroundType === 'video' && <VideoSettings { ...props } /> }
			</PanelBody>
			<PanelBody
				title={ __( 'Overlay', 'getwid' ) }
				initialOpen={ false }
			>
				<ForegroundSettings { ...props } />
				<CustomBackgroundControl
					label={ __( 'Overlay Type', 'getwid' ) }
					state={ foregroundType }
					stateName="foregroundType"
					onChangeBackgroundType={ ( _stateName, value ) =>
						setForegroundType( value )
					}
					types={ [ 'color', 'image', 'gradient' ] }
				/>
				{ foregroundType === 'color' && (
					<ColorSettings
						{ ...props }
						prefix="foreground"
						title={ __( 'Overlay Color', 'getwid' ) }
					/>
				) }
				{ foregroundType === 'image' && (
					<ImageSettings { ...props } prefix="foreground" />
				) }
				{ foregroundType === 'gradient' && (
					<GradientSettings { ...props } prefix="foreground" />
				) }
			</PanelBody>
			<SpacingSettings { ...props } type="padding" />
			<SpacingSettings { ...props } type="margin" />
		</>
	);
}

function AdvancedSettings( props: SectionEditProps ) {
	return (
		<>
			<AnimationSettings { ...props } />
			<DividersSettings { ...props } />
		</>
	);
}

function useEditorSettings() {
	return useSelect( ( select ) => {
		const settings = (
			select( 'core/block-editor' ) as {
				getSettings: () => EditorSettings;
			}
		 ).getSettings();

		return {
			colors: settings.colors || [],
			gradients: settings.gradients || [],
			disableCustomGradients: settings.disableCustomGradients,
		};
	}, [] );
}

function ColorSettings( {
	attributes,
	setAttributes,
	prefix,
	title,
	setBackgroundColor,
	backgroundColor,
}: SectionEditProps & {
	prefix: 'background' | 'foreground';
	title: string;
} ) {
	let value: { customColor?: string; defaultColor?: ColorValue } = {
		customColor: attributes.customBackgroundColor,
		defaultColor: backgroundColor,
	};

	if ( 'foreground' === prefix ) {
		value = {
			customColor: attributes.foregroundColor,
		};
	}

	return (
		<CustomColorPalette
			colorSettings={ [
				{
					title,
					colors: value,
					changeColor: ( color ) => {
						if ( 'foreground' === prefix ) {
							setAttributes( { foregroundColor: color } );
						} else {
							setBackgroundColor( color );
						}
					},
				},
			] }
		/>
	);
}

function GradientSettings( {
	attributes,
	setAttributes,
	prefix,
}: SectionEditProps & { prefix: 'background' | 'foreground' } ) {
	const settings = useEditorSettings();
	const value =
		prefix === 'background'
			? attributes.backgroundGradient
			: attributes.foregroundGradient;

	return (
		<GradientPicker
			value={ value }
			onChange={ ( gradient ) =>
				setAttributes(
					prefix === 'background'
						? { backgroundGradient: gradient }
						: { foregroundGradient: gradient }
				)
			}
			gradients={ settings.gradients }
			disableCustomGradients={ settings.disableCustomGradients }
			__nextHasNoMargin
		/>
	);
}

function ImageSettings(
	props: SectionEditProps & {
		prefix: 'background' | 'foreground';
	}
) {
	const { attributes, setAttributes, prefix } = props;
	const image =
		prefix === 'background'
			? attributes.backgroundImage
			: attributes.foregroundImage;
	const position =
		prefix === 'background'
			? attributes.backgroundImagePosition
			: attributes.foregroundImagePosition;
	const customPosition =
		prefix === 'background'
			? attributes.backgroundCustomImagePosition
			: attributes.foregroundCustomImagePosition;
	const resetForegroundImage = () =>
		setAttributes( {
			foregroundImage: undefined,
			foregroundCustomImagePosition: undefined,
			foregroundImagePosition: undefined,
			foregroundImageAttachment: undefined,
			foregroundImageRepeat: undefined,
			foregroundImageSize: undefined,
		} );

	function setImageAttributes( nextAttributes: Record< string, unknown > ) {
		setAttributes( nextAttributes );
	}

	return (
		<>
			<MediaControl
				label={
					prefix === 'background'
						? __( 'Background Image', 'getwid' )
						: __( 'Overlay Image', 'getwid' )
				}
				id={ Number( image?.id ) }
				url={ image?.url }
				onSelectMedia={ ( media ) =>
					setImageAttributes(
						prefix === 'background'
							? { backgroundImage: pickMedia( media ) }
							: { foregroundImage: pickMedia( media ) }
					)
				}
				onRemoveMedia={ () =>
					prefix === 'background'
						? setImageAttributes( { backgroundImage: undefined } )
						: resetForegroundImage()
				}
			/>
			{ !! image && (
				<div className="getwid-section-background-settings">
					<span className="getwid-section-background-settings__label">
						{ __( 'Background Settings', 'getwid' ) }
					</span>
					<Dropdown
						className="getwid-section-background-settings__dropdown-action"
						contentClassName="getwid-section-background-settings__dropdown-content"
						popoverProps={ { placement: 'top-end' } }
						renderToggle={ ( { isOpen, onToggle } ) => (
							<Button variant="secondary" onClick={ onToggle }>
								<Dashicon icon="admin-tools" />
							</Button>
						) }
						renderContent={ () => (
							<div style={ { width: '200px', maxWidth: '90vw' } }>
								<SelectControl
									label={ __( 'Position', 'getwid' ) }
									value={ position || '' }
									options={ imagePositionOptions }
									onChange={ ( value ) =>
										setImageAttributes(
											prefix === 'background'
												? {
														backgroundImagePosition:
															value,
												  }
												: {
														foregroundImagePosition:
															value,
												  }
										)
									}
								/>
								{ position === 'custom' && image?.url && (
									<FocalPointPicker
										url={ image.url }
										value={
											customPosition || { x: 0.5, y: 0.5 }
										}
										onChange={ ( value ) =>
											setImageAttributes(
												prefix === 'background'
													? {
															backgroundCustomImagePosition:
																value,
													  }
													: {
															foregroundCustomImagePosition:
																value,
													  }
											)
										}
									/>
								) }
								<SelectControl
									label={ __( 'Attachment', 'getwid' ) }
									value={
										( prefix === 'background'
											? attributes.backgroundImageAttachment
											: attributes.foregroundImageAttachment ) ||
										''
									}
									options={ imageAttachmentOptions }
									onChange={ ( value ) =>
										setImageAttributes(
											prefix === 'background'
												? {
														backgroundImageAttachment:
															value,
												  }
												: {
														foregroundImageAttachment:
															value,
												  }
										)
									}
								/>
								<SelectControl
									label={ __( 'Repeat', 'getwid' ) }
									value={
										( prefix === 'background'
											? attributes.backgroundImageRepeat
											: attributes.foregroundImageRepeat ) ||
										''
									}
									options={ imageRepeatOptions }
									onChange={ ( value ) =>
										setImageAttributes(
											prefix === 'background'
												? {
														backgroundImageRepeat:
															value,
												  }
												: {
														foregroundImageRepeat:
															value,
												  }
										)
									}
								/>
								<SelectControl
									label={ __( 'Size', 'getwid' ) }
									value={
										( prefix === 'background'
											? attributes.backgroundImageSize
											: attributes.foregroundImageSize ) ||
										''
									}
									options={ imageSizeOptions }
									onChange={ ( value ) =>
										setImageAttributes(
											prefix === 'background'
												? { backgroundImageSize: value }
												: { foregroundImageSize: value }
										)
									}
								/>
							</div>
						) }
					/>
				</div>
			) }
		</>
	);
}

function SliderSettings( { attributes, setAttributes }: SectionEditProps ) {
	const {
		sliderImages = [],
		sliderAnimationEffect,
		sliderAnimationDuration,
		sliderAnimationSpeed,
	} = attributes;

	return (
		<>
			{ sliderImages.length === 0 && (
				<MediaPlaceholder
					icon="format-gallery"
					labels={ {
						title: __( 'Slider', 'getwid' ),
						instructions: __(
							'Drag images, upload new ones or select files from your library.',
							'getwid'
						),
					} }
					onSelect={ ( media: SectionMedia[] ) =>
						setAttributes( {
							sliderImages: media.map( pickMedia ),
						} )
					}
					accept="image/*"
					allowedTypes={ imageAllowedTypes }
					multiple
				/>
			) }
			{ sliderImages.length > 0 && (
				<>
					<MediaUpload
						onSelect={ ( media: SectionMedia[] ) =>
							setAttributes( {
								sliderImages: media.map( pickMedia ),
							} )
						}
						multiple
						gallery
						allowedTypes={ imageAllowedTypes }
						value={ sliderImages.map( ( image ) =>
							Number( image.id )
						) }
						render={ ( { open }: { open: () => void } ) => (
							<BaseControl>
								<div className="getwid-slider-image-wrapper">
									{ sliderImages.map( ( image ) => (
										<img
											key={ image.url }
											src={ image.url }
											alt={ image.alt }
										/>
									) ) }
								</div>
								<ButtonGroup>
									<Button variant="primary" onClick={ open }>
										{ __( 'Select Images', 'getwid' ) }
									</Button>
									<Button
										variant="secondary"
										onClick={ () =>
											setAttributes( {
												sliderImages: [],
											} )
										}
									>
										{ __( 'Remove', 'getwid' ) }
									</Button>
								</ButtonGroup>
							</BaseControl>
						) }
					/>
					<RadioControl
						label={ __( 'Animation Effect', 'getwid' ) }
						selected={ sliderAnimationEffect || '' }
						options={ [
							{ value: '', label: __( 'Slide', 'getwid' ) },
							{ value: 'fade', label: __( 'Fade', 'getwid' ) },
						] }
						onChange={ ( value ) =>
							setAttributes( { sliderAnimationEffect: value } )
						}
					/>
					<TextControl
						label={ __( 'Animation Duration', 'getwid' ) }
						value={ sliderAnimationDuration || '' }
						type="number"
						min={ 0 }
						onChange={ ( value ) =>
							setAttributes( { sliderAnimationDuration: value } )
						}
					/>
					<TextControl
						label={ __( 'Animation Speed', 'getwid' ) }
						type="number"
						value={ sliderAnimationSpeed || '' }
						min={ 0 }
						onChange={ ( value ) =>
							setAttributes( { sliderAnimationSpeed: value } )
						}
					/>
				</>
			) }
		</>
	);
}

function VideoSettings( { attributes, setAttributes }: SectionEditProps ) {
	const {
		backgroundVideoType,
		backgroundVideoUrl,
		backgroundVideoMute,
		backgroundVideoLoop,
		backgroundVideoAutoplay,
		backgroundVideoPoster,
		backgroundVideoControlsPosition,
		youTubeVideoUrl,
		youTubeVideoScale,
		youTubeVideoMute,
		youTubeVideoLoop,
		youTubeVideoAutoplay,
	} = attributes;

	return (
		<>
			<SelectControl
				label={ __( 'Source', 'getwid' ) }
				value={ backgroundVideoType || 'self' }
				onChange={ ( value ) =>
					setAttributes( { backgroundVideoType: value } )
				}
				options={ [
					{ value: 'youtube', label: __( 'YouTube', 'getwid' ) },
					{ value: 'self', label: __( 'Media Library', 'getwid' ) },
				] }
			/>
			{ backgroundVideoType === 'youtube' && (
				<TextControl
					label={ __( 'YouTube URL', 'getwid' ) }
					placeholder="https://youtube.com/watch?v=M7lc1UVf-VE"
					value={ youTubeVideoUrl || '' }
					onChange={ ( value ) =>
						setAttributes( { youTubeVideoUrl: value } )
					}
				/>
			) }
			{ ( backgroundVideoType || 'self' ) === 'self' && (
				<>
					{ backgroundVideoUrl?.url && (
						<video controls>
							<source
								src={ backgroundVideoUrl.url }
								type="video/mp4"
							/>
							<span>
								{ __(
									'Your browser does not support the video tag.',
									'getwid'
								) }
							</span>
						</video>
					) }
					<MediaUpload
						onSelect={ ( media: SectionMedia ) => {
							setAttributes( { backgroundVideoUrl: undefined } );
							setAttributes( {
								backgroundVideoUrl: media
									? pickMedia( media )
									: {},
							} );
						} }
						value={ Number( backgroundVideoUrl?.id ) || undefined }
						allowedTypes={ videoAllowedTypes }
						render={ ( { open }: { open: () => void } ) => (
							<BaseControl>
								<Button variant="primary" onClick={ open }>
									{ __( 'Select Video', 'getwid' ) }
								</Button>
								{ !! backgroundVideoUrl && (
									<Button
										variant="secondary"
										onClick={ () =>
											setAttributes( {
												backgroundVideoUrl: undefined,
											} )
										}
									>
										{ __( 'Remove', 'getwid' ) }
									</Button>
								) }
							</BaseControl>
						) }
					/>
				</>
			) }
			{ youTubeVideoUrl && backgroundVideoType === 'youtube' && (
				<>
					<SelectControl
						label={ __( 'Video Scale', 'getwid' ) }
						value={ youTubeVideoScale || '' }
						onChange={ ( value ) =>
							setAttributes( { youTubeVideoScale: value } )
						}
						options={ [
							{ value: '', label: __( 'Default', 'getwid' ) },
							{ value: 'low', label: __( 'Low', 'getwid' ) },
							{
								value: 'medium',
								label: __( 'Medium', 'getwid' ),
							},
							{ value: 'high', label: __( 'High', 'getwid' ) },
							{ value: 'huge', label: __( 'Huge', 'getwid' ) },
						] }
					/>
					<ToggleStringControl
						label={ __( 'Mute', 'getwid' ) }
						help={ __(
							'Enable this option to increase the chances for autoplay to succeed.',
							'getwid'
						) }
						value={ youTubeVideoMute }
						onChange={ ( value ) =>
							setAttributes( { youTubeVideoMute: value } )
						}
					/>
					<ToggleStringControl
						label={ __( 'Repeat', 'getwid' ) }
						value={ youTubeVideoLoop }
						onChange={ ( value ) =>
							setAttributes( { youTubeVideoLoop: value } )
						}
					/>
					<ToggleStringControl
						label={ __( 'Autoplay', 'getwid' ) }
						value={ youTubeVideoAutoplay }
						onChange={ ( value ) =>
							setAttributes( { youTubeVideoAutoplay: value } )
						}
					/>
				</>
			) }
			{ backgroundVideoUrl && backgroundVideoType === 'self' && (
				<>
					<CheckboxControl
						label={ __( 'Mute', 'getwid' ) }
						help={ __(
							'Enable this option to increase the chances for autoplay to succeed.',
							'getwid'
						) }
						checked={
							backgroundVideoMute !== undefined
								? backgroundVideoMute
								: true
						}
						onChange={ ( value ) =>
							setAttributes( { backgroundVideoMute: value } )
						}
					/>
					<CheckboxControl
						label={ __( 'Repeat', 'getwid' ) }
						checked={ !! backgroundVideoLoop }
						onChange={ ( value ) =>
							setAttributes( { backgroundVideoLoop: value } )
						}
					/>
					<CheckboxControl
						label={ __( 'Autoplay', 'getwid' ) }
						checked={ !! backgroundVideoAutoplay }
						onChange={ ( value ) =>
							setAttributes( { backgroundVideoAutoplay: value } )
						}
					/>
				</>
			) }
			{ ( backgroundVideoUrl || youTubeVideoUrl ) && (
				<SelectControl
					label={ __( 'Controls Position', 'getwid' ) }
					value={ backgroundVideoControlsPosition }
					onChange={ ( value ) =>
						setAttributes( {
							backgroundVideoControlsPosition: value,
						} )
					}
					options={ [
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{
							value: 'top-left',
							label: __( 'Top Left', 'getwid' ),
						},
						{
							value: 'top-right',
							label: __( 'Top Right', 'getwid' ),
						},
						{
							value: 'bottom-left',
							label: __( 'Bottom Left', 'getwid' ),
						},
						{
							value: 'bottom-right',
							label: __( 'Bottom Right', 'getwid' ),
						},
						{
							value: 'center-center',
							label: __( 'Center Center', 'getwid' ),
						},
					] }
				/>
			) }
			{ backgroundVideoUrl && (
				<PosterImageSettings
					backgroundVideoPoster={ backgroundVideoPoster }
					setAttributes={ setAttributes }
				/>
			) }
		</>
	);
}

function PosterImageSettings( {
	backgroundVideoPoster,
	setAttributes,
}: {
	backgroundVideoPoster?: string;
	setAttributes: SectionEditProps[ 'setAttributes' ];
} ) {
	return (
		<>
			<MediaUpload
				onSelect={ ( posterImageDetails: SectionMedia ) =>
					setAttributes( {
						backgroundVideoPoster: posterImageDetails.url,
					} )
				}
				allowedTypes={ imageAllowedTypes }
				value={ backgroundVideoPoster }
				render={ ( { open }: { open: () => void } ) => (
					<BaseControl>
						<Button variant="secondary" onClick={ open }>
							{ ! backgroundVideoPoster &&
								__( 'Select Poster', 'getwid' ) }
							{ !! backgroundVideoPoster &&
								__( 'Replace Poster', 'getwid' ) }
						</Button>
					</BaseControl>
				) }
			/>
			{ !! backgroundVideoPoster && (
				<BaseControl>
					<Button
						variant="link"
						isDestructive
						onClick={ () =>
							setAttributes( {
								backgroundVideoPoster: undefined,
							} )
						}
					>
						{ __( 'Remove Poster', 'getwid' ) }
					</Button>
				</BaseControl>
			) }
		</>
	);
}

function ToggleStringControl( {
	label,
	help,
	value,
	onChange,
}: {
	label: string;
	help?: string;
	value?: string;
	onChange: ( value: string ) => void;
} ) {
	return (
		<CheckboxControl
			label={ label }
			help={ help }
			checked={ value === 'true' }
			onChange={ ( checked ) => onChange( checked ? 'true' : 'false' ) }
		/>
	);
}

function ForegroundSettings( { attributes, setAttributes }: SectionEditProps ) {
	const { foregroundOpacity, foregroundFilter } = attributes;

	return (
		<>
			<RangeControl
				label={ __( 'Overlay Layer Opacity', 'getwid' ) }
				value={ foregroundOpacity }
				onChange={ ( value ) =>
					setAttributes( { foregroundOpacity: value } )
				}
				min={ 0 }
				max={ 100 }
				step={ 1 }
				allowReset
			/>
			<SelectControl
				label={ __( 'Blend Mode', 'getwid' ) }
				value={ foregroundFilter || '' }
				onChange={ ( value ) =>
					setAttributes( { foregroundFilter: value } )
				}
				options={ [
					{ value: '', label: __( 'None', 'getwid' ) },
					{ value: 'normal', label: __( 'Normal', 'getwid' ) },
					{ value: 'multiply', label: __( 'Multiply', 'getwid' ) },
					{ value: 'screen', label: __( 'Screen', 'getwid' ) },
					{ value: 'overlay', label: __( 'Overlay', 'getwid' ) },
					{ value: 'darken', label: __( 'Darken', 'getwid' ) },
					{ value: 'lighten', label: __( 'Lighten', 'getwid' ) },
					{
						value: 'color-dodge',
						label: __( 'Color Dodge', 'getwid' ),
					},
					{
						value: 'color-burn',
						label: __( 'Color Burn', 'getwid' ),
					},
					{
						value: 'hard-light',
						label: __( 'Hard Light', 'getwid' ),
					},
					{
						value: 'soft-light',
						label: __( 'Soft Light', 'getwid' ),
					},
					{
						value: 'difference',
						label: __( 'Difference', 'getwid' ),
					},
					{ value: 'exclusion', label: __( 'Exclusion', 'getwid' ) },
					{ value: 'hue', label: __( 'Hue', 'getwid' ) },
					{
						value: 'saturation',
						label: __( 'Saturation', 'getwid' ),
					},
					{ value: 'color', label: __( 'Color', 'getwid' ) },
					{
						value: 'luminosity',
						label: __( 'Luminosity', 'getwid' ),
					},
				] }
			/>
		</>
	);
}

function DividersSettings( { attributes, setAttributes }: SectionEditProps ) {
	const {
		dividerTop,
		dividersTopHeight,
		dividerTopColor,
		dividerBottom,
		dividersBottomHeight,
		dividersBringTop,
		dividerBottomColor,
	} = attributes;

	return (
		<PanelBody title={ __( 'Dividers', 'getwid' ) } initialOpen={ false }>
			<SelectControl
				label={ __( 'Top Divider', 'getwid' ) }
				value={ dividerTop || '' }
				options={ dividersOptions }
				onChange={ ( value ) => setAttributes( { dividerTop: value } ) }
			/>
			<StyleLengthControl
				label={ __( 'Top Divider Height', 'getwid' ) }
				value={ dividersTopHeight }
				units={ dividerHeightUnits }
				onChange={ ( value ) =>
					setAttributes( { dividersTopHeight: value } )
				}
			/>
			<SelectControl
				label={ __( 'Bottom Divider', 'getwid' ) }
				value={ dividerBottom || '' }
				options={ dividersOptions }
				onChange={ ( value ) =>
					setAttributes( { dividerBottom: value } )
				}
			/>
			<StyleLengthControl
				label={ __( 'Bottom Divider Height', 'getwid' ) }
				value={ dividersBottomHeight }
				units={ dividerHeightUnits }
				onChange={ ( value ) =>
					setAttributes( { dividersBottomHeight: value } )
				}
			/>
			<ToggleControl
				label={ __( 'Bring dividers to top', 'getwid' ) }
				checked={ !! dividersBringTop }
				onChange={ () =>
					setAttributes( { dividersBringTop: ! dividersBringTop } )
				}
			/>
			{ ( dividerTop || dividerBottom ) && (
				<CustomColorPalette
					colorSettings={ [
						...( dividerTop
							? [
									{
										title: __(
											'Top Divider Color',
											'getwid'
										),
										colors: {
											customColor: dividerTopColor,
										},
										changeColor: ( color?: string ) =>
											setAttributes( {
												dividerTopColor: color,
											} ),
									},
							  ]
							: [] ),
						...( dividerBottom
							? [
									{
										title: __(
											'Bottom Divider Color',
											'getwid'
										),
										colors: {
											customColor: dividerBottomColor,
										},
										changeColor: ( color?: string ) =>
											setAttributes( {
												dividerBottomColor: color,
											} ),
									},
							  ]
							: [] ),
					] }
				/>
			) }
		</PanelBody>
	);
}

function SpacingSettings( props: SectionEditProps & { type: SpacingType } ) {
	const { type } = props;
	const [ locks, setLocks ] = useState( {
		desktop: false,
		tablet: false,
		mobile: false,
	} );

	return (
		<PanelBody
			title={
				type === 'padding'
					? __( 'Padding', 'getwid' )
					: __( 'Margin', 'getwid' )
			}
			initialOpen={ false }
		>
			<TabPanel
				className="getwid-editor-tabs"
				activeClass="is-active"
				tabs={ responsiveTabs }
			>
				{ ( tab: { name: ResponsiveTabName } ) => (
					<ResponsiveSpacingSettings
						{ ...props }
						tab={ tab.name }
						isLocked={ locks[ tab.name ] }
						onChangeLock={ ( isLocked ) =>
							setLocks( {
								...locks,
								[ tab.name ]: isLocked,
							} )
						}
					/>
				) }
			</TabPanel>
			<BaseControl>
				<Button
					variant="link"
					onClick={ () => resetSpacing( props ) }
					disabled={ ! hasSpacing( props ) }
				>
					{ __( 'Reset All', 'getwid' ) }
				</Button>
			</BaseControl>
		</PanelBody>
	);
}

function getSpacingSuffix( tab: ResponsiveTabName ) {
	if ( tab === 'tablet' ) {
		return 'Tablet';
	}

	if ( tab === 'mobile' ) {
		return 'Mobile';
	}

	return '';
}

function getSpacingLabel(
	type: SpacingType,
	side: 'Top' | 'Bottom' | 'Left' | 'Right'
) {
	if ( type === 'padding' ) {
		if ( side === 'Top' ) {
			return __( 'Padding Top', 'getwid' );
		}

		if ( side === 'Bottom' ) {
			return __( 'Padding Bottom', 'getwid' );
		}

		if ( side === 'Left' ) {
			return __( 'Padding Left', 'getwid' );
		}

		return __( 'Padding Right', 'getwid' );
	}

	if ( side === 'Top' ) {
		return __( 'Margin Top', 'getwid' );
	}

	if ( side === 'Bottom' ) {
		return __( 'Margin Bottom', 'getwid' );
	}

	if ( side === 'Left' ) {
		return __( 'Margin Left', 'getwid' );
	}

	return __( 'Margin Right', 'getwid' );
}

function ResponsiveSpacingSettings( {
	attributes,
	setAttributes,
	type,
	tab,
	isLocked,
	onChangeLock,
}: SectionEditProps & {
	type: SpacingType;
	tab: ResponsiveTabName;
	isLocked: boolean;
	onChangeLock: ( isLocked: boolean ) => void;
} ) {
	const sides = [ 'Top', 'Bottom', 'Left', 'Right' ] as const;
	const suffix = getSpacingSuffix( tab );
	const getPresetAttrs = ( value: string ) =>
		sides.reduce< Record< string, string > >( ( nextAttrs, side ) => {
			nextAttrs[ `${ type }${ side }${ suffix }` ] = value;
			return nextAttrs;
		}, {} );
	const getValueAttrs = ( value: string ) =>
		sides.reduce< Record< string, string > >( ( nextAttrs, side ) => {
			nextAttrs[ `${ type }${ side }Value` ] = value;
			return nextAttrs;
		}, {} );

	return (
		<>
			{ sides.map( ( side ) => {
				const attrName =
					`${ type }${ side }${ suffix }` as keyof typeof attributes;
				const valueName =
					`${ type }${ side }Value` as keyof typeof attributes;
				const value = attributes[ attrName ] as string | undefined;
				const selectControl = (
					<SelectControl
						label={ getSpacingLabel( type, side ) }
						value={ value || '' }
						onChange={ ( nextValue ) => {
							if ( side === 'Top' && isLocked ) {
								setAttributes( getPresetAttrs( nextValue ) );
								return;
							}

							setAttributes( { [ attrName ]: nextValue } );
						} }
						options={
							tab === 'desktop'
								? spacingPresetOptions
								: responsiveSpacingPresetOptions
						}
						disabled={ side !== 'Top' && isLocked }
					/>
				);

				return (
					<>
						{ side === 'Top' ? (
							<div className="components-base-control components-base-control-with-lock">
								{ selectControl }
								<Button
									icon={ isLocked ? 'lock' : 'unlock' }
									onClick={ () => {
										if ( ! isLocked ) {
											onChangeLock( true );
											setAttributes(
												getPresetAttrs( value || '' )
											);
											return;
										}

										onChangeLock( false );
									} }
									label={
										isLocked
											? __( 'Unlock', 'getwid' )
											: __( 'Lock', 'getwid' )
									}
								/>
							</div>
						) : (
							selectControl
						) }
						{ tab === 'desktop' && value === 'custom' && (
							<StyleLengthControl
								allowNegative={ type === 'margin' }
								value={
									attributes[ valueName ] as
										| string
										| undefined
								}
								onChange={ ( nextValue ) => {
									const nextSpacingValue =
										typeof nextValue !== 'undefined'
											? nextValue
											: '';

									if ( side === 'Top' && isLocked ) {
										setAttributes(
											getValueAttrs( nextSpacingValue )
										);
										return;
									}

									setAttributes( {
										[ valueName ]: nextSpacingValue,
									} );
								} }
								isLocked={ side !== 'Top' && isLocked }
							/>
						) }
					</>
				);
			} ) }
		</>
	);
}

function resetSpacing( {
	setAttributes,
	type,
}: SectionEditProps & { type: SpacingType } ) {
	const prefix = type;
	const upperPrefix = type.charAt( 0 ).toUpperCase() + type.slice( 1 );

	setAttributes( {
		[ `${ prefix }TopValue` ]: undefined,
		[ `${ prefix }BottomValue` ]: undefined,
		[ `${ prefix }LeftValue` ]: undefined,
		[ `${ prefix }RightValue` ]: undefined,
		[ `${ prefix }Top` ]: '',
		[ `${ prefix }Bottom` ]: '',
		[ `${ prefix }Left` ]: '',
		[ `${ prefix }Right` ]: '',
		[ `${ prefix }TopTablet` ]: '',
		[ `${ prefix }BottomTablet` ]: '',
		[ `${ prefix }LeftTablet` ]: '',
		[ `${ prefix }RightTablet` ]: '',
		[ `${ prefix }TopMobile` ]: '',
		[ `${ prefix }BottomMobile` ]: '',
		[ `${ prefix }LeftMobile` ]: '',
		[ `${ prefix }RightMobile` ]: '',
		[ `isLocked${ upperPrefix }sOnDesktop` ]: false,
	} );
}

function hasSpacing( {
	attributes,
	type,
}: SectionEditProps & { type: SpacingType } ) {
	const keys = [
		`${ type }TopValue`,
		`${ type }BottomValue`,
		`${ type }LeftValue`,
		`${ type }RightValue`,
		`${ type }Top`,
		`${ type }Bottom`,
		`${ type }Left`,
		`${ type }Right`,
		`${ type }TopTablet`,
		`${ type }BottomTablet`,
		`${ type }LeftTablet`,
		`${ type }RightTablet`,
		`${ type }TopMobile`,
		`${ type }BottomMobile`,
		`${ type }LeftMobile`,
		`${ type }RightMobile`,
	] as Array< keyof typeof attributes >;

	return keys.some( ( key ) => {
		const value = attributes[ key ];

		return value !== undefined && value !== '';
	} );
}

function AnimationSettings( { attributes, setAttributes }: SectionEditProps ) {
	const {
		entranceAnimation,
		entranceAnimationDuration,
		entranceAnimationDelay,
	} = attributes;
	const hasAnimation =
		entranceAnimation !== undefined ||
		entranceAnimationDelay !== '200ms' ||
		entranceAnimationDuration !== '1500ms';

	return (
		<PanelBody title={ __( 'Entrance Animation', 'getwid' ) } initialOpen>
			<AnimationSelectControl
				label={ __( 'Animation Effect', 'getwid' ) }
				allowAnimation={ [ 'Entrance', 'Seeker' ] }
				value={ entranceAnimation || '' }
				onChange={ ( value ) =>
					setAttributes( { entranceAnimation: value } )
				}
			/>
			<SelectControl
				label={ __( 'Duration', 'getwid' ) }
				value={ entranceAnimationDuration || '' }
				onChange={ ( value ) =>
					setAttributes( { entranceAnimationDuration: value } )
				}
				options={ [
					{ value: '2000ms', label: __( 'Slow', 'getwid' ) },
					{ value: '1500ms', label: __( 'Normal', 'getwid' ) },
					{ value: '800ms', label: __( 'Fast', 'getwid' ) },
					{ value: '400ms', label: __( 'Very Fast', 'getwid' ) },
				] }
			/>
			<TextControl
				label={ __( 'Delay, ms', 'getwid' ) }
				value={
					entranceAnimationDelay
						? entranceAnimationDelay.replace( 'ms', '' )
						: ''
				}
				type="number"
				min={ 0 }
				placeholder="200"
				onChange={ ( value ) => {
					const delay = parseInt( value, 10 );
					setAttributes( {
						entranceAnimationDelay: Number.isNaN( delay )
							? undefined
							: `${ delay }ms`,
					} );
				} }
			/>
			<BaseControl>
				<Button
					variant="link"
					onClick={ () =>
						setAttributes( {
							entranceAnimation: undefined,
							entranceAnimationDelay: '200ms',
							entranceAnimationDuration: '1500ms',
						} )
					}
					disabled={ ! hasAnimation }
				>
					{ __( 'Reset', 'getwid' ) }
				</Button>
			</BaseControl>
		</PanelBody>
	);
}
