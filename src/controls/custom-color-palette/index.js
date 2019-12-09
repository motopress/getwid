/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';

import { get, has } from 'lodash';

const { Fragment } = wp.element;
const { BaseControl, ColorPalette, ColorIndicator } = wp.components;

const { withSelect } = wp.data;
const { compose } = wp.compose;

const renderCustomColorPallete = ( { props, getEditorSettings } ) => {
    const { colorSettings } = props;

    const editorColors = get( getEditorSettings(), [ 'colors' ], [] );

    return (
        <Fragment>
            { colorSettings.map( (item, index) => {

                const defaultColor = has( item, [ 'colors', 'defaultColor' ] ) ? item.colors.defaultColor.color : undefined;

                return (
                    <BaseControl
                        label={item.title}
                        className='components-getwid-color-palette-control'
                    >
                        { item.colors.customColor || defaultColor && (
                            <ColorIndicator colorValue={item.colors.customColor ? item.colors.customColor : defaultColor}/>
                        )}

                        <ColorPalette
                            colors={editorColors}
                            value={defaultColor ? defaultColor : item.colors.customColor}
                            onChange={item.changeColor}
                        />
                    </BaseControl>
                );                
            } ) }
        </Fragment>
    );
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getEditorSettings } = select( 'core/editor' );
		return {
            getEditorSettings,
            props
		};
	} )
] )( renderCustomColorPallete );