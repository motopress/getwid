import { InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	CustomColorPalette,
	PaddingsControl,
	StyleLengthControl,
} from 'getwid-components';

import type { ContentTimelineEditProps } from './types';

type InspectorProps = ContentTimelineEditProps & {
	isLockedPaddings: boolean;
	onChangeLockedPaddings: ( isLocked: boolean ) => void;
};

export default function Inspector( props: InspectorProps ) {
	const {
		attributes,
		setAttributes,
		backgroundColor,
		fillColor,
		setBackgroundColor,
		setFillColor,
		isLockedPaddings,
		onChangeLockedPaddings,
	} = props;
	const {
		filling,
		animation,
		customBackgroundColor,
		customFillColor,
		horizontalSpace,
		marginBottom,
	} = attributes;
	const hasFilling = filling === 'true';

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
				<SelectControl
					label={ __( 'Block Animation', 'getwid' ) }
					value={ animation }
					onChange={ ( nextAnimation ) =>
						setAttributes( { animation: nextAnimation } )
					}
					options={ [
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{
							value: 'slideInSides',
							label: __( 'Slide In', 'getwid' ),
						},
						{
							value: 'slideInBottom',
							label: __( 'Slide In Up', 'getwid' ),
						},
						{ value: 'fadeIn', label: __( 'Fade In', 'getwid' ) },
					] }
				/>
				<ToggleControl
					label={ __( 'Display scroll progress', 'getwid' ) }
					checked={ hasFilling }
					onChange={ ( value ) =>
						setAttributes( { filling: value ? 'true' : 'false' } )
					}
				/>
				<CustomColorPalette
					colorSettings={ [
						{
							title: __( 'Background Color', 'getwid' ),
							colors: {
								customColor: customBackgroundColor,
								defaultColor: backgroundColor,
							},
							changeColor: setBackgroundColor,
						},
						...( hasFilling
							? [
									{
										title: __( 'Progress Color', 'getwid' ),
										colors: {
											customColor: customFillColor,
											defaultColor: fillColor,
										},
										changeColor: setFillColor,
									},
							  ]
							: [] ),
					] }
				/>
				<StyleLengthControl
					label={ __( 'Horizontal Space', 'getwid' ) }
					value={ horizontalSpace || '' }
					onChange={ ( nextHorizontalSpace ) =>
						setAttributes( {
							horizontalSpace: nextHorizontalSpace,
						} )
					}
				/>
				<BaseControl>
					<Button
						variant="link"
						onClick={ () =>
							setAttributes( { horizontalSpace: undefined } )
						}
						disabled={ ! horizontalSpace }
					>
						{ __( 'Reset', 'getwid' ) }
					</Button>
				</BaseControl>
				<StyleLengthControl
					label={ __( 'Vertical Space', 'getwid' ) }
					value={ marginBottom }
					onChange={ ( nextMarginBottom ) =>
						setAttributes( { marginBottom: nextMarginBottom } )
					}
				/>
				<BaseControl>
					<Button
						variant="link"
						onClick={ () =>
							setAttributes( { marginBottom: undefined } )
						}
						disabled={ ! marginBottom }
					>
						{ __( 'Reset', 'getwid' ) }
					</Button>
				</BaseControl>
			</PanelBody>
			<PanelBody title={ __( 'Padding', 'getwid' ) } initialOpen>
				<PaddingsControl
					attributes={ attributes }
					setAttributes={ setAttributes }
					isLocked={ isLockedPaddings }
					onChangeLock={ onChangeLockedPaddings }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
