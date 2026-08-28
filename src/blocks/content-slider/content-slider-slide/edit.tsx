import {
	BlockControls,
	InnerBlocks,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import type { BlockEditProps } from '@wordpress/blocks';
import type { ContentSliderSlideAttributes } from '../content-slider/types';

type BlockEditorSelect = {
	getBlockIndex: ( clientId: string, rootClientId?: string ) => number;
	getBlockOrder: ( rootClientId?: string ) => string[];
	getBlockRootClientId: ( clientId: string ) => string | null;
};

function SlidePlaceholder( { rootClientId }: { rootClientId: string } ) {
	return (
		<Placeholder
			label={ __( 'Slide', 'getwid' ) }
			instructions={ __( 'Add any block to slide', 'getwid' ) }
			isColumnLayout
		>
			<InnerBlocks.ButtonBlockAppender rootClientId={ rootClientId } />
		</Placeholder>
	);
}

export default function Edit(
	props: BlockEditProps< ContentSliderSlideAttributes >
) {
	const { clientId, isSelected } = props;
	const blockProps = useBlockProps();
	const { insertBlock } = useDispatch( blockEditorStore );
	const { rootClientId, blockIndex, innerBlockOrder } = useSelect(
		( select ) => {
			const store = select( blockEditorStore ) as BlockEditorSelect;
			const rootId = store.getBlockRootClientId( clientId );

			return {
				rootClientId: rootId,
				blockIndex: store.getBlockIndex(
					clientId,
					rootId || undefined
				),
				innerBlockOrder: store.getBlockOrder( clientId ),
			};
		},
		[ clientId ]
	);
	const hasContent = innerBlockOrder.length > 0;

	function addSlide( position: 'before' | 'after' = 'after' ) {
		if ( ! rootClientId ) {
			return;
		}

		const insertedBlock = createBlock( 'getwid/content-slider-slide' );
		const index = blockIndex + ( position === 'before' ? 0 : 1 );

		insertBlock( insertedBlock, index, rootClientId );
	}

	return (
		<div { ...blockProps }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						label={ __( 'Add Slide Before', 'getwid' ) }
						onClick={ () => addSlide( 'before' ) }
					>
						{ __( 'Add Slide Before', 'getwid' ) }
					</ToolbarButton>
					<ToolbarButton
						label={ __( 'Add Slide After', 'getwid' ) }
						onClick={ () => addSlide() }
					>
						{ __( 'Add Slide After', 'getwid' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			<div className="wp-block-getwid-content-slider-slide__wrapper">
				<InnerBlocks
					renderAppender={ () => {
						if ( isSelected && hasContent ) {
							return <InnerBlocks.ButtonBlockAppender />;
						}

						if ( ! hasContent ) {
							return (
								<SlidePlaceholder rootClientId={ clientId } />
							);
						}

						return null;
					} }
				/>
			</div>
		</div>
	);
}
