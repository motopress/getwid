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
import type { ServerSideRenderProps, TemplatePostLinkEditProps } from './types';

import './editor.scss';
import './style.scss';

const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

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

function Edit( props: TemplatePostLinkEditProps ) {
	const { attributes, setAttributes, textColor } = props;
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
	const getwidSettings = getGetwidSettings();
	const blockProps = useBlockProps( {
		style: {
			textAlign: textAlignment,
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
				</BlockControls>

				<div { ...blockProps }>
					<div>
						<RichText
							tagName="div"
							placeholder={ __( 'Read More', 'getwid' ) }
							value={ buttonText }
							onChange={ ( value ) =>
								setAttributes( { buttonText: value } )
							}
							className={ clsx( {
								'has-text-color': textColor.color,
								[ textColor.class || '' ]: textColor.class,
							} ) }
							style={ {
								color: textColor.color,
							} }
							allowedFormats={ allowedFormats }
						/>
					</div>
				</div>
			</>
		);
	}

	return (
		<Disabled>
			{ ServerSideRender && (
				<ServerSideRender
					block="getwid/template-post-link"
					attributes={ attributes }
				/>
			) }
		</Disabled>
	);
}

export default withColors( { textColor: 'color' } )( Edit );
