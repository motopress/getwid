/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
	startCase,
	toLower
} = lodash;

import { __ } from 'wp.i18n';

const {jQuery: $} = window;

const { withInstanceId } = wp.compose;

const {
	Button,
	BaseControl,
	Dropdown,
	MenuGroup,
	MenuItem,
	SelectControl,
	TextControl
} = wp.components;

const { Component, Fragment } = wp.element;

/**
* Internal dependencies
*/
import './editor.scss';


class FontsControl extends Component {

	enableGoogleFonts = true;

	constructor() {
		super( ...arguments );
		this.search = React.createRef();

		this.enableGoogleFonts = wp.hooks.applyFilters('getwid.fontsControl.enableGoogleFonts', this.enableGoogleFonts);

		this.state = {
			fonts: null,
			search: '',
			selectedFont: null
		};
	}

	async componentDidMount() {
		let defaultFonts = [ ];

		if ( this.enableGoogleFonts ) {
			const googleFonts = await this.loadGoogleFonts();

			defaultFonts.push({
				id: 'google-fonts',
				title: __( 'Google Fonts', 'getwid' ),
				items: googleFonts
			});
		}

		let fonts = wp.hooks.applyFilters( 'getwid.fontsControl.fonts', defaultFonts);

		fonts = this.processLoadedFonts(fonts);

		return this.setState({ fonts });
	}

	async loadGoogleFonts() {
		return fetch( 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAWN8pd8HMruaR92oVbykdg-Q2HpgsikKU' )
			.then( blob => blob.json() )
			.then( data => data.items );
	}

	processLoadedFonts(fonts) {
		return fonts.map( fontGroup => {
			fontGroup.items.map( font => {

				font.variants = this.filterFontVariants(font.variants);

				if (font.family === this.props.value) {
					this.setState({ selectedFont: font });
				}

				return font;
			})

			return fontGroup;
		})
	}

	filterFontVariants(variants) {
		return variants
			.filter( variant => variant !== 'italic'  )
			.map( variant => {
				return {
					'label': ( toLower( variant ) === 'regular' ? '400' : startCase( toLower( variant ) ) ),
					'value': ( variant === 'regular' ? 'normal' : variant)
				};
			} );
	}

	selectFont(groupID, font) {
		this.props.onChangeFontGroupID( groupID );
		this.props.onChangeFontFamily( font.family );
		this.props.onChangeFontWeight( 'normal' );

		this.setState({
			selectedFont: font,
			search: ''
		});
	}

	fontMatchesSearch(font) {
		const search = this.state.search;
		return ! search
			|| font.family.toLowerCase().includes( search.toLowerCase() )
			|| ( font.title && font.title.toLowerCase().includes( search.toLowerCase() ) );
	}

	render() {
		const id = `inspector-fonts-control-${ this.props.instanceId }`;
		const availableFontVariants = this.state.selectedFont && this.state.selectedFont.variants ? this.state.selectedFont.variants : null;
		const controlTitle = this.state.selectedFont && this.state.selectedFont.title ? this.state.selectedFont.title : this.props.value;

		return (
			<div className="components-getwid-fonts-control" >
				<BaseControl
					label={ this.props.label }
					id={ id }
				>
					{ ( null !== this.state.fonts ) ?
						(
							<Dropdown
								contentClassName="components-getwid-fonts-popover"
								position="bottom center"
								renderToggle={ ({ isOpen, onToggle }) => (
									<Button
										className="components-getwid-fonts-button"
										id={ id }
										onClick={ onToggle }
										aria-expanded={ isOpen }
									>
										{ controlTitle || __( 'Select Font Family', 'getwid' ) }
									</Button>
								) }
								renderContent={ ({ onToggle }) => (
									<MenuGroup>
										<TextControl
											value={ this.state.search }
											onChange={ e => this.setState({ search: e }) }
										/>
										<div className="components-popover__items">
											<MenuItem
												onClick={ () => {
													onToggle();
													this.props.onChangeFontGroupID( '' );
													this.props.onChangeFontFamily( '' );
													this.props.onChangeFontWeight( '' );
													this.setState({
														selectedFont: null,
														search: ''
													});
												}}
											>
												{ __( 'Default', 'getwid' ) }
											</MenuItem>

											{ ( this.state.fonts ).map( fontGroup => {

												return (
													<Fragment key={ fontGroup.id }>
														<h4 style={ { margin:0 } } >
															{ fontGroup.title }
														</h4>
														{ ( fontGroup.items ).map( ( font, index ) => {
															if ( this.fontMatchesSearch( font ) ) {
																return (
																	<MenuItem
																		key={ index }
																		className={ classnames(
																			{ 'is-selected': ( font.family === this.props.value ) }
																		) }
																		onClick={ () => {
																			onToggle();
																			this.selectFont( fontGroup.id, font );
																		}}
																	>
																		{ font.title || font.family }
																	</MenuItem>
																);
															}
														} ) }
													</Fragment>
												);
											} ) }
										</div>
									</MenuGroup>
								) }
							/>
						) : (
						__( 'Loading…', 'getwid' )
					) }
				</BaseControl>

				<SelectControl
					label={ __( 'Font Weight', 'getwid' ) }
					value={ this.props.valueWeight || '' }
					options={ availableFontVariants ? availableFontVariants : [
						{value: '', label: __('Default', 'getwid')},
						{value: '100', label: '100'},
						{value: '200', label: '200'},
						{value: '300', label: '300'},
						{value: 'normal', label: '400'},
						{value: '500', label: '500'},
						{value: '600', label: '600'},
						{value: '700', label: '700'},
						{value: '800', label: '800'},
						{value: '900', label: '900'},
					] }
					onChange={ this.props.onChangeFontWeight }
				/>
			</div>
		);
	}
}

export default withInstanceId( FontsControl );
