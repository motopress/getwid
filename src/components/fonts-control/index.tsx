import {
	BaseControl,
	Button,
	Dropdown,
	Flex,
	MenuGroup,
	MenuItem,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import clsx from 'clsx';

import './editor.scss';

type FontVariant = {
	label: string;
	value: string;
};

type FontItem = {
	family?: string;
	title?: string;
	variants?: Array< string | FontVariant >;
	_fontGroupId?: string;
	_fontGroupTitle?: string;
};

type FontGroup = {
	id: string;
	title: string;
	items: FontItem[];
};

type FontsControlProps = {
	value?: string;
	valueWeight?: string;
	onChangeFontGroupID: ( value: string ) => void;
	onChangeFontFamily: ( value: string ) => void;
	onChangeFontWeight: ( value: string ) => void;
};

type HooksApi = {
	applyFilters: < Value >( hookName: string, value: Value ) => Value;
};

const fallbackFontWeights = [
	{ value: '', label: __( 'Default', 'getwid' ) },
	{ value: '100', label: '100' },
	{ value: '200', label: '200' },
	{ value: '300', label: '300' },
	{ value: 'normal', label: '400' },
	{ value: '500', label: '500' },
	{ value: '600', label: '600' },
	{ value: '700', label: '700' },
	{ value: '800', label: '800' },
	{ value: '900', label: '900' },
];

function getHooks() {
	return (
		window as Window & {
			wp?: {
				hooks?: HooksApi;
			};
		}
	 ).wp?.hooks;
}

function startCase( value: string ) {
	return value
		.replace( /[-_]/g, ' ' )
		.replace( /\b\w/g, ( letter ) => letter.toUpperCase() );
}

function filterFontVariants( variants?: Array< string | FontVariant > ) {
	if ( ! variants ) {
		return [];
	}

	return variants
		.filter( ( variant ) => variant !== 'italic' )
		.map( ( variant ) => {
			if ( typeof variant !== 'string' ) {
				return variant;
			}

			const lowerVariant = variant.toLowerCase();

			return {
				label:
					lowerVariant === 'regular'
						? '400'
						: startCase( lowerVariant ),
				value: variant === 'regular' ? 'normal' : variant,
			};
		} );
}

function processLoadedFonts( fonts: FontGroup[], selectedFamily?: string ) {
	let selectedFont: FontItem | null = null;

	const processedFonts = fonts.map( ( fontGroup ) => ( {
		...fontGroup,
		items: fontGroup.items.map( ( font ) => {
			const processedFont = {
				...font,
				variants: filterFontVariants( font.variants ),
			};

			if ( font.family === selectedFamily ) {
				selectedFont = processedFont;
			}

			return processedFont;
		} ),
	} ) );

	return {
		fonts: processedFonts,
		selectedFont,
	};
}

function FontSelect( {
	fonts,
	selectedFont,
	onSelect,
}: {
	fonts: FontGroup[];
	selectedFont: FontItem | null;
	onSelect: ( fontGroupId: string, font: FontItem ) => void;
} ) {
	const fontsPerPage = 10;
	const [ search, setSearch ] = useState( '' );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const controlTitle =
		selectedFont?.title ||
		selectedFont?.family ||
		__( 'Select Font Family', 'getwid' );
	const flatFonts = useMemo(
		() =>
			fonts.flatMap( ( fontGroup ) =>
				fontGroup.items.map( ( item ) => ( {
					...item,
					_fontGroupId: fontGroup.id,
					_fontGroupTitle: fontGroup.title,
				} ) )
			),
		[ fonts ]
	);
	const filteredFonts = useMemo(
		() =>
			flatFonts.filter(
				( font ) =>
					font.family
						?.toLowerCase()
						.includes( search.toLowerCase() ) ||
					font.title?.toLowerCase().includes( search.toLowerCase() )
			),
		[ flatFonts, search ]
	);

	const fontGroups = useMemo( () => {
		const groups: Record< string, FontGroup > = {};

		filteredFonts
			.slice(
				( currentPage - 1 ) * fontsPerPage,
				currentPage * fontsPerPage
			)
			.forEach( ( font ) => {
				const groupId = font._fontGroupId ?? '';

				if ( ! groups[ groupId ] ) {
					groups[ groupId ] = {
						id: groupId,
						title: font._fontGroupTitle ?? '',
						items: [],
					};
				}

				groups[ groupId ].items.push( font );
			} );

		return Object.values( groups );
	}, [ currentPage, filteredFonts ] );
	const pageCount = Math.max(
		1,
		Math.ceil( filteredFonts.length / fontsPerPage )
	);

	return (
		<BaseControl
			id="getwid-advanced-heading-font-family"
			label={ __( 'Font Family', 'getwid' ) }
		>
			{ fonts.length < 1 && <div>{ __( 'Loading…', 'getwid' ) }</div> }
			{ fonts.length > 0 && (
				<Dropdown
					className="components-getwid-fonts-dropdown"
					contentClassName="components-getwid-fonts-popover"
					popoverProps={ { placement: 'bottom' } }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							className="components-getwid-fonts-button"
							onClick={ onToggle }
							aria-expanded={ isOpen }
						>
							{ controlTitle }
						</Button>
					) }
					renderContent={ ( { onToggle } ) => (
						<MenuGroup>
							<TextControl
								value={ search }
								onChange={ ( nextSearch ) => {
									setSearch( nextSearch );
									setCurrentPage( 1 );
								} }
							/>
							<div className="components-getwid-fonts-popover__items">
								{ currentPage === 1 && (
									<MenuItem
										onClick={ () => {
											onSelect( '', {} );
											onToggle();
										} }
									>
										{ __( 'Default', 'getwid' ) }
									</MenuItem>
								) }
								{ fontGroups.map( ( fontGroup ) => (
									<div key={ fontGroup.id }>
										<h4 style={ { margin: 0 } }>
											{ fontGroup.title }
										</h4>
										{ fontGroup.items.map(
											( font, index ) => (
												<MenuItem
													key={ `${ font.family }-${ index }` }
													icon={
														font.family ===
														selectedFont?.family
															? 'yes'
															: undefined
													}
													className={ clsx( {
														'is-selected':
															font.family ===
															selectedFont?.family,
													} ) }
													onClick={ () => {
														onToggle();
														onSelect(
															fontGroup.id,
															font
														);
													} }
												>
													{ font.title ||
														font.family }
												</MenuItem>
											)
										) }
									</div>
								) ) }
							</div>
							<Flex
								className="components-getwid-fonts-popover__navigation"
								gap={ 1 }
							>
								<Button
									size="small"
									icon="controls-skipback"
									disabled={ currentPage === 1 }
									onClick={ () => setCurrentPage( 1 ) }
								/>
								<Button
									size="small"
									icon="controls-back"
									disabled={ currentPage === 1 }
									onClick={ () =>
										setCurrentPage( currentPage - 1 )
									}
								/>
								<span>
									{ sprintf(
										/* translators: %1$d is the current page, %2$d is the total number of pages. */
										__( '%1$d of %2$d', 'getwid' ),
										currentPage,
										pageCount
									) }
								</span>
								<Button
									size="small"
									icon="controls-forward"
									disabled={ currentPage === pageCount }
									onClick={ () =>
										setCurrentPage( currentPage + 1 )
									}
								/>
								<Button
									size="small"
									icon="controls-skipforward"
									disabled={ currentPage === pageCount }
									onClick={ () =>
										setCurrentPage( pageCount )
									}
								/>
							</Flex>
						</MenuGroup>
					) }
				/>
			) }
		</BaseControl>
	);
}

