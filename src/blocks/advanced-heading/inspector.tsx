import { PanelBody, SelectControl } from '@wordpress/components';
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	FontSizeControl,
	FontsControl,
	MarginsControl,
	PaddingsControl,
	StyleLengthControl,
	TabsControl,
} from 'getwid-components';

import type {
	AdvancedHeadingEditProps,
	ChangeLockState,
	LockState,
} from './types';

type InspectorProps = AdvancedHeadingEditProps &
	LockState & {
		changeState: ChangeLockState;
	};

export default function Inspector( props: InspectorProps ) {
	const [ tabName, setTabName ] = useState< 'general' | 'style' >(
		'general'
	);

	return (
		<InspectorControls>
			<TabsControl
				state={ tabName }
				onChangeTab={ ( nextTabName ) =>
					setTabName( nextTabName as 'general' | 'style' )
				}
				tabs={ [ 'general', 'style' ] }
			/>
			{ tabName === 'general' && <GeneralSettings { ...props } /> }
			{ tabName === 'style' && <StyleSettings { ...props } /> }
		</InspectorControls>
	);
}

function GeneralSettings( props: InspectorProps ) {
	const { attributes, setAttributes } = props;
	const {
		fontFamily,
		fontWeight,
		fontStyle,
		textTransform,
		lineHeight,
		letterSpacing,
		titleTag,
	} = attributes;

	return (
		<>
			<PanelBody initialOpen>
				<FontsControl
					value={ fontFamily }
					onChangeFontGroupID={ ( fontGroupID ) =>
						setAttributes( { fontGroupID } )
					}
					onChangeFontFamily={ ( nextFontFamily ) =>
						setAttributes( {
							fontFamily: nextFontFamily,
							fontWeight: 'normal',
						} )
					}
					valueWeight={ fontWeight }
					onChangeFontWeight={ ( nextFontWeight ) =>
						setAttributes( { fontWeight: nextFontWeight } )
					}
				/>
				<FontSizeControl
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
				<SelectControl
					label={ __( 'Font Style', 'getwid' ) }
					value={ fontStyle }
					options={ [
						{ value: 'normal', label: __( 'Normal', 'getwid' ) },
						{ value: 'italic', label: __( 'Italic', 'getwid' ) },
						{ value: 'inherit', label: __( 'Inherit', 'getwid' ) },
					] }
					onChange={ ( nextFontStyle ) =>
						setAttributes( { fontStyle: nextFontStyle } )
					}
				/>
				<SelectControl
					label={ __( 'Text Transform', 'getwid' ) }
					value={ textTransform }
					options={ [
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{
							value: 'capitalize',
							label: __( 'Capitalize', 'getwid' ),
						},
						{
							value: 'lowercase',
							label: __( 'Lowercase', 'getwid' ),
						},
						{
							value: 'uppercase',
							label: __( 'Uppercase', 'getwid' ),
						},
						{ value: 'inherit', label: __( 'Inherit', 'getwid' ) },
					] }
					onChange={ ( nextTextTransform ) =>
						setAttributes( {
							textTransform: nextTextTransform,
						} )
					}
				/>
				<StyleLengthControl
					label={ __( 'Line Height', 'getwid' ) }
					value={ lineHeight }
					onChange={ ( nextLineHeight ) =>
						setAttributes( { lineHeight: nextLineHeight } )
					}
				/>
				<StyleLengthControl
					label={ __( 'Letter Spacing', 'getwid' ) }
					value={ letterSpacing }
					allowNegative
					units={ [
						{ label: 'px', value: 'px' },
						{ label: 'em', value: 'em' },
						{ label: 'pt', value: 'pt' },
						{ label: 'vh', value: 'vh' },
						{ label: 'vw', value: 'vw' },
					] }
					onChange={ ( nextLetterSpacing ) =>
						setAttributes( {
							letterSpacing: nextLetterSpacing,
						} )
					}
				/>
			</PanelBody>
			<PanelBody title={ __( 'Html Attributes', 'getwid' ) } initialOpen>
				<SelectControl
					label={ __( 'Title Tag', 'getwid' ) }
					value={ titleTag }
					options={ [
						{ value: 'span', label: __( 'Span', 'getwid' ) },
						{ value: 'p', label: __( 'Paragraph', 'getwid' ) },
						{ value: 'h1', label: __( 'Heading 1', 'getwid' ) },
						{ value: 'h2', label: __( 'Heading 2', 'getwid' ) },
						{ value: 'h3', label: __( 'Heading 3', 'getwid' ) },
						{ value: 'h4', label: __( 'Heading 4', 'getwid' ) },
						{ value: 'h5', label: __( 'Heading 5', 'getwid' ) },
						{ value: 'h6', label: __( 'Heading 6', 'getwid' ) },
					] }
					onChange={ ( nextTitleTag ) =>
						setAttributes( {
							titleTag: nextTitleTag as typeof titleTag,
						} )
					}
				/>
			</PanelBody>
		</>
	);
}

function StyleSettings( props: InspectorProps ) {
	const { backgroundColor, textColor, setBackgroundColor, setTextColor } =
		props;

	return (
		<>
			<PanelColorSettings
				title={ __( 'Colors', 'getwid' ) }
				initialOpen
				colorSettings={ [
					{
						value: textColor.color,
						onChange: setTextColor,
						label: __( 'Text Color', 'getwid' ),
					},
					{
						value: backgroundColor.color,
						onChange: setBackgroundColor,
						label: __( 'Background Color', 'getwid' ),
					},
				] }
			/>
			<PanelBody
				title={ __( 'Padding', 'getwid' ) }
				initialOpen={ false }
			>
				<PaddingsControl
					attributes={ props.attributes }
					setAttributes={ props.setAttributes }
					isLocked={ props.isLockedPaddings }
					onChangeLock={ ( isLocked ) =>
						props.changeState( 'isLockedPaddings', isLocked )
					}
				/>
			</PanelBody>
			<PanelBody title={ __( 'Margin', 'getwid' ) } initialOpen={ false }>
				<MarginsControl
					attributes={ props.attributes }
					setAttributes={ props.setAttributes }
					isLocked={ props.isLockedMargins }
					onChangeLock={ ( isLocked ) =>
						props.changeState( 'isLockedMargins', isLocked )
					}
				/>
			</PanelBody>
		</>
	);
}
