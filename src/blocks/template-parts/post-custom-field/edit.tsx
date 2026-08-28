import {
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
	withColors,
	withFontSizes,
} from '@wordpress/block-editor';
import { Disabled, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { TemplatePostCustomFieldEditProps } from './types';

import './editor.scss';
import './style.scss';
import { ServerSideRender } from '@wordpress/server-side-render';

function Edit( props: TemplatePostCustomFieldEditProps ) {
	const { attributes, setAttributes, textColor, fontSize } = props;
	const { className, textAlignment, bold, italic, customFontSize } =
		attributes;
	const currentPostType = useSelect(
		( select ) =>
			(
				select( 'core/editor' ) as {
					getCurrentPostType: () => string | undefined;
				}
			 ).getCurrentPostType(),
		[]
	);
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

	if ( currentPostType === Getwid.templates.name ) {
		return (
			<>
				<Inspector { ...props } />
				<BlockControls>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( nextTextAlignment ) =>
							setAttributes( {
								textAlignment: nextTextAlignment,
							} )
						}
					/>
					<ToolbarGroup
						controls={ [
							{
								icon: 'editor-bold',
								title: __( 'Bold', 'getwid' ),
								isActive: bold,
								onClick: () =>
									setAttributes( { bold: ! bold } ),
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

				<div { ...blockProps }>{ __( 'Custom Field', 'getwid' ) }</div>
			</>
		);
	}

	return (
		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block="getwid/template-post-custom-field"
					attributes={ attributes }
				/>
			</Disabled>
		</div>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )(
	withFontSizes( 'fontSize' )( Edit )
);
