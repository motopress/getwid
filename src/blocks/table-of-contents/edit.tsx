import {
	BlockControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import type { Block } from '@wordpress/blocks';
import { getBlockContent } from '@wordpress/blocks';
import {
	Button,
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import TableOfContentsList from './list';
import type { TableOfContentsEditProps, TableOfContentsHeading } from './types';
import { getHeadingTree } from './utils';

import './editor.scss';

const headingBlockNames = [ 'core/heading', 'getwid/advanced-heading' ];
const containerBlockNames = [ 'core/columns', 'core/column', 'getwid/section' ];

function findInnerHeadings( block: Block, headings: Block[] ) {
	if ( containerBlockNames.includes( block.name ) ) {
		block.innerBlocks.forEach( ( innerBlock ) =>
			findInnerHeadings( innerBlock, headings )
		);
	} else if ( headingBlockNames.includes( block.name ) ) {
		headings.push( block );
	}
}

function getHeadingLevel( block: Block ) {
	if ( block.name === 'core/heading' ) {
		return Number.parseInt( String( block.attributes.level ), 10 );
	}

	const titleTag = String( block.attributes.titleTag ?? '' );

	return /^h[1-6]$/.test( titleTag )
		? Number.parseInt( titleTag.replace( 'h', '' ), 10 )
		: null;
}

export default function Edit( props: TableOfContentsEditProps ) {
	const { attributes, setAttributes } = props;
	const { headings, align, allowedTags, listStyle } = attributes;
	const { getBlocks } = useSelect(
		( select ) => select( blockEditorStore ),
		[]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps( {
		className: clsx( `is-style-${ listStyle }`, {
			[ `align${ align }` ]: align !== 'none',
		} ),
	} );

	const checkHeadings = useCallback( () => {
		const headingBlocks: Block[] = [];
		const headingData: TableOfContentsHeading[] = [];

		getBlocks()
			.filter(
				( block ) =>
					headingBlockNames.includes( block.name ) ||
					[ 'core/columns', 'getwid/section' ].includes( block.name )
			)
			.forEach( ( block ) => {
				if ( containerBlockNames.includes( block.name ) ) {
					findInnerHeadings( block, headingBlocks );
				} else {
					headingBlocks.push( block );
				}
			} );

		headingBlocks.forEach( ( heading ) => {
			const level = getHeadingLevel( heading );

			if ( ! level ) {
				return;
			}

			let anchor = String( heading.attributes.anchor ?? '' );

			if ( ! anchor ) {
				const clientIdParts = heading.clientId.split( '-' );
				anchor = `g${ clientIdParts[ clientIdParts.length - 1 ] }`;
				updateBlockAttributes( heading.clientId, { anchor } );
			}

			headingData.push( {
				level: level - 1,
				content:
					getBlockContent( heading ).replace(
						/<(?:.|\n)*?>/gm,
						''
					) || '',
				anchor,
			} );
		} );

		setAttributes( { headings: headingData } );
	}, [ setAttributes, updateBlockAttributes ] );

	useEffect( () => {
		checkHeadings();
	}, [ checkHeadings ] );

	const visibleHeadings = headings.filter(
		( heading ) => allowedTags[ heading.level ]
	);

	return (
		<>
			{ headings.length > 0 && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon="update"
							label={ __( 'Update', 'getwid' ) }
							onClick={ checkHeadings }
						/>
					</ToolbarGroup>
				</BlockControls>
			) }

			<Inspector { ...props } />

			<div { ...blockProps }>
				{ visibleHeadings.length > 0 ? (
					<TableOfContentsList
						headings={ getHeadingTree( headings, allowedTags ) }
						listStyle={ listStyle }
					/>
				) : (
					<Placeholder
						icon="editor-contract"
						label={ __( 'Table of Contents', 'getwid' ) }
						instructions={ __(
							'Headings not found on this page.',
							'getwid'
						) }
					>
						<Button variant="secondary" onClick={ checkHeadings }>
							{ __( 'Update', 'getwid' ) }
						</Button>
					</Placeholder>
				) }
			</div>
		</>
	);
}
