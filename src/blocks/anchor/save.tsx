import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

import type { AnchorAttributes } from './types';

export default function Save( {
	attributes,
}: BlockSaveProps< AnchorAttributes > ) {
	const blockProps = useBlockProps.save( {
		id: attributes.anchor || undefined,
	} );

	return <div { ...blockProps } />;
}
