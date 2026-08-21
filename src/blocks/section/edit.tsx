import {
	BlockControls,
	getColorClassName,
	InnerBlocks,
	useBlockProps,
	PanelColorSettings,
	withColors,
} from '@wordpress/block-editor';
import {
	Button,
	Dashicon,
	Dropdown,
	FocalPointPicker,
	Placeholder,
	SelectControl,
	ToolbarButton,
	ToolbarDropdownMenu,
	ToolbarGroup,
	Tooltip,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import defaultAttributes from './attributes';
import { baseClass } from './constants';
import Dividers from './dividers';
import Inspector from './inspector';
import {
	BackgroundSlider,
	BackgroundVideo,
	BackgroundYouTubeVideo,
} from './media';
import {
	prepareBackgroundImageStyles,
	prepareGradientStyle,
} from './style-utils';
import type { SectionEditProps } from './types';

import './editor.scss';
import './style.scss';
import { MediaControl } from 'getwid-components';
import { useRef, useState } from '@wordpress/element';

const verticalAlignControls = [ 'flex-start', 'center', 'flex-end' ];
const horizontalAlignControls = [ 'flex-start', 'center', 'flex-end' ];
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
const imageAttachmentOptions = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	{ value: 'scroll', label: __( 'Scroll', 'getwid' ) },
	{ value: 'fixed', label: __( 'Fixed', 'getwid' ) },
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

const verticalAligns = {
	'flex-start': {
		title: __( 'Top', 'getwid' ),
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
			>
				<path fill="none" d="M0 0h24v24H0V0z" />
				<path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z" />
			</svg>
		),
	},
	center: {
		title: __( 'Middle', 'getwid' ),
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
			>
				<path fill="none" d="M0 0h24v24H0V0z" />
				<path d="M8 19h3v4h2v-4h3l-4-4-4 4zm8-14h-3V1h-2v4H8l4 4 4-4zM4 11v2h16v-2H4z" />
			</svg>
		),
	},
	'flex-end': {
		title: __( 'Bottom', 'getwid' ),
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
			>
				<path fill="none" d="M0 0h24v24H0V0z" />
				<path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z" />
			</svg>
		),
	},
};
const horizontalAligns = {
	'flex-start': {
		title: __( 'Left', 'getwid' ),
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="20"
				height="20"
				viewBox="0 0 20 20"
			>
				<path d="M2,15V5c0-0.55,0.45-1,1-1h0c0.55,0,1,0.45,1,1v10c0,0.55-0.45,1-1,1h0C2.45,16,2,15.55,2,15z" />
				<path d="M6,10l3,3v-2h8c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H9V7L6,10z" />
			</svg>
		),
	},
	center: {
		title: __( 'Center', 'getwid' ),
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="20"
				height="20"
				viewBox="0 0 20 20"
			>
				<path d="M9,15V5c0-0.55,0.45-1,1-1h0c0.55,0,1,0.45,1,1v10c0,0.55-0.45,1-1,1h0C9.45,16,9,15.55,9,15z" />
				<path d="M12,10l3,3v-2h2c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1h-2V7L12,10z" />
				<path d="M8,10l-3,3v-2H3c-0.55,0-1-0.45-1-1v0c0-0.55,0.45-1,1-1h2V7L8,10z" />
			</svg>
		),
	},
	'flex-end': {
		title: __( 'Right', 'getwid' ),
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="20"
				height="20"
				viewBox="0 0 20 20"
			>
				<path d="M16,15V5c0-0.55,0.45-1,1-1h0c0.55,0,1,0.45,1,1v10c0,0.55-0.45,1-1,1h0C16.45,16,16,15.55,16,15z" />
				<path d="M14,10l-3,3v-2H3c-0.55,0-1-0.45-1-1v0c0-0.55,0.45-1,1-1h8V7L14,10z" />
			</svg>
		),
	},
};

function pickMedia(
	media: SectionEditProps[ 'attributes' ][ 'backgroundImage' ]
) {
	return media
		? {
				alt: media.alt,
				id: media.id,
				url: media.url,
		  }
		: {};
}

