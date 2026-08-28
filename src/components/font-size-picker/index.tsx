import { FontSizePicker as WordPressFontSizePicker } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

type FontSizeOption = {
	name?: string;
	slug?: string;
	size?: number | string;
};

type FontSizePickerProps = {
	fontSizeAttributeName: string;
	fontSize: {
		fontSize?: string;
		customFontSize?: string;
	};
	setAttributes: (
		attributes: Record< string, string | number | undefined >
	) => void;
};

type BlockEditorSettings = {
	fontSizes?: FontSizeOption[];
};

function upperFirst( value: string ) {
	return value.charAt( 0 ).toUpperCase() + value.slice( 1 );
}

function getFontSizeObjectBySize(
	fontSizes: FontSizeOption[],
	value?: number | string
) {
	const match = fontSizes.find(
		( item ) => String( item.size ) === String( value )
	);

	return match || { size: value };
}

function getCurrentFontSize(
	fontSizes: FontSizeOption[],
	fontSizeSlug?: string,
	customFontSize?: string
) {
	if ( fontSizeSlug ) {
		const match = fontSizes.find( ( item ) => item.slug === fontSizeSlug );

		if ( match ) {
			return match;
		}
	}

	return customFontSize ? { size: customFontSize } : undefined;
}

export default function FontSizePicker( {
	fontSizeAttributeName,
	fontSize,
	setAttributes,
}: FontSizePickerProps ) {
	const fontSizes = useSelect(
		( select ) =>
			(
				select( 'core/block-editor' ) as {
					getSettings: () => BlockEditorSettings;
				}
			 ).getSettings().fontSizes || [],
		[]
	);
	const customFontSizeAttributeName = `custom${ upperFirst(
		fontSizeAttributeName
	) }`;
	const currentFontSize = getCurrentFontSize(
		fontSizes,
		fontSize.fontSize,
		fontSize.customFontSize
	);

	function onChange( value?: number | string ) {
		const fontSizeObject = getFontSizeObjectBySize( fontSizes, value );
		const fontSizeSlug = fontSizeObject?.slug;

		setAttributes( {
			[ fontSizeAttributeName ]: fontSizeSlug,
			[ customFontSizeAttributeName ]: fontSizeSlug
				? undefined
				: value?.toString(),
		} );
	}

	return (
		<WordPressFontSizePicker
			fontSizes={ fontSizes }
			value={ currentFontSize?.size }
			onChange={ onChange }
			__nextHasNoMarginBottom
		/>
	);
}
