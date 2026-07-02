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
import type { ServerSideRenderProps, TemplatePostDateEditProps } from './types';

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

function Edit( props: TemplatePostDateEditProps ) {
	const {
		attributes,
		setAttributes,
		backgroundColor,
		textColor,
		iconColor,
		fontSize,
	} = props;
	const {
		className,
		textAlignment,
		icon,
		bold,
		italic,
		blockDivider,
		customFontSize,
	} = attributes;
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
	const blockProps = useBlockProps( {
		className: clsx( className, {
			'has-background': backgroundColor.color,
			[ backgroundColor.class || '' ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class || '' ]: textColor.class,
			[ fontSize.class || '' ]: fontSize.class,
		} ),
		style: {
			textAlign: textAlignment,
			fontWeight: bold ? 'bold' : undefined,
			fontStyle: italic ? 'italic' : undefined,
			backgroundColor: backgroundColor.color,
			color: textColor.color,
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

				<div { ...blockProps }>
					{ icon && (
						<i
							style={ {
								color: iconColor.color || undefined,
							} }
							className={ clsx( icon, {
								'has-text-color': iconColor.color,
								[ iconColor.class || '' ]: iconColor.class,
							} ) }
						/>
					) }{ ' ' }
					{ __( 'Date', 'getwid' ) }
					{ blockDivider && (
						<span className="getwid-post-meta-divider">
							{ blockDivider }
						</span>
					) }
				</div>
			</>
		);
	}

	return (
		<Disabled>
			{ ServerSideRender && (
				<ServerSideRender
					block="getwid/template-post-date"
					attributes={ attributes }
				/>
			) }
		</Disabled>
	);
}

export default withColors(
	'backgroundColor',
	{ textColor: 'color' },
	'iconColor'
)( withFontSizes( 'fontSize' )( Edit ) );
