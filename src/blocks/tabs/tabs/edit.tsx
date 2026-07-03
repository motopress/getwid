import {
	BlockControls,
	RichText,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { cloneBlock, createBlock, type Block } from '@wordpress/blocks';
import { Button, TextControl, ToolbarGroup } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { TabsEditProps } from './types';

import './editor.scss';

const baseClass = 'wp-block-getwid-tabs';
const allowedBlocks = [ 'getwid/tabs-item' ];
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

function EmptyAppender() {
	return null;
}

type TabsEditorProps = TabsEditProps & {
	initialTabsCount: number;
	innerBlocks: Block[];
};

type ConstructorFormProps = {
	initialTabsCount: number;
	setInitialTabsCount: ( count: number ) => void;
	onCreate: () => void;
};

function ConstructorForm( {
	initialTabsCount,
	setInitialTabsCount,
	onCreate,
}: ConstructorFormProps ) {
	const blockProps = useBlockProps();

	return (
		<form
			{ ...blockProps }
			onSubmit={ ( event ) => {
				event.preventDefault();
				onCreate();
			} }
		>
			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				type="number"
				label={ __( 'Number of items', 'getwid' ) }
				min={ 1 }
				value={ String( initialTabsCount ) }
				onChange={ ( value ) =>
					setInitialTabsCount(
						Math.max( 1, Number.parseInt( value || '1', 10 ) || 1 )
					)
				}
			/>
			<Button variant="primary" type="submit">
				{ __( 'Create', 'getwid' ) }
			</Button>
		</form>
	);
}

function TabsEditor( props: TabsEditorProps ) {
	const { attributes, clientId, className, isSelected, innerBlocks } = props;
	const { align, active, type, headerTag } = attributes;
	const [ selectedTab, setSelectedTab ] = useState( () =>
		active !== undefined ? Number.parseInt( active, 10 ) : 0
	);
	const {
		insertBlock,
		moveBlockToPosition,
		removeBlocks,
		selectBlock,
		updateBlockAttributes,
	} = useDispatch( blockEditorStore );
	const Tag = headerTag;
	const blockProps = useBlockProps( {
		className: clsx(
			className,
			`${ baseClass }--current-tab-${ selectedTab + 1 }`,
			{
				[ `has-layout-${ type }` ]: type !== '',
			},
			align ? `align${ align }` : undefined
		),
		'data-active-tab': active ?? '0',
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: `${ baseClass }__tab-content` },
		{
			allowedBlocks,
			template: Array.from(
				{ length: props.initialTabsCount },
				( _item, index ) => [
					'getwid/tabs-item',
					{
						/* translators: %d is a counter 1, 2, 3. */
						title: sprintf(
							__( 'Element #%d', 'getwid' ),
							index + 1
						),
					},
				]
			),
			templateInsertUpdatesSelection: false,
			templateLock: false,
			renderAppender: EmptyAppender,
		}
	);

	useEffect( () => {
		innerBlocks.forEach( ( innerBlock ) => {
			const currentHeaderTag = (
				innerBlock.attributes.outerParent as
					| { attributes?: { headerTag?: string } }
					| undefined
			 )?.attributes?.headerTag;

			if ( currentHeaderTag !== headerTag ) {
				updateBlockAttributes( innerBlock.clientId, {
					outerParent: { attributes: { headerTag } },
				} );
			}
		} );
	}, [ headerTag, innerBlocks, updateBlockAttributes ] );

	useEffect( () => {
		if ( selectedTab >= innerBlocks.length && innerBlocks.length > 0 ) {
			setSelectedTab( innerBlocks.length - 1 );
		}
	}, [ innerBlocks.length, selectedTab ] );

	function addTab( index: number ) {
		const insertedBlock = createBlock( 'getwid/tabs-item', {
			/* translators: %d is a counter 1, 2, 3. */
			title: sprintf(
				__( 'Element #%d', 'getwid' ),
				innerBlocks.length + 1
			),
		} );

		insertBlock( insertedBlock, index, clientId );
		setSelectedTab( index );
		selectBlock( clientId );
	}

	function moveTabLeft() {
		const selectedBlock = innerBlocks[ selectedTab ];

		if ( ! selectedBlock || selectedTab === 0 ) {
			return;
		}

		moveBlockToPosition(
			selectedBlock.clientId,
			clientId,
			clientId,
			selectedTab - 1
		);
		setSelectedTab( selectedTab - 1 );
	}

	function moveTabRight() {
		const selectedBlock = innerBlocks[ selectedTab ];

		if ( ! selectedBlock || selectedTab === innerBlocks.length - 1 ) {
			return;
		}

		moveBlockToPosition(
			selectedBlock.clientId,
			clientId,
			clientId,
			selectedTab + 1
		);
		setSelectedTab( selectedTab + 1 );
	}

	function duplicateTab() {
		const selectedBlock = innerBlocks[ selectedTab ];

		if ( ! selectedBlock ) {
			return;
		}

		const duplicate = cloneBlock( selectedBlock, {
			title: `${ String( selectedBlock.attributes.title ?? '' ) } ${ __(
				'Copy',
				'getwid'
			) }`,
		} );
		insertBlock( duplicate, selectedTab + 1, clientId );
	}

	function deleteTab() {
		const selectedBlock = innerBlocks[ selectedTab ];

		if ( ! selectedBlock || innerBlocks.length === 1 ) {
			return;
		}

		removeBlocks( selectedBlock.clientId );
		setSelectedTab( 0 );
	}

	const controls = [
		{
			icon: 'table-col-before',
			title: __( 'Add Item Before', 'getwid' ),
			onClick: () => addTab( selectedTab === 0 ? 0 : selectedTab - 1 ),
		},
		{
			icon: 'table-col-after',
			title: __( 'Add Item After', 'getwid' ),
			onClick: () => addTab( selectedTab + 1 ),
		},
		{
			icon: 'arrow-left-alt2',
			title: __( 'Move Item Left', 'getwid' ),
			isDisabled: selectedTab === 0,
			onClick: moveTabLeft,
		},
		{
			icon: 'arrow-right-alt2',
			title: __( 'Move Item Right', 'getwid' ),
			isDisabled: selectedTab === innerBlocks.length - 1,
			onClick: moveTabRight,
		},
		{
			icon: 'admin-page',
			title: __( 'Duplicate Item', 'getwid' ),
			onClick: duplicateTab,
		},
		{
			icon: 'trash',
			title: __( 'Delete Item', 'getwid' ),
			isDisabled: innerBlocks.length === 1,
			onClick: deleteTab,
		},
	];

	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={ controls } />
			</BlockControls>
			<Inspector { ...props } innerBlocks={ innerBlocks } />
			<div { ...blockProps }>
				<ul className={ `${ baseClass }__nav-links` }>
					{ innerBlocks.map( ( item, index ) => (
						<li
							key={ item.clientId }
							className={ clsx( `${ baseClass }__nav-link`, {
								'active-tab': selectedTab === index,
							} ) }
							onClick={ () => setSelectedTab( index ) }
						>
							<Tag className={ `${ baseClass }__title-wrapper` }>
								{  }
								<a
									href="#"
									onClick={ ( event ) =>
										event.preventDefault()
									}
								>
									<div
										className={ `${ baseClass }__edit-area` }
									>
										<RichText
											tagName="span"
											className={ `${ baseClass }__title` }
											placeholder={ __(
												'Write heading…',
												'getwid'
											) }
											value={
												item.attributes.title as string
											}
											allowedFormats={ allowedFormats }
											onChange={ ( title ) =>
												updateBlockAttributes(
													item.clientId,
													{ title }
												)
											}
										/>
									</div>
								</a>
							</Tag>
						</li>
					) ) }
					{ isSelected && (
						<div className={ `${ baseClass }__add-tab` }>
							<Button
								icon="insert"
								label={ __( 'Add Tab', 'getwid' ) }
								onClick={ () => addTab( innerBlocks.length ) }
							/>
						</div>
					) }
				</ul>

				<div className={ `${ baseClass }__tab-content-wrapper` }>
					<div { ...innerBlocksProps } />
				</div>
			</div>
		</>
	);
}

export default function Edit( props: TabsEditProps ) {
	const { clientId } = props;
	const [ initTabs, setInitTabs ] = useState( false );
	const [ initialTabsCount, setInitialTabsCount ] = useState( 3 );
	const block = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);
	const innerBlocks = block?.innerBlocks ?? [];

	if ( innerBlocks.length === 0 && ! initTabs ) {
		return (
			<ConstructorForm
				initialTabsCount={ initialTabsCount }
				setInitialTabsCount={ setInitialTabsCount }
				onCreate={ () => setInitTabs( true ) }
			/>
		);
	}

	return (
		<TabsEditor
			{ ...props }
			initialTabsCount={ initialTabsCount }
			innerBlocks={ innerBlocks }
		/>
	);
}
