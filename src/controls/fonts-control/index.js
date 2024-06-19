/**
 * WordPress dependencies
 */
const {
	startCase,
	toLower
} = lodash;

import { __ } from 'wp.i18n';

const {	SelectControl } = wp.components;
const { Component } = wp.element;

/**
* Internal dependencies
*/
import './editor.scss';
import FontSelect from './font-select'

class FontsControl extends Component {

	enableGoogleFonts = true;

	constructor() {
		super( ...arguments );

		this.enableGoogleFonts = wp.hooks.applyFilters('getwid.fontsControl.enableGoogleFonts', this.enableGoogleFonts);

		this.state = {
			fonts: [],
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

		this.setState( { selectedFont: font } );
	}

	render() {
		const availableFontVariants = this.state.selectedFont && this.state.selectedFont.variants ? this.state.selectedFont.variants : null;

		return (
			<>
				<FontSelect
					fonts={ this.state.fonts }
					selectedFont={ this.state.selectedFont }
					onSelect={ ( fontGroupID, font ) => this.selectFont( fontGroupID, font ) }
				/>

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
			</>
		);
	}
}

export default FontsControl;
