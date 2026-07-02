import { BaseControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import StyleLengthControl from '../style-length-control';
import './editor.scss';

type MarginsAttributes = {
	marginTop?: string;
	marginBottom?: string;
	marginLeft?: string;
	marginRight?: string;
};

type PaddingsAttributes = {
	paddingTop?: string;
	paddingBottom?: string;
	paddingLeft?: string;
	paddingRight?: string;
};

type MarginsControlProps = {
	attributes: MarginsAttributes;
	setAttributes: ( attributes: Partial< MarginsAttributes > ) => void;
	isLocked: boolean;
	onChangeLock: ( isLocked: boolean ) => void;
};

type PaddingsControlProps = {
	attributes: PaddingsAttributes;
	setAttributes: ( attributes: Partial< PaddingsAttributes > ) => void;
	isLocked: boolean;
	onChangeLock: ( isLocked: boolean ) => void;
};

export function MarginsControl( {
	attributes,
	setAttributes,
	isLocked,
	onChangeLock,
}: MarginsControlProps ) {
	const { marginTop, marginBottom, marginLeft, marginRight } = attributes;
	const hasMargin =
		marginBottom !== undefined ||
		marginRight !== undefined ||
		marginLeft !== undefined ||
		marginTop !== undefined;

	return (
		<>
			<div className="components-base-control components-base-control-with-lock">
				<StyleLengthControl
					label={ __( 'Margin Top', 'getwid' ) }
					value={ marginTop }
					onChange={ ( nextMarginTop ) => {
						if ( isLocked ) {
							setAttributes( {
								marginBottom: nextMarginTop,
								marginRight: nextMarginTop,
								marginLeft: nextMarginTop,
								marginTop: nextMarginTop,
							} );
						} else {
							setAttributes( { marginTop: nextMarginTop } );
						}
					} }
					allowNegative
				/>
				<Button
					icon={ isLocked ? 'lock' : 'unlock' }
					onClick={ () => {
						if ( ! isLocked ) {
							onChangeLock( true );
							setAttributes( {
								marginBottom: marginTop,
								marginRight: marginTop,
								marginLeft: marginTop,
							} );
						} else {
							onChangeLock( false );
						}
					} }
					label={
						isLocked
							? __( 'Unlock', 'getwid' )
							: __( 'Lock', 'getwid' )
					}
				/>
			</div>
			<StyleLengthControl
				label={ __( 'Margin Bottom', 'getwid' ) }
				isLocked={ isLocked }
				value={ marginBottom }
				onChange={ ( nextMarginBottom ) =>
					setAttributes( { marginBottom: nextMarginBottom } )
				}
				allowNegative
			/>
			<StyleLengthControl
				label={ __( 'Margin Left', 'getwid' ) }
				isLocked={ isLocked }
				value={ marginLeft }
				onChange={ ( nextMarginLeft ) =>
					setAttributes( { marginLeft: nextMarginLeft } )
				}
				allowNegative
			/>
			<StyleLengthControl
				label={ __( 'Margin Right', 'getwid' ) }
				isLocked={ isLocked }
				value={ marginRight }
				onChange={ ( nextMarginRight ) =>
					setAttributes( { marginRight: nextMarginRight } )
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
		</>
	);
}

export function PaddingsControl( {
	attributes,
	setAttributes,
	isLocked,
	onChangeLock,
}: PaddingsControlProps ) {
	const { paddingTop, paddingBottom, paddingLeft, paddingRight } = attributes;
	const hasPadding =
		paddingTop !== undefined ||
		paddingBottom !== undefined ||
		paddingRight !== undefined ||
		paddingLeft !== undefined;

	return (
		<>
			<div className="components-base-control components-base-control-with-lock">
				<StyleLengthControl
					label={ __( 'Padding Top', 'getwid' ) }
					value={ paddingTop }
					onChange={ ( nextPaddingTop ) => {
						if ( isLocked ) {
							setAttributes( {
								paddingBottom: nextPaddingTop,
								paddingRight: nextPaddingTop,
								paddingLeft: nextPaddingTop,
								paddingTop: nextPaddingTop,
							} );
						} else {
							setAttributes( { paddingTop: nextPaddingTop } );
						}
					} }
					allowNegative
				/>
				<Button
					icon={ isLocked ? 'lock' : 'unlock' }
					onClick={ () => {
						if ( ! isLocked ) {
							onChangeLock( true );
							setAttributes( {
								paddingBottom: paddingTop,
								paddingRight: paddingTop,
								paddingLeft: paddingTop,
							} );
						} else {
							onChangeLock( false );
						}
					} }
					label={
						isLocked
							? __( 'Unlock', 'getwid' )
							: __( 'Lock', 'getwid' )
					}
				/>
			</div>
			<StyleLengthControl
				label={ __( 'Padding Bottom', 'getwid' ) }
				isLocked={ isLocked }
				value={ paddingBottom }
				onChange={ ( nextPaddingBottom ) =>
					setAttributes( { paddingBottom: nextPaddingBottom } )
				}
			/>
			<StyleLengthControl
				label={ __( 'Padding Left', 'getwid' ) }
				isLocked={ isLocked }
				value={ paddingLeft }
				onChange={ ( nextPaddingLeft ) =>
					setAttributes( { paddingLeft: nextPaddingLeft } )
				}
			/>
			<StyleLengthControl
				label={ __( 'Padding Right', 'getwid' ) }
				isLocked={ isLocked }
				value={ paddingRight }
				onChange={ ( nextPaddingRight ) =>
					setAttributes( { paddingRight: nextPaddingRight } )
				}
			/>
			<BaseControl>
				<Button
					variant="link"
					isDestructive
					onClick={ () =>
						setAttributes( {
							paddingTop: undefined,
							paddingBottom: undefined,
							paddingLeft: undefined,
							paddingRight: undefined,
						} )
					}
					disabled={ ! hasPadding }
				>
					{ __( 'Reset', 'getwid' ) }
				</Button>
			</BaseControl>
		</>
	);
}
