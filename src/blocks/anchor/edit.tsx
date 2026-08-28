import { useBlockProps } from '@wordpress/block-editor';

import AnchorIcon from './icon';
import Inspector from './inspector';
import type { AnchorEditProps } from './types';

import './editor.scss';

export default function Edit( props: AnchorEditProps ) {
	const blockProps = useBlockProps();

	return (
		<>
			<Inspector { ...props } />
			<div { ...blockProps }>
				<span />
				<AnchorIcon size={ 16 } />
				<span />
			</div>
		</>
	);
}
