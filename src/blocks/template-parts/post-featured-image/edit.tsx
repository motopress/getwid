import {
	BlockAlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { Dashicon, Disabled } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { TemplatePostFeaturedImageEditProps } from './types';

import './editor.scss';
import './style.scss';
import { ServerSideRender } from '@wordpress/server-side-render';

export default function Edit( props: TemplatePostFeaturedImageEditProps ) {
	const { attributes, setAttributes, className } = props;
	const { align } = attributes;
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
		className: clsx( className, align ? `align${ align }` : undefined ),
	} );

	if ( currentPostType === Getwid.templates.name ) {
		return (
			<>
				<Inspector { ...props } />
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						controls={ [ 'left', 'center', 'right' ] }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
				</BlockControls>
				<div { ...blockProps }>
					<div className="components-placeholder editor-media-placeholder">
						<div className="components-placeholder__label">
							<Dashicon icon="format-image" />
						</div>
						<div className="components-placeholder__instructions">
							{ __( 'Featured Image', 'getwid' ) }
						</div>
					</div>
				</div>
			</>
		);
	}

	return (
		<div { ...blockProps }>
			<Disabled>
				<ServerSideRender
					block="getwid/template-post-featured-image"
					attributes={ attributes }
				/>
			</Disabled>
		</div>
	);
}