function hasAttributeChanges( attributes: SectionEditProps[ 'attributes' ] ) {
	return Object.entries( defaultAttributes ).some(
		( [ key, definition ] ) => {
			if ( ! ( 'default' in definition ) ) {
				return false;
			}

			const attributeKey = key as keyof typeof attributes;
			return (
				JSON.stringify( attributes[ attributeKey ] ) !==
				JSON.stringify( definition.default )
			);
		}
	);
}

function Edit( props: SectionEditProps ) {
	const {
		attributes,
		setAttributes,
		className,
		clientId,
		isSelected,
		backgroundColor,
		setBackgroundColor,
	} = props;
	const {
		align,
		skipLayout,
		contentMaxWidth,
		contentMaxWidthPreset,
		minHeight,
		gapSize,
		backgroundImage,
		backgroundCustomImagePosition,
		backgroundImagePosition,
		backgroundImageAttachment,
		backgroundImageRepeat,
		backgroundImageSize,
		sliderImages,
		backgroundVideoType,
		youTubeVideoUrl,
		backgroundVideoUrl,
		backgroundVideoControlsPosition,
		foregroundOpacity,
		foregroundColor,
		foregroundFilter,
		dividersBringTop,
		customBackgroundColor,
		resetMinHeightTablet,
		resetMinHeightMobile,
		verticalAlign,
		verticalAlignTablet,
		verticalAlignMobile,
		horizontalAlign,
		horizontalAlignTablet,
		horizontalAlignMobile,
		paddingTopValue,
		paddingRightValue,
		paddingBottomValue,
		paddingLeftValue,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		paddingTopTablet,
		paddingRightTablet,
		paddingBottomTablet,
		paddingLeftTablet,
		paddingTopMobile,
		paddingRightMobile,
		paddingBottomMobile,
		paddingLeftMobile,
		marginTopValue,
		marginRightValue,
		marginBottomValue,
		marginLeftValue,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		marginTopTablet,
		marginRightTablet,
		marginBottomTablet,
		marginLeftTablet,
		marginTopMobile,
		marginRightMobile,
		marginBottomMobile,
		marginLeftMobile,
		entranceAnimation,
	} = attributes;
	const { hasInnerBlocks, hasParentBlocks } = useSelect(
		( select ) => {
			const blockEditor = select( 'core/block-editor' ) as {
				getSettings: () => {
					colors?: Array< {
						name: string;
						slug: string;
						color: string;
					} >;
				};
				getBlocks: ( rootClientId?: string ) => unknown[];
				getBlockRootClientId: (
					rootClientId?: string
				) => string | null;
			};
			const rootClientId = blockEditor.getBlockRootClientId( clientId );

			return {
				colors: blockEditor.getSettings().colors || [],
				hasInnerBlocks: blockEditor.getBlocks( clientId ).length > 0,
				hasParentBlocks: !! rootClientId,
			};
		},
		[ clientId ]
	);
	const shouldShowLayoutPicker =
		! hasInnerBlocks &&
		skipLayout === false &&
		! hasAttributeChanges( attributes ) &&
		! hasParentBlocks &&
		!! Getwid.settings.wide_support;
	const sectionStyle = {
		...( marginTop === 'custom' ? { marginTop: marginTopValue } : {} ),
		...( marginBottom === 'custom'
			? { marginBottom: marginBottomValue }
			: {} ),
	};
	const wrapperStyle = {
		minHeight,
		...( marginLeft === 'custom' ? { marginLeft: marginLeftValue } : {} ),
		...( marginRight === 'custom'
			? { marginRight: marginRightValue }
			: {} ),
		...( paddingTop === 'custom' ? { paddingTop: paddingTopValue } : {} ),
		...( paddingBottom === 'custom'
			? { paddingBottom: paddingBottomValue }
			: {} ),
		...( paddingLeft === 'custom'
			? { paddingLeft: paddingLeftValue }
			: {} ),
		...( paddingRight === 'custom'
			? { paddingRight: paddingRightValue }
			: {} ),
	};
	const blockProps = useBlockProps( {
		className: clsx( className, align ? `align${ align }` : null, {
			[ `has-inner-blocks-gap-${ gapSize }` ]:
				gapSize !== undefined && gapSize !== '',
			[ `getwid-margin-top-${ marginTop }` ]:
				marginTop !== 'custom' && marginTop !== '',
			[ `getwid-margin-bottom-${ marginBottom }` ]:
				marginBottom !== 'custom' && marginBottom !== '',
			[ `getwid-margin-tablet-top-${ marginTopTablet }` ]:
				marginTopTablet !== 'custom' && marginTopTablet !== '',
			[ `getwid-margin-tablet-bottom-${ marginBottomTablet }` ]:
				marginBottomTablet !== 'custom' && marginBottomTablet !== '',
			[ `getwid-margin-mobile-top-${ marginTopMobile }` ]:
				marginTopMobile !== 'custom' && marginTopMobile !== '',
			[ `getwid-margin-mobile-bottom-${ marginBottomMobile }` ]:
				marginBottomMobile !== 'custom' && marginBottomMobile !== '',
			'getwid-section-content-full-width':
				contentMaxWidthPreset === 'full',
			'getwid-section-content-custom-width':
				contentMaxWidthPreset === 'custom',
		} ),
		style: sectionStyle,
	} );
	const wrapperClassName = clsx( `${ baseClass }__wrapper`, {
		[ `${ entranceAnimation } animated` ]: !! entranceAnimation,
		[ `getwid-padding-top-${ paddingTop }` ]:
			paddingTop !== 'custom' && paddingTop !== '',
		[ `getwid-padding-bottom-${ paddingBottom }` ]:
			paddingBottom !== 'custom' && paddingBottom !== '',
		[ `getwid-padding-left-${ paddingLeft }` ]:
			paddingLeft !== 'custom' && paddingLeft !== '',
		[ `getwid-padding-right-${ paddingRight }` ]:
			paddingRight !== 'custom' && paddingRight !== '',
		[ `getwid-padding-tablet-top-${ paddingTopTablet }` ]:
			paddingTopTablet !== '',
		[ `getwid-padding-tablet-bottom-${ paddingBottomTablet }` ]:
			paddingBottomTablet !== '',
		[ `getwid-padding-tablet-left-${ paddingLeftTablet }` ]:
			paddingLeftTablet !== '',
		[ `getwid-padding-tablet-right-${ paddingRightTablet }` ]:
			paddingRightTablet !== '',
		[ `getwid-padding-mobile-top-${ paddingTopMobile }` ]:
			paddingTopMobile !== '',
		[ `getwid-padding-mobile-bottom-${ paddingBottomMobile }` ]:
			paddingBottomMobile !== '',
		[ `getwid-padding-mobile-left-${ paddingLeftMobile }` ]:
			paddingLeftMobile !== '',
		[ `getwid-padding-mobile-right-${ paddingRightMobile }` ]:
			paddingRightMobile !== '',
		[ `getwid-margin-left-${ marginLeft }` ]:
			marginLeft !== 'custom' && marginLeft !== '',
		[ `getwid-margin-right-${ marginRight }` ]:
			marginRight !== 'custom' && marginRight !== '',
		[ `getwid-margin-tablet-left-${ marginLeftTablet }` ]:
			marginLeftTablet !== '',
		[ `getwid-margin-tablet-right-${ marginRightTablet }` ]:
			marginRightTablet !== '',
		[ `getwid-margin-mobile-left-${ marginLeftMobile }` ]:
			marginLeftMobile !== '',
		[ `getwid-margin-mobile-right-${ marginRightMobile }` ]:
			marginRightMobile !== '',
		[ `getwid-align-items-${ verticalAlign }` ]: verticalAlign !== 'center',
		[ `getwid-align-items-tablet-${ verticalAlignTablet }` ]:
			verticalAlignTablet !== '',
		[ `getwid-align-items-mobile-${ verticalAlignMobile }` ]:
			verticalAlignMobile !== '',
		[ `getwid-justify-content-${ horizontalAlign }` ]:
			horizontalAlign !== 'center',
		[ `getwid-justify-content-tablet-${ horizontalAlignTablet }` ]:
			horizontalAlignTablet !== '',
		[ `getwid-justify-content-mobile-${ horizontalAlignMobile }` ]:
			horizontalAlignMobile !== '',
		'getwid-reset-min-height-tablet': resetMinHeightTablet !== false,
		'getwid-reset-min-height-mobile': resetMinHeightMobile !== false,
	} );
	const backgroundClassName = getColorClassName(
		'background-color',
		backgroundColor?.slug
	);
	const backgroundClass = clsx( `${ baseClass }__background`, {
		'has-background': backgroundColor || customBackgroundColor,
		[ backgroundClassName ?? '' ]: backgroundClassName,
	} );
	const backgroundStyle = {
		backgroundColor: backgroundColor ? undefined : customBackgroundColor,
		backgroundImage: prepareGradientStyle( 'background', attributes ),
		...prepareBackgroundImageStyles( 'background', attributes ),
	};
	const foregroundStyle = {
		opacity:
			foregroundOpacity !== undefined
				? foregroundOpacity / 100
				: undefined,
		backgroundColor: foregroundColor,
		backgroundImage: prepareGradientStyle( 'foreground', attributes ),
		...prepareBackgroundImageStyles( 'foreground', attributes ),
		mixBlendMode: foregroundFilter,
	};

	const backgroundVideoRef = useRef< HTMLVideoElement | null >( null );
	const [ videoState, setVideoState ] = useState< {
		play: boolean;
		mute: boolean;
	} >( { play: false, mute: false } );

	async function playBackgroundVideo() {
		const video = backgroundVideoRef.current;

		if ( ! video ) {
			return;
		}

		if ( video.paused ) {
			try {
				await video.play();

				setVideoState( ( state ) => ( {
					...state,
					play: true,
				} ) );
			} catch {}
		} else {
			video.pause();

			setVideoState( ( state ) => ( {
				...state,
				play: false,
			} ) );
		}
	}

	function muteBackgroundVideo() {
		const video = backgroundVideoRef.current;

		if ( ! video ) {
			return;
		}

		const muted = ! video.muted;

		video.muted = muted;

		setVideoState( ( state ) => ( {
			...state,
			mute: muted,
		} ) );
	}

	const templates = [
		{
			title: __(
				'Wide Screen. Section full width, content fixed.',
				'getwid'
			),
			icon: <Dashicon icon="editor-expand" />,
			layout: () => {
				setAttributes( {
					align: 'full',
					skipLayout: true,
				} );
			},
		},
		{
			title: __(
				'Full Width. Section and content full width.',
				'getwid'
			),
			icon: <Dashicon icon="fullscreen-alt" />,
			layout: () => {
				setAttributes( {
					align: 'full',
					contentMaxWidthPreset: 'full',
					skipLayout: true,
				} );
			},
		},
		{
			title: __(
				'Full Screen. Section full screen, content fixed.',
				'getwid'
			),
			icon: <Dashicon icon="fullscreen-exit-alt" />,
			layout: () => {
				setAttributes( {
					align: 'full',
					minHeight: '100vh',
					skipLayout: true,
				} );
			},
		},
	];

	if ( shouldShowLayoutPicker ) {
		return (
			<Placeholder
				className="block-editor-inner-blocks__template-picker has-many-options"
				label={
					<>
						<Dashicon icon="layout" />
						{ __( 'Choose Section Layout', 'getwid' ) }
					</>
				}
				instructions={ __(
					'Select a layout to start with, or make one yourself.',
					'getwid'
				) }
			>
				<ul className="block-editor-inner-blocks__template-picker-options">
					{ templates.map( ( item, index ) => (
						<li key={ index }>
							<Tooltip text={ item.title }>
								<Button
									className="components-icon-button block-editor-inner-blocks__template-picker-option is-button is-default is-large"
									onClick={ item.layout }
								>
									{ item.icon }
								</Button>
							</Tooltip>
						</li>
					) ) }
				</ul>
				<div className="block-editor-inner-blocks__template-picker-skip">
					<Button
						className="components-button is-link"
						onClick={ () => setAttributes( { skipLayout: true } ) }
					>
						{ __( 'Skip', 'getwid' ) }
					</Button>
				</div>
			</Placeholder>
		);
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={
							verticalAligns[
								( verticalAlign ||
									'center' ) as keyof typeof verticalAligns
							].icon
						}
						label={ __(
							'Content Area Vertical Alignment',
							'getwid'
						) }
						controls={ verticalAlignControls.map( ( control ) => ( {
							...verticalAligns[
								control as keyof typeof verticalAligns
							],
							isActive: verticalAlign === control,
							onClick: () =>
								setAttributes( { verticalAlign: control } ),
						} ) ) }
					/>
					<ToolbarDropdownMenu
						icon={
							horizontalAligns[
								( horizontalAlign ||
									'center' ) as keyof typeof horizontalAligns
							].icon
						}
						label={ __(
							'Content Area Horizontal Alignment',
							'getwid'
						) }
						controls={ horizontalAlignControls.map(
							( control ) => ( {
								...horizontalAligns[
									control as keyof typeof horizontalAligns
								],
								isActive: horizontalAlign === control,
								onClick: () =>
									setAttributes( {
										horizontalAlign: control,
									} ),
							} )
						) }
					/>
				</ToolbarGroup>
				<Dropdown
					className="components-dropdown-menu components-toolbar"
					renderToggle={ ( { onToggle } ) => (
						<ToolbarButton
							icon={
								<svg
									xmlns="http://www.w3.org/2000/svg"
									x="0px"
									y="0px"
									viewBox="0 0 20 20"
									width="20"
									height="20"
								>
									<path d="M3,16h14c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H3c-0.55,0-1-0.45-1-1v0C2,16.45,2.45,16,3,16z" />
									<path d="M9.05,13.95L13.3,9.7c0.39-0.39,0.39-1.02,0-1.41L9.05,4.05L8.34,3.34L7.63,2.63c-0.39-0.39-1.02-0.39-1.41,0L6.22,2.64	c-0.39,0.39-0.39,1.02,0,1.41l0.7,0.7L3.39,8.3C3,8.69,3,9.31,3.39,9.7l4.24,4.25C8.02,14.34,8.66,14.34,9.05,13.95z M9.04,6.87	L11.17,9H5.51l2.13-2.13C8.02,6.49,8.66,6.49,9.04,6.87z" />
									<path d="M13,13c0,0.55,0.45,1,1,1s1-0.45,1-1s-1-3-1-3S13,12.45,13,13z" />
								</svg>
							}
							onClick={ onToggle }
						/>
					) }
					renderContent={ ( { onClose } ) => (
						<>
							<div className="components-getwid-toolbar-popup-wrapper-close small-icon">
								<Button
									icon="no-alt"
									className="getwid-popover-close-button"
									onClick={ () => {
										onClose();
									} }
								/>
							</div>
							<PanelColorSettings
								title={ __( 'Colors', 'getwid' ) }
								initialOpen={ true }
								className="getwid-custom-pallete"
								colorSettings={ [
									{
										value: backgroundColor.color || '',
										onChange: setBackgroundColor,
										label: __(
											'Background Color',
											'getwid'
										),
									},
								] }
							/>
						</>
					) }
				/>
				<Dropdown
					className="components-dropdown-menu components-toolbar"
					renderToggle={ ( { onToggle } ) => (
						<ToolbarButton
							icon="format-image"
							onClick={ onToggle }
						/>
					) }
					renderContent={ ( { onClose } ) => (
						<>
							<div className="components-getwid-toolbar-popup-wrapper-close small-icon">
								<Button
									icon="no-alt"
									className="getwid-popover-close-button"
									onClick={ () => {
										onClose();
									} }
								/>
							</div>
							<MediaControl
								label={ __( 'Background Image', 'getwid' ) }
								url={ backgroundImage?.url }
								id={
									Number( backgroundImage?.id ) || undefined
								}
								onSelectMedia={ ( nextBackgroundImage ) => {
									setAttributes( {
										backgroundImage:
											pickMedia( nextBackgroundImage ),
									} );
									onClose();
								} }
								onRemoveMedia={ () =>
									setAttributes( {
										backgroundImage: undefined,
									} )
								}
							/>
							{ !! backgroundImage && (
								<>
									<SelectControl
										label={ __( 'Position', 'getwid' ) }
										value={ backgroundImagePosition || '' }
										onChange={ ( value ) =>
											setAttributes( {
												backgroundImagePosition: value,
											} )
										}
										options={ imagePositionOptions }
									/>
									{ backgroundImagePosition === 'custom' &&
										backgroundImage.url && (
											<FocalPointPicker
												url={ backgroundImage.url }
												value={
													backgroundCustomImagePosition
												}
												onChange={ ( value ) =>
													setAttributes( {
														backgroundCustomImagePosition:
															value,
													} )
												}
											/>
										) }
									<SelectControl
										label={ __( 'Attachment', 'getwid' ) }
										value={
											backgroundImageAttachment || ''
										}
										onChange={ ( value ) =>
											setAttributes( {
												backgroundImageAttachment:
													value,
											} )
										}
										options={ imageAttachmentOptions }
									/>
									<SelectControl
										label={ __( 'Repeat', 'getwid' ) }
										value={ backgroundImageRepeat || '' }
										onChange={ ( value ) =>
											setAttributes( {
												backgroundImageRepeat: value,
											} )
										}
										options={ imageRepeatOptions }
									/>
									<SelectControl
										label={ __( 'Size', 'getwid' ) }
										value={ backgroundImageSize || '' }
										onChange={ ( value ) =>
											setAttributes( {
												backgroundImageSize: value,
											} )
										}
										options={ imageSizeOptions }
									/>
								</>
							) }
						</>
					) }
				/>
			</BlockControls>
			<Inspector { ...props } />
			<div { ...blockProps }>
				<div className={ wrapperClassName } style={ wrapperStyle }>
					<Dividers
						attributes={ attributes }
						baseClass={ baseClass }
					/>
					{ ( !! backgroundVideoUrl || !! youTubeVideoUrl ) &&
						backgroundVideoControlsPosition !== 'none' && (
							<div
								className={ clsx(
									'getwid-background-video-controls',
									{
										[ `is-position-${ backgroundVideoControlsPosition }` ]:
											backgroundVideoControlsPosition !==
											'top-right',
									}
								) }
							>
								<button
									className="getwid-background-video-play"
									onClick={ playBackgroundVideo }
								>
									<i
										className={ clsx(
											'getwid-icon',
											videoState.play
												? 'getwid-icon-pause'
												: 'getwid-icon-play'
										) }
									/>
								</button>
								<button
									className="getwid-background-video-mute"
									onClick={ muteBackgroundVideo }
								>
									<i
										className={ clsx(
											'getwid-icon',
											videoState.mute
												? 'getwid-icon-mute'
												: 'getwid-icon-volume-up'
										) }
									/>
								</button>
							</div>
						) }
					<div
						className={ clsx( `${ baseClass }__inner-wrapper`, {
							'has-dividers-over': dividersBringTop,
						} ) }
						style={ {
							maxWidth:
								contentMaxWidth &&
								contentMaxWidthPreset === 'custom'
									? `${ contentMaxWidth }px`
									: undefined,
						} }
					>
						<div className={ `${ baseClass }__background-holder` }>
							<div
								className={ backgroundClass }
								style={ backgroundStyle }
							>
								{ !! backgroundImage && (
									<div
										className={ `${ baseClass }__background-image-wrapper` }
									>
										<img
											className={ `${ baseClass }__background-image` }
											src={ backgroundImage.url }
											alt={ backgroundImage.alt }
										/>
									</div>
								) }
								{ !! sliderImages?.length && (
									<div
										className={ `${ baseClass }__background-slider-wrapper` }
									>
										<BackgroundSlider
											attributes={ attributes }
											baseClass={ baseClass }
										/>
									</div>
								) }
								{ ( !! backgroundVideoUrl ||
									!! youTubeVideoUrl ) && (
									<div
										className={ `${ baseClass }__background-video-wrapper` }
									>
										{ youTubeVideoUrl &&
											backgroundVideoType ===
												'youtube' && (
												<BackgroundYouTubeVideo
													attributes={ attributes }
													baseClass={ baseClass }
												/>
											) }
										{ !! backgroundVideoUrl &&
											backgroundVideoType === 'self' && (
												<BackgroundVideo
													ref={ backgroundVideoRef }
													attributes={ attributes }
													baseClass={ baseClass }
													onEnded={ () => {
														const video =
															backgroundVideoRef.current;

														if ( ! video ) {
															return;
														}

														video.pause();

														setVideoState(
															( state ) => ( {
																...state,
																play: false,
															} )
														);
													} }
												/>
											) }
									</div>
								) }
							</div>
							<div
								className={ `${ baseClass }__foreground` }
								style={ foregroundStyle }
							/>
						</div>
						<div className={ `${ baseClass }__content` }>
							<div className={ `${ baseClass }__inner-content` }>
								<InnerBlocks
									template={ [] }
									renderAppender={ () =>
										isSelected && (
											<InnerBlocks.ButtonBlockAppender />
										)
									}
									templateInsertUpdatesSelection={ false }
									templateLock={ false }
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default withColors( 'backgroundColor' )( Edit );
