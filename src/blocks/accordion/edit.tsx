import {
	InnerBlocks,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { type BlockEditProps } from '@wordpress/blocks';
import clsx from 'clsx';

import Inspector from './inspector';
import type { AccordionAttributes } from './types';

const ALLOWED_BLOCKS = [ 'getwid/accordion-item' ];

function getAccordionItemTitle( index: number ) {
	/* translators: %d is a counter 1, 2, 3. */
	return sprintf( __( 'Element #%d', 'getwid' ), index + 1 );
}

export default function Edit( props: BlockEditProps< AccordionAttributes > ) {
	const { attributes, clientId, className } = props;
	const [ initAccordions, setInitAccordions ] = useState( false );
	const [ initialAccCount, setInitialAccCount ] = useState( 3 );
	const block = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const innerBlocks = block?.innerBlocks;
	const { iconPosition, active, iconOpen, iconClose, headerTag } = attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, {
			[ `wp-block-getwid-accordion--current-item-${
				Number.parseInt( active ?? 'none', 10 ) + 1
			}` ]: active !== 'none',
			'has-icon-left': iconPosition === 'left',
		} ),
		'data-active-element': active ?? '0',
	} );

	useEffect( () => {
		innerBlocks?.forEach( ( innerBlock ) => {
			updateBlockAttributes( innerBlock.clientId, {
				outerParent: {
					attributes: {
						iconPosition,
						iconOpen,
						iconClose,
						active,
						headerTag,
					},
				},
			} );
		} );
	}, [
		active,
		headerTag,
		iconClose,
		iconOpen,
		iconPosition,
		updateBlockAttributes,
	] );

	if ( ! innerBlocks?.length && ! initAccordions ) {
		return (
			<form
				{ ...blockProps }
				onSubmit={ ( event ) => {
					event.preventDefault();
					setInitAccordions( true );
				} }
			>
				<TextControl
					type="number"
					label={ __( 'Number of items', 'getwid' ) }
					min={ 1 }
					onChange={ ( value ) =>
						setInitialAccCount(
							Number.parseInt( value || '1', 10 ) || 1
						)
					}
					value={ String( initialAccCount ) }
				/>
				<Button variant="primary" type="submit">
					{ __( 'Create', 'getwid' ) }
				</Button>
			</form>
		);
	}

	return (
		<div { ...blockProps }>
			<Inspector { ...props } />
			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				template={ Array.from(
					{ length: initialAccCount },
					( _item, index ) => [
						'getwid/accordion-item',
						{
							title: getAccordionItemTitle( index ),
						},
					]
				) }
				templateInsertUpdatesSelection={ false }
				templateLock={ false }
			/>
		</div>
	);
}
