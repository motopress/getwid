import {
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
	withColors,
	withFontSizes,
} from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { TemplateAcfSelectEditProps } from './types';

import './editor.scss';
import './style.scss';

function Edit( props: TemplateAcfSelectEditProps ) {
	const { attributes, setAttributes, textColor, fontSize } = props;
	const { className, textAlignment, bold, italic, customFontSize } =
		attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, fontSize?.class ),
		style: {
			color: textColor.color,
			textAlign: textAlignment,
			fontWeight: bold ? 'bold' : undefined,
			fontStyle: italic ? 'italic' : undefined,
			fontSize:
				fontSize?.size !== undefined
					? typeof fontSize.size === 'number'
						? `${ fontSize.size }px`
						: fontSize.size
					: customFontSize,
		},
	} );

	return (
		<>
			<Inspector { ...props } />
			<BlockControls>
				<AlignmentToolbar
					value={ textAlignment }
					onChange={ ( nextTextAlignment ) =>
						setAttributes( { textAlignment: nextTextAlignment } )
					}
				/>
				<ToolbarGroup
					controls={ [
						{
							icon: 'editor-bold',
							title: __( 'Bold', 'getwid' ),
							isActive: bold,
							onClick: () => setAttributes( { bold: ! bold } ),
						},
						{
							icon: 'editor-italic',
							title: __( 'Italic', 'getwid' ),
							isActive: italic,
							onClick: () =>
								setAttributes( { italic: ! italic } ),
						},
					] }
				/>
			</BlockControls>
			<div { ...blockProps }>{ __( 'ACF Select', 'getwid' ) }</div>
		</>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )(
	withFontSizes( 'fontSize' )( Edit )
);
