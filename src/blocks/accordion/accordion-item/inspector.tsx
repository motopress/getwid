import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

type Props = {
	clientId: string;
};

export default function Inspector( { clientId }: Props ) {
	const block = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);
	const rootClientId = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlockRootClientId( clientId ),
		[ clientId ]
	);
	const { selectBlock } = useDispatch( blockEditorStore );

	if ( ! block || ! rootClientId ) {
		return null;
	}

	return (
		<InspectorControls>
			<PanelBody>
				<Button
					variant="primary"
					onClick={ () => {
						selectBlock( rootClientId );
					} }
				>
					{ __( 'Select Parent', 'getwid' ) }
				</Button>
			</PanelBody>
		</InspectorControls>
	);
}
