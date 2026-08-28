import {
	InnerBlocks,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { Button, TextControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { ToggleEditProps } from './types';

import './editor.scss';

const baseClass = 'wp-block-getwid-toggle';
const allowedBlocks = [ 'getwid/toggle-item' ];

type MirroredToggleAttributes = {
	iconPosition?: string;
	iconOpen?: string;
	iconClose?: string;
	headerTag?: string;
};

function getToggleItemTitle( index: number ) {
	/* translators: %d is a counter 1, 2, 3. */
	return sprintf( __( 'Element #%d', 'getwid' ), index + 1 );
}

export default function Edit( props: ToggleEditProps ) {
	const { attributes, clientId, className, isSelected } = props;
	const [ initToggle, setInitToggle ] = useState( false );
	const [ initialToggleCount, setInitialToggleCount ] = useState( 3 );
	const block = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);
	const { insertBlock, updateBlockAttributes } =
		useDispatch( blockEditorStore );
	const innerBlocks = block?.innerBlocks ?? [];
	const { align, iconPosition, iconOpen, iconClose, headerTag } = attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, {
			'has-icon-left': iconPosition === 'left',
			[ `align${ align }` ]: align,
		} ),
	} );

	useEffect( () => {
		innerBlocks.forEach( ( innerBlock ) => {
			const parentAttributes = (
				innerBlock.attributes.outerParent as
					| { attributes?: MirroredToggleAttributes }
					| undefined
			 )?.attributes;

			if (
				parentAttributes?.iconPosition === iconPosition &&
				parentAttributes?.iconOpen === iconOpen &&
				parentAttributes?.iconClose === iconClose &&
				parentAttributes?.headerTag === headerTag
			) {
				return;
			}

			updateBlockAttributes( innerBlock.clientId, {
				outerParent: {
					attributes: {
						iconPosition,
						iconOpen,
						iconClose,
						headerTag,
					},
				},
			} );
		} );
	}, [
		headerTag,
		iconClose,
		iconOpen,
		iconPosition,
		innerBlocks,
		updateBlockAttributes,
	] );

	function addItem() {
		const insertedBlock = createBlock( 'getwid/toggle-item', {
			title: getToggleItemTitle( innerBlocks.length ),
		} );

		insertBlock( insertedBlock, innerBlocks.length, clientId );
	}

	if ( innerBlocks.length === 0 && ! initToggle ) {
		return (
			<form
				{ ...blockProps }
				onSubmit={ ( event ) => {
					event.preventDefault();
					setInitToggle( true );
				} }
			>
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					type="number"
					label={ __( 'Number of items', 'getwid' ) }
					min={ 1 }
					value={ String( initialToggleCount ) }
					onChange={ ( value ) =>
						setInitialToggleCount(
							Math.max(
								1,
								Number.parseInt( value || '1', 10 ) || 1
							)
						)
					}
				/>
				<Button variant="primary" type="submit">
					{ __( 'Create', 'getwid' ) }
				</Button>
			</form>
		);
	}

	return (
		<>
			<Inspector { ...props } />
			<div { ...blockProps }>
				<InnerBlocks
					allowedBlocks={ allowedBlocks }
					template={ Array.from(
						{ length: initialToggleCount },
						( _item, index ) => [
							'getwid/toggle-item',
							{ title: getToggleItemTitle( index ) },
						]
					) }
					templateInsertUpdatesSelection={ false }
					templateLock={ false }
					renderAppender={ () =>
						isSelected ? (
							<div className={ `${ baseClass }__add-toggle` }>
								<Button
									icon="insert"
									onClick={ addItem }
									label={ __( 'Add Toggle', 'getwid' ) }
								/>
							</div>
						) : null
					}
				/>
			</div>
		</>
	);
}
