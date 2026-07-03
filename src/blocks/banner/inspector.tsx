import {
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	URLInput,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	CustomColorPalette,
	ImageSizeSelect,
	StyleLengthControl,
	TabsControl,
} from 'getwid-components';

import { allowedMediaTypes, videoBackgroundType } from './constants';
import type { BannerEditProps } from './types';

type TabName = 'general' | 'style' | 'advanced';

type InspectorProps = BannerEditProps & {
	changeImageSize: (
		media: NonNullable< BannerEditProps[ 'imgObj' ] >,
		imageSize: string
	) => void;
	onSelectMedia: (
		media: NonNullable< BannerEditProps[ 'imgObj' ] >
	) => void;
};

const lengthUnits = [
	{ label: 'px', value: 'px' },
	{ label: 'vh', value: 'vh' },
	{ label: 'vw', value: 'vw' },
	{ label: '%', value: '%' },
];

export default function Inspector( props: InspectorProps ) {
	const [ tabName, setTabName ] = useState< TabName >( 'general' );
	const {
		attributes,
		setAttributes,
		setBackgroundColor,
		setTextColor,
		backgroundColor,
		textColor,
	} = props;
	const {
		link,
		backgroundOpacity,
		blockAnimation,
		textAnimation,
		rel,
		customBackgroundColor,
		customTextColor,
	} = attributes;

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
				<PanelBody>
					<RangeControl
						label={ __( 'Overlay Opacity', 'getwid' ) }
						value={ backgroundOpacity }
						onChange={ ( nextBackgroundOpacity ) =>
							setAttributes( {
								backgroundOpacity: nextBackgroundOpacity ?? 0,
							} )
						}
						min={ 0 }
						max={ 100 }
						step={ 5 }
					/>
					<CustomColorPalette
						colorSettings={ [
							{
								title: __( 'Overlay Color', 'getwid' ),
								colors: {
									customColor: customBackgroundColor,
									defaultColor: backgroundColor,
								},
								changeColor: setBackgroundColor,
							},
							{
								title: __( 'Text Color', 'getwid' ),
								colors: {
									customColor: customTextColor,
									defaultColor: textColor,
								},
								changeColor: setTextColor,
							},
						] }
					/>
				</PanelBody>
			) }

			{ tabName === 'advanced' && (
				<PanelBody title={ __( 'Animation', 'getwid' ) } initialOpen>
					<SelectControl
						label={ __( 'Block Animation', 'getwid' ) }
						value={ blockAnimation }
						onChange={ ( nextBlockAnimation ) =>
							setAttributes( {
								blockAnimation: nextBlockAnimation,
							} )
						}
						options={ [
							{ value: 'none', label: __( 'None', 'getwid' ) },
							{ value: 'style1', label: __( 'Aries', 'getwid' ) },
							{
								value: 'style2',
								label: __( 'Taurus', 'getwid' ),
							},
							{
								value: 'style3',
								label: __( 'Gemini', 'getwid' ),
							},
							{
								value: 'style4',
								label: __( 'Cancer', 'getwid' ),
							},
							{ value: 'style5', label: __( 'Leo', 'getwid' ) },
							{ value: 'style6', label: __( 'Virgo', 'getwid' ) },
						] }
					/>
					<SelectControl
						label={ __( 'Text Animation', 'getwid' ) }
						value={ textAnimation }
						onChange={ ( nextTextAnimation ) =>
							setAttributes( {
								textAnimation: nextTextAnimation,
							} )
						}
						options={ [
							{ value: 'none', label: __( 'None', 'getwid' ) },
							{
								value: 'opacity',
								label: __( 'Fade In', 'getwid' ),
							},
							{
								value: 'opacity-top',
								label: __( 'Fade In Up', 'getwid' ),
							},
							{
								value: 'opacity-bottom',
								label: __( 'Fade In Down', 'getwid' ),
							},
							{
								value: 'opacity-left',
								label: __( 'Fade In Left', 'getwid' ),
							},
							{
								value: 'opacity-right',
								label: __( 'Fade In Right', 'getwid' ),
							},
							{
								value: 'opacity-zoom-in',
								label: __( 'Zoom In', 'getwid' ),
							},
							{
								value: 'opacity-zoom-out',
								label: __( 'Zoom Out', 'getwid' ),
							},
						] }
					/>
					<BaseControl
						id="getwid-banner-link"
						className="getwid-editor-url-input"
						label={ __( 'Link', 'getwid' ) }
					>
						<URLInput
							value={ link }
							onChange={ ( nextLink ) =>
								setAttributes( { link: nextLink } )
							}
							__nextHasNoMarginBottom
						/>
					</BaseControl>
					<TextControl
						label={ __( 'Link Rel', 'getwid' ) }
						value={ rel || '' }
						onChange={ ( nextRel ) =>
							setAttributes( { rel: nextRel } )
						}
					/>
				</PanelBody>
			) }
		</InspectorControls>
	);
}

