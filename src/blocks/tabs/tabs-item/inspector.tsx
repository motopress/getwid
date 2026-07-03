import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import type { TabsItemEditProps } from './types';

export default function Inspector( { clientId }: TabsItemEditProps ) {
	const rootClientId = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlockRootClientId( clientId ),
		[ clientId ]
	);
	const { selectBlock } = useDispatch( blockEditorStore );

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
		</InspectorControls>
	);
}
