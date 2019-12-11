/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';

import classnames from 'classnames';

import './editor.scss';

import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';

const { Fragment } = wp.element;
const { Dropdown, ColorIndicator, Tooltip, Button, RangeControl, SelectControl, Dashicon } = wp.components;

//const { ColorPalette } = wp.blockEditor || wp.blockEditor || wp.editor;

const gradients = [
	{
		title: __( 'Vivid cyan blue to vivid purple' ),
		firstColor: '#0693e3',
		secondColor: '#9b51e0'
	},
	{
		title: __( 'Light green cyan to vivid green cyan' ),
		firstColor: '#67B26F',
		secondColor: '#4ca2cd'
	},
	{
		title: __( 'Luminous vivid amber to luminous vivid orange' ),
		firstColor: '#98b900',
		secondColor: '#98b900'
	},
	{
		title: __( 'Luminous vivid orange to vivid red' ),
		firstColor: '#ff6900',
		secondColor: '#ff692e'
	},
	{
		title: __( 'Very light gray to cyan bluish gray' ),
		firstColor: '#eeeeee',
		secondColor: '#a9b8c3'
	},
	{
		title: __( 'Blush light purple' ),
		firstColor: '#ffceec',
		secondColor: '#9896f0'
	},
	{
		title: __( 'Electric grass' ),
		firstColor: '#caf880',
		secondColor: '#71ce7e'
	},
	{
		title: __( 'Midnight' ),
		firstColor: '#020381',
		secondColor: '#2874fc'
	}
];

//const className = 'components-getwid-gradient-palette-control';

const GradientButton = ({ title, firstColor, secondColor, isSelected, onChange }) => {
	const optionButton = (
		<button
			type='button'
			aria-pressed={ isSelected }
			className={ classnames(
				'wp-block-themeisle-blocks-responsive-control-option',
				{ 'is-active': isSelected }
			) }
			style={ {
				background: `linear-gradient(90deg, ${ firstColor } 0%, ${ secondColor } 100%)`
			} }
			onClick={ () => onChange( firstColor, 0, secondColor, 100, 'linear', 90, 'center center' ) }
		/>
	);

	return (
		<div className='wp-block-themeisle-blocks-responsive-control-option-wrapper'>
			{ title ?
				( <Tooltip text={ title }>{ optionButton }</Tooltip> ) :
				optionButton
			}
			{ isSelected && <Dashicon icon='saved' /> }
		</div>
	);
}

export default function renderCustomGradientPallete({ label, value, onChange }) {

    const onChangeValue = value => {
        const { firstColor, firstLocation, secondColor, secondLocation, type, angle } = value;

		onChange( firstColor, firstLocation, secondColor, secondLocation, type, angle );
	};

    let direction;

	if ( 'linear' === value.type ) {
		direction = `${ value.angle }deg`;
	} else {
		direction = `at ${ value.position }`;
	}

	const background = `${ value.type }-gradient( ${ direction }, ${ value.firstColor || 'rgba( 0, 0, 0, 0 )' } ${ value.firstLocation }%, ${ value.secondColor || 'rgba( 0, 0, 0, 0 )' } ${ value.secondLocation }% )`;

    const showIndicator = value.firstColor && value.secondColor;

    return (
        <div className='wp-block-themeisle-blocks-responsive-control'>
            <div className='components-base-control__field'>
                { label && (
                    <div className='components-base-control__title'>
                        <label className='components-base-control__label'>
                            {label}
                            { showIndicator && <ColorIndicator colorValue={background}/>}
                        </label>
                    </div>
                ) }

                <div className='wp-block-themeisle-blocks-responsive-control-presets'>
                    { gradients.map(gradient => (
                        <GradientButton
                            title={gradient.title}
                            firstColor={gradient.firstColor}
                            secondColor={gradient.secondColor}
                            isSelected={gradient.firstColor === value.firstColor && gradient.secondColor === value.secondColor}
                            onChange={onChange}
                        />
                    ))}

                    <div className='wp-block-themeisle-blocks-responsive-control-custom-wrapper'>
                        <Dropdown
                            className='wp-block-themeisle-blocks-responsive-control-dropdown-link-action'
                            contentClassName='wp-block-themeisle-blocks-responsive-control-dropdown-content'
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
                                        onChange={nextValue => onChangeValue( {
                                            ...value,
                                            type: nextValue
                                        } )}
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
                                            changeColor: nextValue => onChangeValue( {
                                                ...value,
                                                firstColor: nextValue
                                            } )
                                        }]}
                                    />
                                    <RangeControl
                                        label={__( 'First Color Location', 'getwid' )}
                                        value={value.firstLocation != undefined ? value.firstLocation : ''}
                                        onChange={nextValue => onChangeValue( {
                                            ...value,
                                            firstLocation: nextValue
                                        } )}
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
                                            changeColor: nextValue => onChangeValue( {
                                                ...value,
                                                secondColor: nextValue
                                            } )
                                        }]}
                                    />
                                    <RangeControl
                                        label={__( 'Second Color Location', 'getwid' )}
                                        value={value.secondLocation != undefined ? value.secondLocation : ''}
                                        onChange={nextValue => onChangeValue( {
                                            ...value,
                                            secondLocation: nextValue
                                        } )}
                                        placeholder={100}
                                        min={0}
                                        max={100}
                                        step={1}
                                    />                                    
                                    { value.type === 'linear' && (
                                        <RangeControl
                                            label={__( 'Angle', 'getwid' )}
                                            value={value.angle != undefined ? value.angle : ''}
                                            onChange={nextValue => onChangeValue( {
                                                ...value,
                                                angle: nextValue
                                            } )}
                                            placeholder={180}
                                            min={0}
                                            max={360}
                                            step={1}
                                        />
                                    ) }
                                </Fragment>
                            )}
                        />
                        <Button
                            className='wp-block-themeisle-blocks-responsive-control-clear'
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