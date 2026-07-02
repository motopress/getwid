import {
	BaseControl,
	ColorIndicator,
	ColorPalette,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';

import './editor.scss';

type ColorValue = {
	color?: string;
};

type ColorSetting = {
	title: string;
	colors: {
		customColor?: string;
		defaultColor?: ColorValue;
	};
	changeColor: ( color?: string ) => void;
};

type CustomColorPaletteProps = {
	colorSettings: ColorSetting[];
};

type EditorSettings = {
	colors?: Array< {
		name: string;
		slug: string;
		color: string;
	} >;
};

type BlockEditorSelect = {
	getSettings: () => EditorSettings;
};

export default function CustomColorPalette( {
	colorSettings,
}: CustomColorPaletteProps ) {
	const editorColors = useSelect( ( select ) => {
		const { getSettings } = select(
			'core/block-editor'
		) as BlockEditorSelect;

		return getSettings().colors || [];
	}, [] );

	return (
		<BaseControl className="components-getwid-color-palette-control">
			{ colorSettings.map( ( item, index ) => {
				const defaultColor = item.colors.defaultColor?.color;
				const colorValue = item.colors.customColor || defaultColor;

				return (
					<Fragment key={ index }>
						<BaseControl.VisualLabel>
							{ item.title }
							{ colorValue && (
								<ColorIndicator colorValue={ colorValue } />
							) }
						</BaseControl.VisualLabel>
						<ColorPalette
							colors={ editorColors }
							value={ defaultColor || item.colors.customColor }
							onChange={ item.changeColor }
						/>
					</Fragment>
				);
			} ) }
		</BaseControl>
	);
}
