import { createBlock, type BlockInstance } from '@wordpress/blocks';
import { select } from '@wordpress/data';

type CoreButtonAttributes = {
	text?: string;
	url?: string;
};

type BlockEditorSelect = {
	getSelectedBlockClientId: () => string;
	getBlock: ( clientId: string ) => BlockInstance;
};

export const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/button' ],
			transform: () => {
				const blockEditorSelect = select(
					'core/block-editor'
				) as BlockEditorSelect;
				const clientId = blockEditorSelect.getSelectedBlockClientId();
				const innerBlocks = clientId
					? blockEditorSelect.getBlock( clientId )?.innerBlocks || []
					: [];
				const innerAttributes: CoreButtonAttributes[] = [];

				innerBlocks.forEach( ( item ) => {
					const attributes = item.attributes as CoreButtonAttributes;

					if ( attributes.text !== '' ) {
						innerAttributes.push( {
							text: attributes.text,
							url: attributes.url,
						} );
					}
				} );

				return innerAttributes.map( ( { text, url } ) =>
					createBlock( 'core/button', {
						text,
						url,
					} )
				);
			},
		},
	],
};
