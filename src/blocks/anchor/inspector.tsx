import { InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	ExternalLink,
	PanelBody,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { AnchorEditProps } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
}: AnchorEditProps ) {
	const { anchor } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<TextControl
					label={ __( 'HTML Anchor', 'getwid' ) }
					value={ anchor }
					onChange={ ( nextAnchor ) =>
						setAttributes( { anchor: nextAnchor } )
					}
				/>
				<BaseControl>
					<ExternalLink href="https://wordpress.org/support/article/page-jumps/">
						{ __( 'Learn more about anchors', 'getwid' ) }
					</ExternalLink>
				</BaseControl>
			</PanelBody>
		</InspectorControls>
	);
}
