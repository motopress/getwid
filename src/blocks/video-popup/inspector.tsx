import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	CustomColorPalette,
	MediaControl,
	StyleLengthControl,
	TabsControl,
} from 'getwid-components';

import type { MediaObject, VideoPopupEditProps } from './types';

type TabName = 'general' | 'style';

const imageSizeOptions =
	(
		window as unknown as {
			Getwid?: {
				settings?: {
					image_sizes?: Array< { value: string; label: string } >;
				};
			};
		}
	 ).Getwid?.settings?.image_sizes || [];

type InspectorProps = VideoPopupEditProps & {
	imgObj: MediaObject | null;
	onSelectMedia: ( media: MediaObject ) => void;
	changeImageSize: ( media: MediaObject, imageSize: string ) => void;
};

export default function Inspector( props: InspectorProps ) {
	const {
		attributes,
		setAttributes,
		titleColor,
		setTitleColor,
		iconColor,
		setIconColor,
		buttonColor,
		setButtonColor,
		overlayColor,
		setOverlayColor,
		onSelectMedia,
		changeImageSize,
		imgObj,
	} = props;
	const {
		imageSize,
		id,
		url,
		link,
		minHeight,
		buttonMaxWidth,
		imageAnimation,
		buttonStyle,
		buttonAnimation,
		buttonSize,
		overlayOpacity,
		customIconColor,
		customTitleColor,
		customOverlayColor,
	} = attributes;
	const [ tabName, setTabName ] = useState< TabName >( 'general' );

	function onChangeImageSize( nextImageSize: string ) {
		if ( imgObj ) {
			setAttributes( { imageSize: nextImageSize } );
			changeImageSize( imgObj, nextImageSize );
		}
	}

	return (
		<InspectorControls>
			<TabsControl
				state={ tabName }
				onChangeTab={ ( nextTabName ) =>
					setTabName( nextTabName as TabName )
				}
				tabs={ [ 'general', 'style' ] }
			/>

			{ tabName === 'general' && (
				<PanelBody initialOpen>
					<MediaControl
						label={ __( 'Image', 'getwid' ) }
						url={ url }
						id={ id }
						onSelectMedia={ onSelectMedia }
						onRemoveMedia={ () =>
							setAttributes( {
								url: undefined,
								id: undefined,
							} )
						}
					/>
					<TextControl
						label={ __( 'Video URL', 'getwid' ) }
						help={ __(
							'Link to Youtube, Vimeo or self-hosted video. This video will be opened in a popup.',
							'getwid'
						) }
						value={ link || '' }
						onChange={ ( nextLink ) =>
							setAttributes( { link: nextLink } )
						}
					/>
				</PanelBody>
			) }

			{ tabName === 'style' && (
				<PanelBody initialOpen>
					<SelectControl
						label={ __( 'Button Style', 'getwid' ) }
						help={ __(
							'Button appearance depend on whether the image is selected.',
							'getwid'
						) }
						value={ buttonStyle }
						onChange={ ( nextButtonStyle ) =>
							setAttributes( { buttonStyle: nextButtonStyle } )
						}
						options={ [
							{
								value: 'default',
								label: __( 'Default', 'getwid' ),
							},
							{
								value: 'bordered',
								label: __( 'Border', 'getwid' ),
							},
							{
								value: 'outline',
								label: __( 'Outline', 'getwid' ),
							},
							{ value: 'fill', label: __( 'Fill', 'getwid' ) },
						] }
					/>
					<SelectControl
						label={ __( 'Button Size', 'getwid' ) }
						value={ buttonSize }
						onChange={ ( nextButtonSize ) =>
							setAttributes( { buttonSize: nextButtonSize } )
						}
						options={ [
							{
								value: 'default',
								label: __( 'Default', 'getwid' ),
							},
							{ value: 'small', label: __( 'Small', 'getwid' ) },
							{
								value: 'normal',
								label: __( 'Normal', 'getwid' ),
							},
							{ value: 'large', label: __( 'Large', 'getwid' ) },
						] }
					/>
					{ ! url && (
						<StyleLengthControl
							label={ __( 'Button Maximum Width', 'getwid' ) }
							value={ buttonMaxWidth }
							units={ [
								{ label: 'px', value: 'px' },
								{ label: 'vh', value: 'vh' },
								{ label: 'vw', value: 'vw' },
								{ label: '%', value: '%' },
							] }
							onChange={ ( nextButtonMaxWidth ) =>
								setAttributes( {
									buttonMaxWidth: nextButtonMaxWidth,
								} )
							}
						/>
					) }
					<SelectControl
						label={ __( 'Button Animation', 'getwid' ) }
						value={ buttonAnimation }
						onChange={ ( nextButtonAnimation ) =>
							setAttributes( {
								buttonAnimation: nextButtonAnimation,
							} )
						}
						options={ [
							{ value: 'none', label: __( 'None', 'getwid' ) },
							{ value: 'pulse', label: __( 'Pulse', 'getwid' ) },
						] }
					/>
					{ url && (
						<>
							{ imgObj && (
								<SelectControl
									label={ __( 'Image Size', 'getwid' ) }
									help={ __(
										'For images from Media Library only.',
										'getwid'
									) }
									value={ imageSize }
									onChange={ onChangeImageSize }
									options={ imageSizeOptions }
								/>
							) }
							<StyleLengthControl
								label={ __( 'Image Height', 'getwid' ) }
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
							<SelectControl
								label={ __( 'Image Animation', 'getwid' ) }
								value={ imageAnimation }
								onChange={ ( nextImageAnimation ) =>
									setAttributes( {
										imageAnimation: nextImageAnimation,
									} )
								}
								options={ [
									{
										value: 'none',
										label: __( 'None', 'getwid' ),
									},
									{
										value: 'slide-left',
										label: __( 'Slide Left', 'getwid' ),
									},
									{
										value: 'slide-right',
										label: __( 'Slide Right', 'getwid' ),
									},
									{
										value: 'slide-top',
										label: __( 'Slide Top', 'getwid' ),
									},
									{
										value: 'slide-bottom',
										label: __( 'Slide Bottom', 'getwid' ),
									},
									{
										value: 'zoom-in',
										label: __( 'Zoom In', 'getwid' ),
									},
									{
										value: 'zoom-out',
										label: __( 'Zoom Out', 'getwid' ),
									},
								] }
							/>
						</>
					) }
					<CustomColorPalette
						colorSettings={ [
							{
								title: __( 'Button Color', 'getwid' ),
								colors: {
									customColor: customTitleColor,
									defaultColor: buttonColor,
								},
								changeColor: ( value?: string ) => {
									setButtonColor( value );
									setAttributes( { buttonColorHEX: value } );
								},
							},
							{
								title: __( 'Icon Color', 'getwid' ),
								colors: {
									customColor: customIconColor,
									defaultColor: iconColor,
								},
								changeColor: setIconColor,
							},
							{
								title: __( 'Title Color', 'getwid' ),
								colors: {
									customColor: customTitleColor,
									defaultColor: titleColor,
								},
								changeColor: setTitleColor,
							},
							...( url
								? [
										{
											title: __(
												'Overlay Color',
												'getwid'
											),
											colors: {
												customColor: customOverlayColor,
												defaultColor: overlayColor,
											},
											changeColor: setOverlayColor,
										},
								  ]
								: [] ),
						] }
					/>
					{ url && (
						<RangeControl
							label={ __( 'Overlay Opacity', 'getwid' ) }
							value={ overlayOpacity }
							onChange={ ( nextOverlayOpacity ) =>
								setAttributes( {
									overlayOpacity: nextOverlayOpacity ?? 35,
								} )
							}
							min={ 0 }
							max={ 100 }
							step={ 5 }
						/>
					) }
				</PanelBody>
			) }
		</InspectorControls>
	);
}
