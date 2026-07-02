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
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	AnimationSelectControl,
	CustomColorPalette,
	IconPicker,
	StyleLengthControl,
} from 'getwid-components';

import type { IconEditProps } from './types';

const newTabRel = 'noreferrer noopener';

function Inspector( props: IconEditProps ) {
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
		rel,
		linkTarget,
		customBackgroundColor,
		customTextColor,
	} = attributes;
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

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
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
					selected={ iconStyle !== undefined ? iconStyle : 'default' }
					options={ [
						{ value: 'default', label: __( 'Icon', 'getwid' ) },
						{
							value: 'stacked',
							label: __( 'Background', 'getwid' ),
						},
						{ value: 'framed', label: __( 'Outline', 'getwid' ) },
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
						...( useSecondaryColor && iconStyle === 'stacked'
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
				{ iconStyle === 'framed' && (
					<TextControl
						type="number"
						label={ __( 'Border Width', 'getwid' ) }
						value={ borderWidth !== undefined ? borderWidth : '' }
						onChange={ ( nextBorderWidth ) => {
							const parsedBorderWidth = Number.parseInt(
								nextBorderWidth,
								10
							);
							setAttributes( {
								borderWidth: Number.isNaN( parsedBorderWidth )
									? undefined
									: parsedBorderWidth,
							} );
						} }
						min={ 0 }
						step={ 1 }
						placeholder="1"
					/>
				) }
				{ ( iconStyle === 'framed' || iconStyle === 'stacked' ) && (
					<RangeControl
						label={ __( 'Border Radius', 'getwid' ) }
						value={ borderRadius !== undefined ? borderRadius : 50 }
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
				<BaseControl
					className="getwid-editor-url-input"
					label={ __( 'Link', 'getwid' ) }
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
			<PanelBody title={ __( 'Margin', 'getwid' ) } initialOpen={ false }>
				<StyleLengthControl
					label={ __( 'Margin Top', 'getwid' ) }
					value={ marginTop }
					onChange={ ( nextMarginTop ) =>
						setAttributes( { marginTop: nextMarginTop } )
					}
					allowNegative
					allowAuto
				/>
				<StyleLengthControl
					label={ __( 'Margin Bottom', 'getwid' ) }
					value={ marginBottom }
					onChange={ ( nextMarginBottom ) =>
						setAttributes( { marginBottom: nextMarginBottom } )
					}
					allowNegative
					allowAuto
				/>
				<StyleLengthControl
					label={ __( 'Margin Left', 'getwid' ) }
					value={ marginLeft }
					onChange={ ( nextMarginLeft ) =>
						setAttributes( { marginLeft: nextMarginLeft } )
					}
					allowNegative
					allowAuto
				/>
				<StyleLengthControl
					label={ __( 'Margin Right', 'getwid' ) }
					value={ marginRight }
					onChange={ ( nextMarginRight ) =>
						setAttributes( { marginRight: nextMarginRight } )
					}
					allowNegative
					allowAuto
				/>
				<BaseControl>
					<Button
						variant="link"
						onClick={ () =>
							setAttributes( {
								marginTop: undefined,
								marginBottom: undefined,
								marginLeft: undefined,
								marginRight: undefined,
							} )
						}
						disabled={ ! hasMargin }
					>
						{ __( 'Reset', 'getwid' ) }
					</Button>
				</BaseControl>
			</PanelBody>
		</InspectorControls>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )(
	Inspector
);
