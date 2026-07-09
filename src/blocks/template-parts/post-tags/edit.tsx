import {
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
	withColors,
	withFontSizes,
} from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { TemplatePostTagsEditProps } from './types';

import './editor.scss';
import './style.scss';
import { ServerSideRender } from '@wordpress/server-side-render';

function Edit( props: TemplatePostTagsEditProps ) {
	const {
		attributes,
		setAttributes,
		backgroundColor,
		textColor,
		iconColor,
		fontSize,
	} = props;
	const { className, textAlignment, icon, blockDivider, customFontSize } =
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
		className: clsx( className, {
			'has-background': backgroundColor.color,
			[ backgroundColor.class || '' ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class || '' ]: textColor.class,
			[ fontSize.class || '' ]: fontSize.class,
		} ),
		style: {
			textAlign: textAlignment,
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
					{ __( 'Tags', 'getwid' ) }
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
		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block="getwid/template-post-tags"
					attributes={ attributes }
				/>
			</Disabled>
		</div>
	);
}

export default withColors(
	'backgroundColor',
	{ textColor: 'color' },
	'iconColor'
)( withFontSizes( 'fontSize' )( Edit ) );
