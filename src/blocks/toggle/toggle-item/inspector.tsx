import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Button, CheckboxControl, PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import type { ToggleItemEditProps } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
	clientId,
}: ToggleItemEditProps ) {
	const rootClientId = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlockRootClientId( clientId ),
		[ clientId ]
	);
	const currentBlock = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);
	const { selectBlock } = useDispatch( blockEditorStore );

	if ( ! currentBlock ) {
		return null;
	}

	return (
		<InspectorControls>
			<PanelBody>
				<Button
					variant="primary"
					onClick={ () =>
						rootClientId && selectBlock( rootClientId )
					}
				>
					{ __( 'Select Parent', 'getwid' ) }
				</Button>
			</PanelBody>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<CheckboxControl
					label={ __( 'Active by default', 'getwid' ) }
					checked={ !! attributes.active }
					onChange={ ( active ) => setAttributes( { active } ) }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