export default function FontsControl( {
	value,
	valueWeight,
	onChangeFontGroupID,
	onChangeFontFamily,
	onChangeFontWeight,
}: FontsControlProps ) {
	const [ fonts, setFonts ] = useState< FontGroup[] >( [] );
	const [ selectedFont, setSelectedFont ] = useState< FontItem | null >(
		null
	);

	useEffect( () => {
		let isMounted = true;
		const hooks = getHooks();
		const enableGoogleFonts = hooks
			? hooks.applyFilters(
					'getwid.fontsControl.enableGoogleFonts',
					true
			  )
			: true;

		async function loadFonts() {
			const defaultFonts: FontGroup[] = [];

			if ( enableGoogleFonts ) {
				const response = await fetch(
					'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAWN8pd8HMruaR92oVbykdg-Q2HpgsikKU'
				);
				const data = ( await response.json() ) as { items: FontItem[] };

				defaultFonts.push( {
					id: 'google-fonts',
					title: __( 'Google Fonts', 'getwid' ),
					items: data.items,
				} );
			}

			const filteredFonts = hooks
				? hooks.applyFilters(
						'getwid.fontsControl.fonts',
						defaultFonts
				  )
				: defaultFonts;
			const processed = processLoadedFonts( filteredFonts, value );

			if ( isMounted ) {
				setFonts( processed.fonts );
				setSelectedFont( processed.selectedFont );
			}
		}

		loadFonts().catch( () => {
			if ( isMounted ) {
				setFonts( [] );
			}
		} );

		return () => {
			isMounted = false;
		};
	}, [ value ] );

	const availableFontVariants =
		selectedFont?.variants && selectedFont.variants.length > 0
			? ( selectedFont.variants as FontVariant[] )
			: null;

	return (
		<>
			<FontSelect
				fonts={ fonts }
				selectedFont={ selectedFont }
				onSelect={ ( fontGroupId, font ) => {
					onChangeFontGroupID( fontGroupId );
					onChangeFontFamily( font.family ?? '' );
					onChangeFontWeight( 'normal' );
					setSelectedFont( font.family ? font : null );
				} }
			/>
			<SelectControl
				label={ __( 'Font Weight', 'getwid' ) }
				value={ valueWeight || '' }
				options={ availableFontVariants || fallbackFontWeights }
				onChange={ onChangeFontWeight }
			/>
		</>
	);
}
