/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from 'wp.i18n';
const { BaseControl, Dropdown, Button, MenuGroup, TextControl, MenuItem, Flex } = wp.components;
const { useState, useMemo, useEffect } = wp.element;

export default ( props ) => {

	const FONTS_PER_PAGE = 10;
	const { selectedFont, onSelect, fonts } = props;

	const [ search, setSearch ] = useState( '' );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const controlTitle = selectedFont?.title || selectedFont?.family || __( 'Select Font Family', 'getwid' );

	const flatFonts = useMemo( () => fonts.flatMap( fontGroup => {
		return fontGroup.items.map( item => ( { ...item, _fontGroupId: fontGroup.id, _fontGroupTitle: fontGroup.title } ) )
	} ), [ fonts ] );

	const filteredFonts = useMemo( () => {
		const filteredFonts = [];

		flatFonts.map( ( font ) => {
			if ( font.family?.toLowerCase().includes( search.toLowerCase() ) || font.title?.toLowerCase().includes( search.toLowerCase() ) ) {
				filteredFonts.push( font );
			}
		} );

		return filteredFonts;
	}, [ search, flatFonts ] );

	const fontGroups = useMemo( () => {
		const fontGroups = []

		filteredFonts.slice( ( currentPage - 1 ) * FONTS_PER_PAGE, currentPage * FONTS_PER_PAGE ).map( ( font ) => {
			if ( ! fontGroups[ font._fontGroupId ] ) {
				fontGroups[ font._fontGroupId ] = {
					id: font._fontGroupId,
					title: font._fontGroupTitle,
					items: []
				};
			}
			fontGroups[ font._fontGroupId ].items.push( font );
		} );

		return Object.values( fontGroups );
	}, [ filteredFonts, currentPage ] );

	useEffect( () => { currentPage != 1 && setCurrentPage( 1 ) }, [ search ] );

	return (
		<BaseControl
			label={ 'Font Family' }
		>
			{ fonts.length < 1  && (
				<div>{ __( 'Loading…', 'getwid' ) }</div>
			) }

			{ fonts.length > 0 && (
				<Dropdown
					className="components-getwid-fonts-dropdown"
					contentClassName="components-getwid-fonts-popover"
					popoverProps={ { placement: "bottom" } }
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
								onChange={ value => setSearch( value ) }
							/>
							<div className="components-getwid-fonts-popover__items">
								{ currentPage == 1 &&
									<MenuItem
										onClick={ () => {
											onSelect( '', '' );
										}}
									>
										{ __( 'Default', 'getwid' ) }
									</MenuItem>
								}

								{ fontGroups.map( fontGroup => {

									return (
										<div key={ fontGroup.id }>
											<h4 style={ { margin:0 } } >
												{ fontGroup.title }
											</h4>
											{ ( fontGroup.items ).map( ( font, index ) => {
												return (
													<MenuItem
														key={ index }
														icon={ font.family === selectedFont?.family ? "yes" : "" }
														className={ classnames(
															{ 'is-selected': ( font.family === selectedFont?.family ) }
														) }
														onClick={ () => {
															onToggle();
															onSelect( fontGroup.id, font );
														}}
													>
														{ font.title || font.family }
													</MenuItem>
												);
											} ) }
										</div>
									);
								} ) }
							</div>
							<Flex
								className="components-getwid-fonts-popover__navigation"
								gap={ 1 }
							>
								<Button
									size="small"
									icon="controls-skipback"
									disabled={ currentPage == 1 }
									onClick={ () => { setCurrentPage(1) } }
								/>
								<Button
									size="small"
									icon="controls-back"
									disabled={ currentPage == 1 }
									onClick={ () => { setCurrentPage( currentPage - 1 ) } }
								/>
								<span>
									{ sprintf( __( '%d of %d', 'getwid' ), currentPage, Math.ceil( filteredFonts.length / FONTS_PER_PAGE ) ) }
								</span>
								<Button
									size="small"
									icon="controls-forward"
									disabled={ currentPage == Math.ceil( filteredFonts.length / FONTS_PER_PAGE ) }
									onClick={ () => { setCurrentPage( currentPage + 1 ) } }
								/>
								<Button
									size="small"
									icon="controls-skipforward"

									disabled={ currentPage == Math.ceil( filteredFonts.length / FONTS_PER_PAGE ) }
									onClick={ () => { setCurrentPage( Math.ceil( filteredFonts.length / FONTS_PER_PAGE ) ) } }
								/>
							</Flex>
						</MenuGroup>
					) }
				/>
			) }

		</BaseControl>
	)
}