function GeneralSettings( props: InspectorProps ) {
	const {
		attributes,
		changeImageSize,
		imgObj,
		onSelectMedia,
		setAttributes,
	} = props;
	const {
		imageSize,
		id,
		url,
		type,
		minHeight,
		contentMaxWidth,
		verticalAlign,
		horizontalAlign,
	} = attributes;

	function onChangeImageSize( nextImageSize: string ) {
		if ( imgObj ) {
			setAttributes( { imageSize: nextImageSize } );
			changeImageSize( imgObj, nextImageSize );
		}
	}

	return (
		<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
			{ ! url && (
				<MediaPlaceholder
					icon="format-image"
					labels={ {
						title: __( 'Image', 'getwid' ),
						instructions: __(
							'Upload an image file, pick one from your media library, or add one with a URL.',
							'getwid'
						),
					} }
					onSelect={ onSelectMedia }
					accept="image/*"
					allowedTypes={ allowedMediaTypes }
				/>
			) }

			{ url && (
				<MediaUpload
					onSelect={ onSelectMedia }
					allowedTypes={ allowedMediaTypes }
					value={ id }
					render={ ( { open } ) => (
						<BaseControl>
							{ url && type !== videoBackgroundType && (
								<div
									onClick={ open }
									onKeyDown={ ( event ) => {
										if (
											event.key === 'Enter' ||
											event.key === ' '
										) {
											open();
										}
									} }
									className="getwid-background-image-wrapper"
									role="button"
									tabIndex={ 0 }
								>
									<img src={ url } alt="" />
								</div>
							) }

							{ url && type === videoBackgroundType && (
								<video controls>
									<source src={ url } type="video/mp4" />
									<span>
										{ __(
											'Your browser does not support the video tag.',
											'getwid'
										) }
									</span>
								</video>
							) }

							<Button variant="primary" onClick={ open }>
								{ type === 'image' &&
									( id
										? __( 'Replace Image', 'getwid' )
										: __( 'Select Image', 'getwid' ) ) }
								{ type === 'video' &&
									( id
										? __( 'Replace Video', 'getwid' )
										: __( 'Select Video', 'getwid' ) ) }
							</Button>
						</BaseControl>
					) }
				/>
			) }

			{ imgObj && type === 'image' && (
				<ImageSizeSelect
					label={ __( 'Image Size', 'getwid' ) }
					help={ __(
						'For images from Media Library only.',
						'getwid'
					) }
					value={ imageSize }
					onChange={ onChangeImageSize }
				/>
			) }

			<SelectControl
				label={ __( 'Text Horizontal Alignment', 'getwid' ) }
				value={ horizontalAlign || 'center' }
				onChange={ ( nextHorizontalAlign ) =>
					setAttributes( { horizontalAlign: nextHorizontalAlign } )
				}
				options={ [
					{ value: 'left', label: __( 'Left', 'getwid' ) },
					{ value: 'center', label: __( 'Center', 'getwid' ) },
					{ value: 'right', label: __( 'Right', 'getwid' ) },
				] }
			/>
			<SelectControl
				label={ __( 'Text Vertical Alignment', 'getwid' ) }
				value={ verticalAlign || 'center' }
				onChange={ ( nextVerticalAlign ) =>
					setAttributes( { verticalAlign: nextVerticalAlign } )
				}
				options={ [
					{ value: 'top', label: __( 'Top', 'getwid' ) },
					{ value: 'center', label: __( 'Middle', 'getwid' ) },
					{ value: 'bottom', label: __( 'Bottom', 'getwid' ) },
				] }
			/>
			<StyleLengthControl
				label={ __( 'Block Height', 'getwid' ) }
				value={ minHeight }
				units={ lengthUnits }
				onChange={ ( nextMinHeight ) =>
					setAttributes( { minHeight: nextMinHeight } )
				}
			/>
			<StyleLengthControl
				label={ __( 'Text Width', 'getwid' ) }
				value={ contentMaxWidth }
				units={ lengthUnits }
				onChange={ ( nextContentMaxWidth ) =>
					setAttributes( { contentMaxWidth: nextContentMaxWidth } )
				}
			/>
		</PanelBody>
	);
}
