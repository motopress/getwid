/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import gradients from './gradients';
import GradientButton from './gradient-button';
import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';

import './editor.scss';

/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { Dropdown, ColorIndicator, Button, RangeControl, SelectControl } = wp.components;

/**
* Module Constants
*/
const className = 'components-getwid-gradient-palette-control';

export default function renderCustomGradientPallete({ label, value, onChange }) {

    const onChangeValue = value => {
        const { firstColor, firstLocation, secondColor, secondLocation, type, angle } = value;

		onChange( firstColor, firstLocation, secondColor, secondLocation, type, angle );
	};

    let direction;

	if ( 'linear' === value.type ) {
		direction = `${value.angle}deg`;
	} else {
		direction = `at ${value.position}`;
	}

	const background = `${value.type}-gradient( ${direction}, ${value.firstColor || 'rgba( 0, 0, 0, 0 )'} ${value.firstLocation}%, ${value.secondColor || 'rgba( 0, 0, 0, 0 )' } ${value.secondLocation}% )`;

    const showIndicator = value.firstColor && value.secondColor;

    return (
        <div className={`${className}`}>
            <div className='components-base-control__field'>
                {label && (
                    <div className='components-base-control__title'>
                        <label className='components-base-control__label'>
                            {label}
                            {showIndicator && <ColorIndicator colorValue={background}/>}
                        </label>
                    </div>
                )}

                <div className={`${className}-presets`}>
                    {gradients.map(gradient => (
                        <GradientButton
                            title={gradient.title}
                            className={className}
                            firstColor={gradient.firstColor}
                            secondColor={gradient.secondColor}
                            isSelected={gradient.firstColor === value.firstColor && gradient.secondColor === value.secondColor}
                            onChange={onChange}
                        />
                    ))}
                    <div className={`${className}-custom-wrapper`}>
                        <Dropdown
                            className={`${className}-dropdown-link-action`}
                            contentClassName={`${className}-dropdown-content`}
                            renderToggle={({ isOpen, onToggle }) => (
                                <Button
                                    onClick={onToggle}
                                    isLink
                                >
                                    {__( 'Custom Gradient', 'getwid' )}
                                </Button>
                            )}
                            renderContent={() => (
                                <Fragment>
                                    <SelectControl
                                        label={__( 'Type', 'getwid' )}
                                        value={value.type ? value.type : ''}
                                        onChange={nextValue => onChangeValue({
                                            ...value,
                                            type: nextValue
                                        })}
                                        options={[
                                            { value: ''      , label: __( 'None'  , 'getwid') },
                                            { value: 'linear', label: __( 'Linear', 'getwid') },
                                            { value: 'radial', label: __( 'Radial', 'getwid') }
                                        ]}
                                    />
                                    <GetwidCustomColorPalette
                                        colorSettings={[{
                                            title: __( 'First Color', 'getwid' ),
                                            colors: {
                                                customColor: value.firstColor
                                            },
                                            changeColor: nextValue => onChangeValue({
                                                ...value,
                                                firstColor: nextValue,
                                                type: (!value.type ? 'linear' : value.type)
                                            })                                            
                                        }]}
                                    />
                                    <RangeControl
                                        label={__( 'First Color Location', 'getwid' )}
                                        value={value.firstLocation != undefined ? value.firstLocation : ''}
                                        onChange={nextValue => onChangeValue({
                                            ...value,
                                            firstLocation: nextValue
                                        })}
                                        placeholder={0}
                                        min={0}
                                        max={100}
                                        step={1}
                                    />
                                    <GetwidCustomColorPalette
                                        colorSettings={[{
                                            title: __( 'Second Color', 'getwid' ),
                                            colors: {
                                                customColor: value.secondColor
                                            },
                                            changeColor: nextValue => onChangeValue({
                                                ...value,
                                                secondColor: nextValue,
                                                type: (!value.type ? 'linear' : value.type)
                                            })
                                        }]}
                                    />
                                    <RangeControl
                                        label={__( 'Second Color Location', 'getwid' )}
                                        value={value.secondLocation != undefined ? value.secondLocation : ''}
                                        onChange={nextValue => onChangeValue({
                                            ...value,
                                            secondLocation: nextValue
                                        })}
                                        placeholder={100}
                                        min={0}
                                        max={100}
                                        step={1}
                                    />                                    
                                    {value.type === 'linear' && (
                                        <RangeControl
                                            label={__( 'Angle', 'getwid' )}
                                            value={value.angle != undefined ? value.angle : ''}
                                            onChange={nextValue => onChangeValue({
                                                ...value,
                                                angle: nextValue
                                            })}
                                            placeholder={180}
                                            min={0}
                                            max={360}
                                            step={1}
                                        />
                                    )}
                                </Fragment>
                            )}
                        />
                        <Button
                            className={`${className}-clear`}
                            type='button'
                            isSmall
                            isDefault
                            onClick={() => onChange( undefined, 0, undefined, 100, '', 90 )}
                        >
                            {__( 'Reset', 'getwid' )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}