import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import Inspector from './inspector';
import type { ButtonGroupEditProps } from './types';
import { getWrapperClasses } from './utils';

import './editor.scss';

const template = [
	[ 'core/button', { text: __( 'Button', 'getwid' ) } ],
	[ 'core/button', { text: __( 'Button', 'getwid' ) } ],
];

export default function Edit( props: ButtonGroupEditProps ) {
	const { attributes } = props;
	const blockProps = useBlockProps();

	return (
		<>
			<Inspector { ...props } />
			<div { ...blockProps }>
				<div className={ getWrapperClasses( attributes ) }>
					<InnerBlocks
						template={ template }
						allowedBlocks={ [ 'core/button' ] }
						templateInsertUpdatesSelection={ false }
					/>
				</div>
			</div>
		</>
	);
}
