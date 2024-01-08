/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

import { get, has } from 'lodash';

/**
* Internal dependencies
*/
import './editor.scss';

/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { BaseControl, ColorPalette, ColorIndicator } = wp.components;

const { withSelect } = wp.data;
const { compose } = wp.compose;

/**
* Create an Control
*/
const renderCustomColorPallete = ({ props, getSettings }) => {
    const { colorSettings } = props;

	const editorColors = get( getSettings(), [ 'colors' ], [] );

    return (
		<BaseControl
			className='components-getwid-color-palette-control'
		>
			{colorSettings.map((item, index) => {

				const defaultColor = has( item, [ 'colors', 'defaultColor' ] ) ? item.colors.defaultColor.color : undefined;

				return (
					<Fragment key={ index }>
						<BaseControl.VisualLabel>
							{ item.title }
							{ ( item.colors.customColor || defaultColor ) && (
								<ColorIndicator colorValue={ item.colors.customColor ? item.colors.customColor : defaultColor }/>
							) }
						</BaseControl.VisualLabel>
						<ColorPalette
							colors={ editorColors }
							value={ defaultColor ? defaultColor : item.colors.customColor }
							onChange={ item.changeColor }
						/>
					</Fragment>
				);
			})}
		</BaseControl>
    );
}

if ( ! has( BaseControl, [ 'VisualLabel' ] ) ) {
    BaseControl.VisualLabel = ({ className, children }) => {
        className = classnames( 'components-base-control__label', className );
        return (
            <span className={className}>
                {children}
            </span>
        );
    };
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getSettings } = select( 'core/block-editor' );

		return {
            getSettings,
            props
		};
	} )
] )( renderCustomColorPallete );
