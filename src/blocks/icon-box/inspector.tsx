import {
	InspectorControls,
	URLInput,
	withColors,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	RadioControl,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	AnimationSelectControl,
	CustomColorPalette,
	IconPicker,
	StyleLengthControl,
	TabsControl,
} from 'getwid-components';

import type { IconBoxEditProps } from './types';

type TabName = 'general' | 'style' | 'advanced';

const newTabRel = 'noreferrer noopener';

function Inspector( props: IconBoxEditProps ) {
	const {
		attributes,
		setAttributes,
		setBackgroundColor,
		setTextColor,
		backgroundColor,
		textColor,
	} = props;
	const {
		icon,
		layout,
		textAlignment,
		iconPosition,
		iconStyle,
		iconSize,
		padding,
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
		borderWidth,
		borderRadius,
		link,
		hoverAnimation,
		linkTarget,
		rel,
		customBackgroundColor,
		customTextColor,
	} = attributes;
	const [ tabName, setTabName ] = useState< TabName >( 'general' );
	const [ isLockedMargins, setIsLockedMargins ] = useState( false );
	const useSecondaryColor = iconStyle === 'stacked' || iconStyle === 'framed';
	const hasMargin =
		marginTop !== undefined ||
		marginBottom !== undefined ||
		marginRight !== undefined ||
		marginLeft !== undefined;

	function onSetNewTab( value: boolean ) {
		const nextLinkTarget = value ? '_blank' : undefined;
		let nextRel = rel;

		if ( nextLinkTarget && ! rel ) {
			nextRel = newTabRel;
		} else if ( ! nextLinkTarget && rel === newTabRel ) {
			nextRel = undefined;
		}

		setAttributes( {
			linkTarget: nextLinkTarget,
			rel: nextRel,
		} );
	}

	function setLockedMargins( nextMarginTop?: string ) {
		setAttributes( {
			marginBottom: nextMarginTop,
			marginRight: nextMarginTop,
			marginLeft: nextMarginTop,
			marginTop: nextMarginTop,
		} );
	}

	return (
		<InspectorControls>
			<TabsControl
				state={ tabName }
				onChangeTab={ ( nextTabName ) =>
					setTabName( nextTabName as TabName )
				}
				tabs={ [ 'general', 'style', 'advanced' ] }
			/>

			{ tabName === 'general' && (
				<PanelBody>
					<BaseControl label={ __( 'Icon', 'getwid' ) }>
						<IconPicker
							value={ icon }
							onChange={ ( nextIcon ) =>
								setAttributes( { icon: nextIcon } )
							}
						/>
					</BaseControl>
					<RadioControl
						label={ __( 'Layout', 'getwid' ) }
						selected={ layout || '' }
						options={ [
							{
								value: '',
								label: __( 'Default', 'getwid' ),
							},
							{
								value: 'left',
								label: __( 'Align Icon Left', 'getwid' ),
							},
							{
								value: 'right',
								label: __( 'Align Icon Right', 'getwid' ),
							},
						] }
						onChange={ ( nextLayout ) =>
							setAttributes( { layout: nextLayout } )
						}
					/>
					{ ( layout === 'left' || layout === 'right' ) && (
						<SelectControl
							label={ __( 'Icon Vertical Alignment', 'getwid' ) }
							value={ iconPosition }
							options={ [
								{ value: 'top', label: __( 'Top', 'getwid' ) },
								{
									value: 'middle',
									label: __( 'Middle', 'getwid' ),
								},
								{
									value: 'bottom',
									label: __( 'Bottom', 'getwid' ),
								},
							] }
							onChange={ ( nextIconPosition ) =>
								setAttributes( {
									iconPosition: nextIconPosition,
								} )
							}
						/>
					) }
					<SelectControl
						label={ __( 'Content Alignment', 'getwid' ) }
						value={ textAlignment }
						options={ [
							{ value: 'left', label: __( 'Left', 'getwid' ) },
							{
								value: 'center',
								label: __( 'Center', 'getwid' ),
							},
							{ value: 'right', label: __( 'Right', 'getwid' ) },
						] }
						onChange={ ( nextTextAlignment ) =>
							setAttributes( {
								textAlignment: nextTextAlignment,
							} )
						}
					/>
					<BaseControl
						label={ __( 'Icon Link', 'getwid' ) }
						className="getwid-editor-url-input"
					>
						<URLInput
							autoFocus={ false }
							value={ link }
							onChange={ ( nextLink ) =>
								setAttributes( { link: nextLink } )
							}
							__nextHasNoMarginBottom
						/>
					</BaseControl>
					<BaseControl>
						<ToggleControl
							label={ __( 'Open in New Tab', 'getwid' ) }
							checked={ linkTarget === '_blank' }
							onChange={ onSetNewTab }
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

			{ tabName === 'style' && (
				<>
					<PanelBody>
						<RadioControl
							label={ __( 'Icon Style', 'getwid' ) }
							selected={
								iconStyle !== undefined ? iconStyle : 'default'
							}
							options={ [
								{
									value: 'default',
									label: __( 'Icon', 'getwid' ),
								},
								{
									value: 'stacked',
									label: __( 'Background', 'getwid' ),
								},
								{
									value: 'framed',
									label: __( 'Outline', 'getwid' ),
								},
							] }
							onChange={ ( nextIconStyle ) =>
								setAttributes( { iconStyle: nextIconStyle } )
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
								...( useSecondaryColor &&
								iconStyle === 'stacked'
									? [
											{
												title: __(
													'Icon Background Color',
													'getwid'
												),
												colors: {
													customColor:
														customBackgroundColor,
													defaultColor:
														backgroundColor,
												},
												changeColor: setBackgroundColor,
											},
									  ]
									: [] ),
							] }
						/>
						{ iconStyle === 'framed' && (
							<TextControl
								type="number"
								label={ __( 'Border Size', 'getwid' ) }
								value={
									borderWidth !== undefined ? borderWidth : ''
								}
								onChange={ ( nextBorderWidth ) => {
									const parsedBorderWidth = Number.parseInt(
										nextBorderWidth,
										10
									);
									setAttributes( {
										borderWidth: Number.isNaN(
											parsedBorderWidth
										)
											? undefined
											: parsedBorderWidth,
									} );
								} }
								min={ 0 }
								step={ 1 }
								placeholder="1"
							/>
						) }
						{ ( iconStyle === 'framed' ||
							iconStyle === 'stacked' ) && (
							<RangeControl
								label={ __( 'Border Radius', 'getwid' ) }
								value={
									borderRadius !== undefined
										? borderRadius
										: 50
								}
								onChange={ ( nextBorderRadius ) =>
									setAttributes( {
										borderRadius: nextBorderRadius ?? 50,
									} )
								}
								min={ 0 }
								step={ 1 }
								max={ 100 }
							/>
						) }
						<StyleLengthControl
							label={ __( 'Icon Size', 'getwid' ) }
							value={ iconSize }
							onChange={ ( nextIconSize ) =>
								setAttributes( { iconSize: nextIconSize } )
							}
						/>
						<TextControl
							type="number"
							label={ __( 'Space Around Icon', 'getwid' ) }
							value={ padding !== undefined ? padding : '' }
							onChange={ ( nextPadding ) => {
								const parsedPadding = Number.parseInt(
									nextPadding,
									10
								);
								setAttributes( {
									padding: Number.isNaN( parsedPadding )
										? undefined
										: parsedPadding,
								} );
							} }
							min={ 0 }
							step={ 1 }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Margin', 'getwid' ) }
						initialOpen={ false }
					>
						<div className="components-base-control components-base-control-with-lock">
							<StyleLengthControl
								label={ __( 'Margin Top', 'getwid' ) }
								value={ marginTop }
								onChange={ ( nextMarginTop ) =>
									isLockedMargins
										? setLockedMargins( nextMarginTop )
										: setAttributes( {
												marginTop: nextMarginTop,
										  } )
								}
								allowNegative
							/>
							<Button
								icon={ isLockedMargins ? 'lock' : 'unlock' }
								onClick={ () => {
									if ( ! isLockedMargins ) {
										setIsLockedMargins( true );
										setAttributes( {
											marginBottom: marginTop,
											marginRight: marginTop,
											marginLeft: marginTop,
										} );
									} else {
										setIsLockedMargins( false );
									}
								} }
								label={
									isLockedMargins
										? __( 'Unlock', 'getwid' )
										: __( 'Lock', 'getwid' )
								}
							/>
						</div>
						<StyleLengthControl
							label={ __( 'Margin Bottom', 'getwid' ) }
							isLocked={ isLockedMargins }
							value={ marginBottom }
							onChange={ ( nextMarginBottom ) =>
								setAttributes( {
									marginBottom: nextMarginBottom,
								} )
							}
							allowNegative
						/>
						<StyleLengthControl
							label={ __( 'Margin Left', 'getwid' ) }
							isLocked={ isLockedMargins }
							value={ marginLeft }
							onChange={ ( nextMarginLeft ) =>
								setAttributes( {
									marginLeft: nextMarginLeft,
								} )
							}
							allowNegative
						/>
						<StyleLengthControl
							label={ __( 'Margin Right', 'getwid' ) }
							isLocked={ isLockedMargins }
							value={ marginRight }
							onChange={ ( nextMarginRight ) =>
								setAttributes( {
									marginRight: nextMarginRight,
								} )
							}
							allowNegative
						/>
						<BaseControl>
							<Button
								variant="link"
								isDestructive
								onClick={ () =>
									setAttributes( {
										marginBottom: undefined,
										marginRight: undefined,
										marginLeft: undefined,
										marginTop: undefined,
									} )
								}
								disabled={ ! hasMargin }
							>
								{ __( 'Reset', 'getwid' ) }
							</Button>
						</BaseControl>
					</PanelBody>
				</>
			) }

			{ tabName === 'advanced' && (
				<PanelBody>
					<AnimationSelectControl
						label={ __( 'Icon Hover Animation', 'getwid' ) }
						value={ hoverAnimation || '' }
						onChange={ ( nextHoverAnimation ) =>
							setAttributes( {
								hoverAnimation: nextHoverAnimation,
							} )
						}
						allowAnimation={ [ 'Seeker', 'Icon' ] }
					/>
				</PanelBody>
			) }
		</InspectorControls>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )(
	Inspector
);
