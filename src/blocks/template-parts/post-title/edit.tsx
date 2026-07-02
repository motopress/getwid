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
import type {
	ServerSideRenderProps,
	TemplatePostTitleEditProps,
} from './types';

import './editor.scss';
import './style.scss';

const ServerSideRender = (
	window as unknown as {
		wp?: {
			serverSideRender?: ( props: ServerSideRenderProps ) => JSX.Element;
		};
	}
 ).wp?.serverSideRender;

function getGetwidSettings() {
	return (
		window as unknown as {
			Getwid?: {
				templates?: { name?: string };
			};
		}
	 ).Getwid;
}

function Edit( props: TemplatePostTitleEditProps ) {
	const { attributes, setAttributes, textColor, fontSize } = props;
	const { textAlignment, headerTag, bold, italic, customFontSize } =
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
	const getwidSettings = getGetwidSettings();
	const Tag = headerTag;
	const blockProps = useBlockProps( {
		className: clsx( fontSize?.class ),
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

	if ( currentPostType === getwidSettings?.templates?.name ) {
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
								onClick: () => {
									setAttributes( { bold: ! bold } );
								},
							},
							{
								icon: 'editor-italic',
								title: __( 'Italic', 'getwid' ),
								isActive: italic,
								onClick: () => {
									setAttributes( { italic: ! italic } );
								},
							},
						] }
					/>
				</BlockControls>
				<Tag { ...blockProps }>{ __( 'Post Title', 'getwid' ) }</Tag>
			</>
		);
	}

	return (
		<Disabled>
			{ ServerSideRender && (
				<ServerSideRender
					block="getwid/template-post-title"
					attributes={ attributes }
				/>
			) }
		</Disabled>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )(
	withFontSizes( 'fontSize' )( Edit )
);
