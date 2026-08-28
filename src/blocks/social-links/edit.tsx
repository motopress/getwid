import {
	BlockControls,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	Popover,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { Fragment, useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { IconPicker } from 'getwid-components';
import clsx from 'clsx';

import Inspector from './inspector';
import type { SocialLinkItem, SocialLinksEditProps } from './types';
import {
	baseClass,
	getBlockClassName,
	getDefaultInsertedIcon,
	getListClassName,
	getWrapperClassName,
	getWrapperStyle,
	reorderIcons,
} from './utils';

import './editor.scss';
import './style.scss';

const newTabRel = 'noreferrer noopener';

function Edit( props: SocialLinksEditProps ) {
	const {
		attributes,
		setAttributes,
		className,
		isSelected,
		backgroundColor,
		textColor,
	} = props;
	const {
		icons,
		iconsStyle,
		iconsSize,
		customBackgroundColor,
		customTextColor,
	} = attributes;
	const [ selectedIcon, setSelectedIcon ] = useState< number | null >( null );
	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false );

	const blockProps = useBlockProps( {
		className: clsx( className, getBlockClassName( attributes ) ),
		style: {
			fontSize: iconsSize,
		},
	} );

	useEffect( () => {
		if ( ! isSelected ) {
			setSelectedIcon( null );
			setIsPopoverOpen( false );
		}
	}, [ isSelected ] );

	useEffect( () => {
		if ( ! isSelected || selectedIcon === null ) {
			return;
		}

		function onKeyDown( event: KeyboardEvent ) {
			if ( event.key === 'Delete' ) {
				event.preventDefault();
				onDeleteIcon();
			}
		}

		document.addEventListener( 'keydown', onKeyDown );

		return () => {
			document.removeEventListener( 'keydown', onKeyDown );
		};
	} );

	function updateIcon( index: number, value: Partial< SocialLinkItem > ) {
		setAttributes( {
			icons: icons.map( ( item, itemIndex ) =>
				itemIndex === index ? { ...item, ...value } : item
			),
		} );
	}

	function activateIcon( index: number ) {
		setSelectedIcon( index );
	}

	function onSelectIcon( index: number ) {
		setSelectedIcon( index );
		setIsPopoverOpen( true );
	}

	function onDeleteIcon() {
		if ( selectedIcon === null ) {
			return;
		}

		setAttributes( {
			icons: icons.filter( ( _, index ) => index !== selectedIcon ),
		} );
		setSelectedIcon( null );
		setIsPopoverOpen( false );
	}

	function insertIcon( index: number ) {
		setAttributes( {
			icons: [
				...icons.slice( 0, index ),
				getDefaultInsertedIcon(),
				...icons.slice( index ),
			],
		} );
	}

	function onDuplicateIcon() {
		if ( selectedIcon === null ) {
			return;
		}

		setAttributes( {
			icons: [
				...icons.slice( 0, selectedIcon ),
				icons[ selectedIcon ],
				...icons.slice( selectedIcon ),
			],
		} );
		activateIcon( selectedIcon + 1 );
	}

	function onMoveIcon( to: number ) {
		if ( selectedIcon === null ) {
			return;
		}

		setAttributes( {
			icons: reorderIcons( icons, selectedIcon, to ),
		} );
		activateIcon( to );
	}

	function onSetNewTab( index: number, value: boolean ) {
		const currentRel = icons[ index ]?.rel;
		const nextLinkTarget = value ? '_blank' : undefined;
		let nextRel = currentRel;

		if ( nextLinkTarget && ! currentRel ) {
			nextRel = newTabRel;
		} else if ( ! nextLinkTarget && currentRel === newTabRel ) {
			nextRel = undefined;
		}

		updateIcon( index, {
			linkTarget: nextLinkTarget,
			rel: nextRel,
		} );
	}

	const toolbarButtons = useMemo(
		() => [
			{
				icon: 'table-col-before',
				label: __( 'Add Item Before', 'getwid' ),
				disabled: selectedIcon === null,
				onClick: () => {
					if ( selectedIcon !== null ) {
						insertIcon( selectedIcon );
					}
				},
			},
			{
				icon: 'table-col-after',
				label: __( 'Add Item After', 'getwid' ),
				disabled: selectedIcon === null,
				onClick: () => {
					if ( selectedIcon !== null ) {
						insertIcon( selectedIcon + 1 );
					}
				},
			},
			{
				icon: 'arrow-left-alt2',
				label: __( 'Move Item Left', 'getwid' ),
				disabled: selectedIcon === null || selectedIcon === 0,
				onClick: () => {
					if ( selectedIcon !== null ) {
						onMoveIcon( selectedIcon - 1 );
					}
				},
			},
			{
				icon: 'arrow-right-alt2',
				label: __( 'Move Item Right', 'getwid' ),
				disabled:
					selectedIcon === null || selectedIcon === icons.length - 1,
				onClick: () => {
					if ( selectedIcon !== null ) {
						onMoveIcon( selectedIcon + 1 );
					}
				},
			},
			{
				icon: 'admin-page',
				label: __( 'Duplicate Item', 'getwid' ),
				disabled: selectedIcon === null,
				onClick: onDuplicateIcon,
			},
			{
				icon: 'trash',
				label: __( 'Delete Item', 'getwid' ),
				disabled: selectedIcon === null,
				onClick: onDeleteIcon,
			},
		],
		[ icons.length, selectedIcon ]
	);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					{ toolbarButtons.map( ( button ) => (
						<ToolbarButton
							key={ button.label }
							icon={ button.icon }
							label={ button.label }
							disabled={ button.disabled }
							onClick={ button.onClick }
						/>
					) ) }
				</ToolbarGroup>
			</BlockControls>

			<Inspector { ...props } />

			<div { ...blockProps }>
				<ul className={ getListClassName( attributes ) }>
					{ icons.map( ( item, index ) => (
						<li
							key={ index }
							className={ clsx( `${ baseClass }__item`, {
								'icon-selected': selectedIcon === index,
							} ) }
							onClick={ () => onSelectIcon( index ) }
						>
							{ selectedIcon === index && isPopoverOpen && (
								<Popover
									className={ `${ baseClass }__popover` }
									focusOnMount="container"
								>
									<div
										className={ `${ baseClass }__popover-close` }
									>
										<Button
											icon="no-alt"
											className="alignright"
											onClick={ ( event ) => {
												event.preventDefault();
												event.stopPropagation();
												setIsPopoverOpen( false );
											} }
										/>
									</div>
									<BaseControl
										label={ __( 'Icon', 'getwid' ) }
									>
										<IconPicker
											value={ item.icon }
											onChange={ ( nextIcon ) =>
												updateIcon( index, {
													icon: nextIcon,
												} )
											}
										/>
									</BaseControl>
									<TextControl
										label={ __( 'Link', 'getwid' ) }
										value={ item.link || '' }
										onChange={ ( nextLink ) =>
											updateIcon( index, {
												link: nextLink,
											} )
										}
									/>
									<ToggleControl
										label={ __(
											'Open in New Tab',
											'getwid'
										) }
										checked={ item.linkTarget === '_blank' }
										onChange={ ( value ) =>
											onSetNewTab( index, value )
										}
									/>
									<TextControl
										label={ __( 'Link Rel', 'getwid' ) }
										value={ item.rel || '' }
										onChange={ ( nextRel ) =>
											updateIcon( index, {
												rel: nextRel,
											} )
										}
									/>
								</Popover>
							) }
							<a
								className={ `${ baseClass }__link` }
								href={
									item.link && item.link !== ''
										? item.link
										: '#'
								}
								target={
									item.linkTarget === '_blank'
										? item.linkTarget
										: undefined
								}
								rel={ item.rel || undefined }
								onClick={ ( event ) => event.preventDefault() }
							>
								<span
									className={ getWrapperClassName(
										item,
										iconsStyle,
										backgroundColor,
										textColor,
										customBackgroundColor,
										customTextColor
									) }
									style={ getWrapperStyle(
										iconsStyle,
										backgroundColor,
										textColor,
										customBackgroundColor,
										customTextColor
									) }
								>
									<i className={ item.icon } />
								</span>
							</a>
						</li>
					) ) }

					{ isSelected && (
						<span
							className={ `${ baseClass }__link ${ baseClass }__add-icon` }
						>
							<Button
								icon="insert"
								onClick={ () => insertIcon( icons.length ) }
								label={ __( 'Add Icon', 'getwid' ) }
							/>
						</span>
					) }
				</ul>
			</div>
		</>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
