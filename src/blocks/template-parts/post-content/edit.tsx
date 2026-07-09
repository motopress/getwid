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
import type {
	TemplatePostContentAttributes,
	TemplatePostContentEditProps,
} from './types';

import './editor.scss';
import './style.scss';
import { ServerSideRender } from '@wordpress/server-side-render';

function getPreviewText(
	showContent: TemplatePostContentAttributes[ 'showContent' ]
) {
	if ( showContent === 'excerpt' ) {
		return __( 'Post Content (excerpt)', 'getwid' );
	}

	if ( showContent === 'content' ) {
		return __( 'Post Content (content)', 'getwid' );
	}

	if ( showContent === 'full' ) {
		return __( 'Post Content (full content)', 'getwid' );
	}

	return '';
}

function Edit( props: TemplatePostContentEditProps ) {
	const { attributes, setAttributes, textColor, fontSize } = props;
	const { className, textAlignment, showContent, customFontSize } =
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
				<div { ...blockProps }>{ getPreviewText( showContent ) }</div>
			</>
		);
	}

	return (
		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block="getwid/template-post-content"
					attributes={ attributes }
				/>
			</Disabled>
		</div>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )(
	withFontSizes( 'fontSize' )( Edit )
);
