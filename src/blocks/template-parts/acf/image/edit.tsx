import {
	BlockAlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { TemplateAcfImageEditProps } from './types';

import './editor.scss';
import './style.scss';

export default function Edit( props: TemplateAcfImageEditProps ) {
	const { attributes, setAttributes, className } = props;
	const { align } = attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, align ? `align${ align }` : undefined ),
	} );

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
						{ __( 'ACF Image', 'getwid' ) }
					</div>
				</div>
			</div>
		</>
	);
}
