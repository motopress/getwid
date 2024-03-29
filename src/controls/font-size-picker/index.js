import { find, upperFirst } from 'lodash';

const {
	Component,
} = wp.element;

const {
	getFontSize,
	getFontSizeObjectByValue
} = wp.blockEditor;

const {
	FontSizePicker
} = wp.components;

const { compose } = wp.compose;
const { withSelect } = wp.data;

class GetwidFontSizePicker extends Component {

	constructor() {
		super(...arguments);
		this.onChange = this.onChange.bind(this);

		this.fontSizeAttributeName = this.props.fontSizeAttributeName;
		this.customFontSizeAttributeName = `custom${ upperFirst( this.fontSizeAttributeName ) }`
		this.getFontSizeObjectByValue = getFontSizeObjectByValue || this._getFontSizeObjectByValue;
	}

	_getFontSizeObjectByValue(fontSizes, value) {
		const fontSizeObject = find( fontSizes, { size: value } );
		if ( fontSizeObject ) {
			return fontSizeObject;
		}

		return {
			size: value,
		};
	}

	onChange(value) {
		const {
			setAttributes
		} = this.props;

		const fontSizeSlug = this.getFontSizeObjectByValue( this.props.fontSizes, value ).slug;

		setAttributes( {
			[this.fontSizeAttributeName]: fontSizeSlug,
			[this.customFontSizeAttributeName]: fontSizeSlug ? undefined : value?.toString()
		} );
	}

	render() {
		const fontSize = getFontSize( this.props.fontSizes, this.props.fontSize.fontSize, this.props.fontSize.customFontSize );

		return (
			<FontSizePicker
				fontSizes={ this.props.fontSizes }
				value={ fontSize?.size }
				onChange={ this.onChange }
				__nextHasNoMarginBottom
			/>
		)
	}
}

export default  compose([
	withSelect( ( select, props ) => {
		const settings = select( 'core/block-editor' ).getSettings();

		return {
			fontSizes: settings.fontSizes
		}
	})
])(GetwidFontSizePicker);
