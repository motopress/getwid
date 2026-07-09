import {
	AlignmentToolbar,
	BlockControls,
	RichText,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { TemplatePostButtonEditProps } from './types';

import './editor.scss';
import './style.scss';
import { ServerSideRender } from '@wordpress/server-side-render';

const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

function Edit( props: TemplatePostButtonEditProps ) {
	const { attributes, setAttributes, backgroundColor, textColor } = props;
	const { buttonText, textAlignment } = attributes;
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
		style: {
			textAlign: textAlignment,
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
					<div className="wp-block-button">
						<RichText
							tagName="div"
							placeholder={ __( 'Read More', 'getwid' ) }
							value={ buttonText }
							onChange={ ( value ) =>
								setAttributes( { buttonText: value } )
							}
							allowedFormats={ allowedFormats }
							className={ clsx( 'wp-block-button__link', {
								'has-background': backgroundColor.color,
								[ backgroundColor.class || '' ]:
									backgroundColor.class,
								'has-text-color': textColor.color,
								[ textColor.class || '' ]: textColor.class,
							} ) }
							style={ {
								backgroundColor: backgroundColor.color,
								color: textColor.color,
							} }
						/>
					</div>
				</div>
			</>
		);
	}

	return (
		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block="getwid/template-post-link"
					attributes={ attributes }
				/>
			</Disabled>
		</div>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
