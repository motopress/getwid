/**
 * Internal dependencies
 */
import GetwidIconPicker         from 'GetwidControls/icon-picker';
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';
import CustomPanelBody from 'GetwidControls/custom-panel-body';

import './editor.scss';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import { escape, unescape } from 'lodash';

const { jQuery: $ } = window;

const { Fragment } = wp.element;
const { SelectControl, TabPanel, BaseControl, Button, IconButton, CheckboxControl, TextControl, ToggleControl, TextareaControl, RangeControl, RadioControl } = wp.components;

/* #region Paddings tabs panel ( Section, Post featured background image ) */
export const renderPaddingsPanelWithTabs = self => {

    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = self.props.attributes;
    const { paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue } = self.props.attributes;

    const resetPadding = () => {

        const { setAttributes } = self.props;

        setAttributes({
            paddingTopValue: undefined,
            paddingBottomValue: undefined,
            paddingLeftValue: undefined,
            paddingRightValue: undefined,

            paddingTop: '',
            paddingBottom: '',
            paddingLeft: '',
            paddingRight: '',

            paddingTopTablet: '',
            paddingBottomTablet: '',
            paddingLeftTablet: '',
            paddingRightTablet: '',

            paddingTopMobile: '',
            paddingBottomMobile: '',
            paddingLeftMobile: '',
            paddingRightMobile: ''
        });
    };

    return (
        
        <CustomPanelBody
            title={__('Padding', 'getwid')}
            initialOpen={false}
            hints={[
                {'label' : __('Top', 'getwid'), 'value': (paddingTop ? (paddingTop !='custom' ? paddingTop : paddingTopValue) : '')},
                {'label' : __('Right', 'getwid'), 'value': (paddingRight ? (paddingRight !='custom' ? paddingRight : paddingRightValue) : '')},
                {'label' : __('Bottom', 'getwid'), 'value': (paddingBottom ? (paddingBottom !='custom' ? paddingBottom : paddingBottomValue) : '')},
                {'label' : __('Left', 'getwid'), 'value': (paddingLeft ? (paddingLeft !='custom' ? paddingLeft : paddingLeftValue) : '')},                
            ]}
        >
            <TabPanel className='getwid-editor-tabs'
                activeClass='is-active'
                tabs={[
                    {
                        name: 'desktop',
                        title: __('Desktop', 'getwid'),
                        className: 'components-button is-link is-small'
                    },
                    {
                        name: 'tablet',
                        title: __('Tablet', 'getwid'),
                        className: 'components-button is-link is-small'
                    },
                    {
                        name: 'mobile',
                        title: __('Mobile', 'getwid'),
                        className: 'components-button is-link is-small'
                    }
                ]}>
                {
                    tab => renderResponsivePaddingsTabs(self, tab)
                }
            </TabPanel>
            <BaseControl>
                <Button isLink
                    onClick={resetPadding}
                    disabled={!hasPadding(self)}>
                    {__('Reset All', 'getwid')}
                </Button>
            </BaseControl>
        </CustomPanelBody>
    );
}

const hasPadding = self => {

    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = self.props.attributes;
    const { paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue } = self.props.attributes;

    const { paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet } = self.props.attributes;
    const { paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile } = self.props.attributes;

    return paddingTopValue !== undefined ||
        paddingBottomValue !== undefined ||
        paddingRightValue !== undefined ||
        paddingLeftValue !== undefined ||

        paddingTop !== '' ||
        paddingRight !== '' ||
        paddingBottom !== '' ||
        paddingLeft !== '' ||

        paddingTopTablet !== '' ||
        paddingRightTablet !== '' ||
        paddingBottomTablet !== '' ||
        paddingLeftTablet !== '' ||

        paddingTopMobile !== '' ||
        paddingRightMobile !== '' ||
        paddingBottomMobile !== '' ||
        paddingLeftMobile !== '';
};

const renderResponsivePaddingsTabs = (self, tab) => {

    const { setAttributes } = self.props;
    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = self.props.attributes;
    const { paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue } = self.props.attributes;

    const { paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet } = self.props.attributes;
    const { paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile } = self.props.attributes;

    const { changeState, isLockedPaddingsOnDesktop, isLockedPaddingsOnTablet, isLockedPaddingsOnMobile } = self.props;

    switch (tab.name) {
        case 'desktop': {
            return (
                <Fragment>
                    <div className='components-base-control-with-lock'>
                        <SelectControl
                            label={__('Padding Top', 'getwid')}
                            value={paddingTop !== undefined ? paddingTop : ''}
                            onChange={paddingTop => {
                                const setPaddingsOnDesktop = () => setAttributes({
                                    paddingBottom: paddingTop,
                                    paddingRight: paddingTop,
                                    paddingLeft: paddingTop,
                                    paddingTop
                                });
                                isLockedPaddingsOnDesktop ? setPaddingsOnDesktop() : setAttributes({ paddingTop });
                            }}
                            options={[
                                { value: '', label: __('Default', 'getwid') },
                                { value: 'small', label: __('Small', 'getwid') },
                                { value: 'medium', label: __('Medium', 'getwid') },
                                { value: 'normal', label: __('Normal', 'getwid') },
                                { value: 'large', label: __('Large', 'getwid') },
                                { value: 'custom', label: __('Custom', 'getwid') },
                                { value: 'none', label: __('None', 'getwid') }
                            ]}
                        />
                        <IconButton
                            icon={isLockedPaddingsOnDesktop ? 'lock' : 'unlock'}
                            onClick={() => {
                                const setPaddingsOnDesktop = () => {
                                    changeState('isLockedPaddingsOnDesktop', true);
                                    const setWithCustomValue = () => setAttributes({
                                        paddingBottom: paddingTop,
                                        paddingRight: paddingTop,
                                        paddingLeft: paddingTop,

                                        paddingBottomValue: paddingTopValue,
                                        paddingRightValue: paddingTopValue,
                                        paddingLeftValue: paddingTopValue,
                                    });

                                    const setWithDefaultValue = () => setAttributes({
                                        paddingBottom: paddingTop,
                                        paddingLeft: paddingTop,
                                        paddingRight: paddingTop
                                    });
                                    paddingTop == 'custom' ? setWithCustomValue() : setWithDefaultValue();
                                };
                                !isLockedPaddingsOnDesktop ? setPaddingsOnDesktop() : changeState('isLockedPaddingsOnDesktop', false);
                            }}
                            label={isLockedPaddingsOnDesktop ? __('Unlock', 'getwid') : __('Lock', 'getwid')}
                        />
                    </div>
                    {
                        paddingTop === 'custom' && (
                            <GetwidStyleLengthControl
                                value={paddingTopValue}
                                onChange={paddingTopValue => {
                                    const setCustomPaddingsOnDesktop = () => setAttributes({
                                        paddingBottomValue: paddingTopValue,
                                        paddingRightValue: paddingTopValue,
                                        paddingLeftValue: paddingTopValue,
                                        paddingTopValue
                                    });
                                    isLockedPaddingsOnDesktop ? setCustomPaddingsOnDesktop() : setAttributes({ paddingTopValue });
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Padding Bottom', 'getwid')}
                        disabled={isLockedPaddingsOnDesktop ? true : null}
                        value={paddingBottom !== undefined ? paddingBottom : ''}
                        onChange={paddingBottom => setAttributes({ paddingBottom })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'custom', label: __('Custom', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                    {
                        paddingBottom === 'custom' && (
                            <GetwidStyleLengthControl
                                value={paddingBottomValue}
                                isLocked={isLockedPaddingsOnDesktop}
                                onChange={paddingBottomValue => {
                                    setAttributes({ paddingBottomValue });
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Padding Left', 'getwid')}
                        disabled={isLockedPaddingsOnDesktop ? true : null}
                        value={paddingLeft !== undefined ? paddingLeft : ''}
                        onChange={paddingLeft => setAttributes({ paddingLeft })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'custom', label: __('Custom', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                    {
                        paddingLeft === 'custom' && (
                            <GetwidStyleLengthControl
                                value={paddingLeftValue}
                                isLocked={isLockedPaddingsOnDesktop}
                                onChange={paddingLeftValue => {
                                    setAttributes({ paddingLeftValue });
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Padding Right', 'getwid')}
                        disabled={isLockedPaddingsOnDesktop ? true : null}
                        value={paddingRight !== undefined ? paddingRight : ''}
                        onChange={paddingRight => setAttributes({ paddingRight })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'custom', label: __('Custom', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                    {
                        paddingRight === 'custom' && (
                            <GetwidStyleLengthControl
                                value={paddingRightValue}
                                isLocked={isLockedPaddingsOnDesktop}
                                onChange={paddingRightValue => {
                                    setAttributes({ paddingRightValue });
                                }}
                            />
                        )
                    }
                </Fragment>
            );
        }
        case 'tablet': {
            return (
                <Fragment>
                    <div className='components-base-control-with-lock'>
                        <SelectControl
                            label={__('Padding Top', 'getwid')}
                            value={paddingTopTablet !== undefined ? paddingTopTablet : ''}
                            onChange={paddingTopTablet => {

                                const setPaddingsOnTablet = () => setAttributes({
                                    paddingBottomTablet: paddingTopTablet,
                                    paddingRightTablet: paddingTopTablet,
                                    paddingLeftTablet: paddingTopTablet,
                                    paddingTopTablet
                                });
                                isLockedPaddingsOnTablet ? setPaddingsOnTablet() : setAttributes({ paddingTopTablet });
                            }}
                            options={[
                                { value: '', label: __('Default', 'getwid') },
                                { value: 'small', label: __('Small', 'getwid') },
                                { value: 'medium', label: __('Medium', 'getwid') },
                                { value: 'normal', label: __('Normal', 'getwid') },
                                { value: 'large', label: __('Large', 'getwid') },
                                { value: 'none', label: __('None', 'getwid') }
                            ]}
                        />
                        <IconButton
                            icon={isLockedPaddingsOnTablet ? 'lock' : 'unlock'}
                            onClick={() => {
                                const setPaddingsOnTablet = () => {
                                    changeState('isLockedPaddingsOnTablet', true);
                                    setAttributes({
                                        paddingBottomTablet: paddingTopTablet,
                                        paddingRightTablet: paddingTopTablet,
                                        paddingLeftTablet: paddingTopTablet
                                    });
                                };
                                !isLockedPaddingsOnTablet ? setPaddingsOnTablet() : changeState('isLockedPaddingsOnTablet', false);
                            }}
                            label={isLockedPaddingsOnTablet ? __('Unlock', 'getwid') : __('Lock', 'getwid')}
                        />
                    </div>

                    <SelectControl
                        label={__('Padding Bottom', 'getwid')}
                        disabled={isLockedPaddingsOnTablet ? true : null}
                        value={paddingBottomTablet !== undefined ? paddingBottomTablet : ''}
                        onChange={paddingBottomTablet => setAttributes({ paddingBottomTablet })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                    <SelectControl
                        label={__('Padding Left', 'getwid')}
                        disabled={isLockedPaddingsOnTablet ? true : null}
                        value={paddingLeftTablet !== undefined ? paddingLeftTablet : ''}
                        onChange={paddingLeftTablet => setAttributes({ paddingLeftTablet })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />

                    <SelectControl
                        label={__('Padding Right', 'getwid')}
                        disabled={isLockedPaddingsOnTablet ? true : null}
                        value={paddingRightTablet !== undefined ? paddingRightTablet : ''}
                        onChange={paddingRightTablet => setAttributes({ paddingRightTablet })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                </Fragment>
            );
        }
        case 'mobile': {
            return (
                <Fragment>
                    <div className='components-base-control-with-lock'>
                        <SelectControl
                            label={__('Padding Top', 'getwid')}
                            value={paddingTopMobile !== undefined ? paddingTopMobile : ''}
                            onChange={paddingTopMobile => {

                                const setPaddingsOnMobile = () => setAttributes({
                                    paddingBottomMobile: paddingTopMobile,
                                    paddingLeftMobile: paddingTopMobile,
                                    paddingRightMobile: paddingTopMobile,
                                    paddingTopMobile
                                });
                                isLockedPaddingsOnMobile ? setPaddingsOnMobile() : setAttributes({ paddingTopMobile });
                            }}
                            options={[
                                { value: '', label: __('Default', 'getwid') },
                                { value: 'small', label: __('Small', 'getwid') },
                                { value: 'medium', label: __('Medium', 'getwid') },
                                { value: 'normal', label: __('Normal', 'getwid') },
                                { value: 'large', label: __('Large', 'getwid') },
                                { value: 'none', label: __('None', 'getwid') }
                            ]}
                        />
                        <IconButton
                            icon={isLockedPaddingsOnMobile ? 'lock' : 'unlock'}
                            onClick={() => {
                                const setPaddingsOnMobile = () => {
                                    changeState('isLockedPaddingsOnMobile', true);
                                    setAttributes({
                                        paddingBottomMobile: paddingTopMobile,
                                        paddingLeftMobile: paddingTopMobile,
                                        paddingRightMobile: paddingTopMobile,
                                    });
                                };

                                !isLockedPaddingsOnMobile ? setPaddingsOnMobile() : changeState('isLockedPaddingsOnMobile', false);
                            }}
                            label={isLockedPaddingsOnMobile ? __('Unlock', 'getwid') : __('Lock', 'getwid')}
                        />
                    </div>
                    <SelectControl
                        label={__('Padding Bottom', 'getwid')}
                        disabled={isLockedPaddingsOnMobile ? true : null}
                        value={paddingBottomMobile !== undefined ? paddingBottomMobile : ''}
                        onChange={paddingBottomMobile => setAttributes({ paddingBottomMobile })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                    <SelectControl
                        label={__('Padding Left', 'getwid')}
                        disabled={isLockedPaddingsOnMobile ? true : null}
                        value={paddingLeftMobile !== undefined ? paddingLeftMobile : ''}
                        onChange={paddingLeftMobile => setAttributes({ paddingLeftMobile })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />

                    <SelectControl
                        label={__('Padding Right', 'getwid')}
                        disabled={isLockedPaddingsOnMobile ? true : null}
                        value={paddingRightMobile !== undefined ? paddingRightMobile : ''}
                        onChange={paddingRightMobile => setAttributes({ paddingRightMobile })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                </Fragment>
            );
        }
    }
};
/* #endregion */

/* #region Margins tabs panel ( Section ) */
export const renderMarginsPanelWithTabs = self => {

    const { marginTop, marginRight, marginBottom, marginLeft } = self.props.attributes;
    const { marginTopValue, marginRightValue, marginBottomValue, marginLeftValue } = self.props.attributes;

    const resetMargin = () => {

        const { setAttributes } = self.props;

        setAttributes({
            marginTopValue: undefined,
            marginBottomValue: undefined,
            marginLeftValue: undefined,
            marginRightValue: undefined,

            marginTop: '',
            marginBottom: '',
            marginLeft: '',
            marginRight: '',

            marginTopTablet: '',
            marginBottomTablet: '',
            marginLeftTablet: '',
            marginRightTablet: '',

            marginTopMobile: '',
            marginBottomMobile: '',
            marginLeftMobile: '',
            marginRightMobile: ''
        });
    };

    return (
        <CustomPanelBody
            title={__('Margin', 'getwid')}
            initialOpen={false}
            hints={[
                {'label' : __('Top', 'getwid'), 'value': (marginTop ? (marginTop !='custom' ? marginTop : marginTopValue) : '')},
                {'label' : __('Right', 'getwid'), 'value': (marginRight ? (marginRight !='custom' ? marginRight : marginRightValue) : '')},
                {'label' : __('Bottom', 'getwid'), 'value': (marginBottom ? (marginBottom !='custom' ? marginBottom : marginBottomValue) : '')},
                {'label' : __('Left', 'getwid'), 'value': (marginLeft ? (marginLeft !='custom' ? marginLeft : marginLeftValue) : '')},                
            ]}
        >
            <TabPanel className='getwid-editor-tabs'
                activeClass='is-active'
                tabs={[
                    {
                        name: 'desktop',
                        title: __('Desktop', 'getwid'),
                        className: 'components-button is-link is-small',
                    },
                    {
                        name: 'tablet',
                        title: __('Tablet', 'getwid'),
                        className: 'components-button is-link is-small',
                    },
                    {
                        name: 'mobile',
                        title: __('Mobile', 'getwid'),
                        className: 'components-button is-link is-small',
                    }
                ]}>
                {tab => renderResponsiveMarginsTabs(self, tab)}
            </TabPanel>
            <BaseControl>
                <Button isLink
                    onClick={resetMargin}
                    disabled={!hasMargin(self)}>
                    {__('Reset All', 'getwid')}
                </Button>
            </BaseControl>
        </CustomPanelBody>
    );
};

const hasMargin = self => {

    const { marginTop, marginRight, marginBottom, marginLeft } = self.props.attributes;
    const { marginTopValue, marginRightValue, marginBottomValue, marginLeftValue } = self.props.attributes;

    const { marginTopTablet, marginRightTablet, marginBottomTablet, marginLeftTablet } = self.props.attributes;
    const { marginTopMobile, marginRightMobile, marginBottomMobile, marginLeftMobile } = self.props.attributes;

    return marginTopValue !== undefined ||
        marginBottomValue !== undefined ||
        marginRightValue !== undefined ||
        marginLeftValue !== undefined ||

        marginTop !== '' ||
        marginRight !== '' ||
        marginBottom !== '' ||
        marginLeft !== '' ||

        marginTopTablet !== '' ||
        marginRightTablet !== '' ||
        marginBottomTablet !== '' ||
        marginLeftTablet !== '' ||

        marginTopMobile !== '' ||
        marginRightMobile !== '' ||
        marginBottomMobile !== '' ||
        marginLeftMobile !== '';
};

const renderResponsiveMarginsTabs = (self, tab) => {

    const { setAttributes } = self.props;
    const { marginTop, marginRight, marginBottom, marginLeft } = self.props.attributes;
    const { marginTopValue, marginRightValue, marginBottomValue, marginLeftValue } = self.props.attributes;

    const { marginTopTablet, marginRightTablet, marginBottomTablet, marginLeftTablet } = self.props.attributes;
    const { marginTopMobile, marginRightMobile, marginBottomMobile, marginLeftMobile } = self.props.attributes;

    const { changeState, isLockedMarginsOnDesktop, isLockedMarginsOnTablet, isLockedMarginsOnMobile } = self.props;

    switch (tab.name) {
        case 'desktop': {
            return (
                <Fragment>
                    <div className='components-base-control-with-lock'>
                        <SelectControl
                            label={__('Margin Top', 'getwid')}
                            value={marginTop !== undefined ? marginTop : ''}
                            onChange={marginTop => {
                                const setMarginsOnDesktop = () => setAttributes({
                                    marginBottom: marginTop,
                                    marginLeft: marginTop,
                                    marginRight: marginTop,
                                    marginTop
                                });
                                isLockedMarginsOnDesktop ? setMarginsOnDesktop() : setAttributes({ marginTop });
                            }}

                            options={[
                                { value: '', label: __('Default', 'getwid') },
                                { value: 'small', label: __('Small', 'getwid') },
                                { value: 'medium', label: __('Medium', 'getwid') },
                                { value: 'normal', label: __('Normal', 'getwid') },
                                { value: 'large', label: __('Large', 'getwid') },
                                { value: 'custom', label: __('Custom', 'getwid') },
                                { value: 'none', label: __('None', 'getwid') }
                            ]}
                        />
                        <IconButton
                            icon={isLockedMarginsOnDesktop ? 'lock' : 'unlock'}
                            onClick={() => {
                                const setMarginsOnDesktop = () => {
                                    changeState('isLockedMarginsOnDesktop', true);
                                    const setWithCustomValue = () => setAttributes({
                                        marginBottom: marginTop,
                                        marginRight: marginTop,
                                        marginLeft: marginTop,

                                        marginBottomValue: marginTopValue,
                                        marginRightValue: marginTopValue,
                                        marginLeftValue: marginTopValue
                                    });

                                    const setWithDefaultValue = () => setAttributes({
                                        marginBottom: marginTop,
                                        marginLeft: marginTop,
                                        marginRight: marginTop
                                    });
                                    marginTop == 'custom' ? setWithCustomValue() : setWithDefaultValue();
                                };
                                !isLockedMarginsOnDesktop ? setMarginsOnDesktop() : changeState('isLockedMarginsOnDesktop', false);
                            }}
                            label={isLockedMarginsOnDesktop ? __('Unlock', 'getwid') : __('Lock', 'getwid')}
                        />
                    </div>
                    {
                        marginTop === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginTopValue}
                                onChange={marginTopValue => {
                                    const setCustomMarginsOnDesktop = () => setAttributes({
                                        marginBottomValue: marginTopValue,
                                        marginRightValue: marginTopValue,
                                        marginLeftValue: marginTopValue,
                                        marginTopValue
                                    });
                                    isLockedMarginsOnDesktop ? setCustomMarginsOnDesktop() : setAttributes({ marginTopValue });
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Margin Bottom', 'getwid')}
                        disabled={isLockedMarginsOnDesktop ? true : null}
                        value={marginBottom !== undefined ? marginBottom : ''}
                        onChange={marginBottom => setAttributes({ marginBottom })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'custom', label: __('Custom', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                    {
                        marginBottom === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginBottomValue}
                                isLocked={isLockedMarginsOnDesktop}
                                onChange={marginBottomValue => {
                                    setAttributes({ marginBottomValue });
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Margin Left', 'getwid')}
                        disabled={isLockedMarginsOnDesktop ? true : null}
                        value={marginLeft !== undefined ? marginLeft : ''}
                        onChange={marginLeft => setAttributes({ marginLeft })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'custom', label: __('Custom', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                    {
                        marginLeft === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginLeftValue}
                                isLocked={isLockedMarginsOnDesktop}
                                onChange={marginLeftValue => {
                                    setAttributes({ marginLeftValue });
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Margin Right', 'getwid')}
                        disabled={isLockedMarginsOnDesktop ? true : null}
                        value={marginRight !== undefined ? marginRight : ''}
                        onChange={marginRight => setAttributes({ marginRight })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'custom', label: __('Custom', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                    {
                        marginRight === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginRightValue}
                                isLocked={isLockedMarginsOnDesktop}
                                onChange={marginRightValue => {
                                    setAttributes({ marginRightValue });
                                }}
                            />
                        )
                    }
                </Fragment>
            );
        }
        case 'tablet': {
            return (
                <Fragment>
                    <div className='components-base-control-with-lock'>
                        <SelectControl
                            label={__('Margin Top', 'getwid')}
                            value={marginTopTablet !== undefined ? marginTopTablet : ''}
                            onChange={marginTopTablet => {

                                const setMarginsOnTablet = () => setAttributes({
                                    marginBottomTablet: marginTopTablet,
                                    marginRightTablet: marginTopTablet,
                                    marginLeftTablet: marginTopTablet,
                                    marginTopTablet
                                });
                                isLockedMarginsOnTablet ? setMarginsOnTablet() : setAttributes({ marginTopTablet });
                            }}
                            options={[
                                { value: '', label: __('Default', 'getwid') },
                                { value: 'small', label: __('Small', 'getwid') },
                                { value: 'medium', label: __('Medium', 'getwid') },
                                { value: 'normal', label: __('Normal', 'getwid') },
                                { value: 'large', label: __('Large', 'getwid') },
                                { value: 'none', label: __('None', 'getwid') }
                            ]}
                        />
                        <IconButton
                            icon={isLockedMarginsOnTablet ? 'lock' : 'unlock'}
                            onClick={() => {
                                const setMarginsOnTablet = () => {
                                    changeState('isLockedMarginsOnTablet', true);
                                    setAttributes({
                                        marginBottomTablet: marginTopTablet,
                                        marginRightTablet: marginTopTablet,
                                        marginLeftTablet: marginTopTablet
                                    });
                                };
                                !isLockedMarginsOnTablet ? setMarginsOnTablet() : changeState('isLockedMarginsOnTablet', false);
                            }}
                            label={isLockedMarginsOnTablet ? __('Unlock', 'getwid') : __('Lock', 'getwid')}
                        />
                    </div>
                    <SelectControl
                        label={__('Margin Bottom', 'getwid')}
                        disabled={isLockedMarginsOnTablet ? true : null}
                        value={marginBottomTablet !== undefined ? marginBottomTablet : ''}
                        onChange={marginBottomTablet => setAttributes({ marginBottomTablet })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                    <SelectControl
                        label={__('Margin Left', 'getwid')}
                        disabled={isLockedMarginsOnTablet ? true : null}
                        value={marginLeftTablet !== undefined ? marginLeftTablet : ''}
                        onChange={marginLeftTablet => setAttributes({ marginLeftTablet })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />

                    <SelectControl
                        label={__('Margin Right', 'getwid')}
                        disabled={isLockedMarginsOnTablet ? true : null}
                        value={marginRightTablet !== undefined ? marginRightTablet : ''}
                        onChange={marginRightTablet => setAttributes({ marginRightTablet })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                </Fragment>
            );
        }
        case 'mobile': {
            return (
                <Fragment>
                    <div className='components-base-control-with-lock'>
                        <SelectControl
                            label={__('Margin Top', 'getwid')}
                            value={marginTopMobile !== undefined ? marginTopMobile : ''}
                            onChange={marginTopMobile => {

                                const setMarginsOnMobile = () => setAttributes({
                                    marginBottomMobile: marginTopMobile,
                                    marginRightMobile: marginTopMobile,
                                    marginLeftMobile: marginTopMobile,
                                    marginTopMobile
                                });
                                isLockedMarginsOnMobile ? setMarginsOnMobile() : setAttributes({ marginTopMobile });
                            }}
                            options={[
                                { value: '', label: __('Default', 'getwid') },
                                { value: 'small', label: __('Small', 'getwid') },
                                { value: 'medium', label: __('Medium', 'getwid') },
                                { value: 'normal', label: __('Normal', 'getwid') },
                                { value: 'large', label: __('Large', 'getwid') },
                                { value: 'none', label: __('None', 'getwid') }
                            ]}
                        />
                        <IconButton
                            icon={isLockedMarginsOnMobile ? 'lock' : 'unlock'}
                            onClick={() => {
                                const setMarginsOnMobile = () => {
                                    changeState('isLockedMarginsOnMobile', true);
                                    setAttributes({
                                        marginBottomMobile: marginTopMobile,
                                        marginRightMobile: marginTopMobile,
                                        marginLeftMobile: marginTopMobile
                                    });
                                };
                                !isLockedMarginsOnMobile ? setMarginsOnMobile() : changeState('isLockedMarginsOnMobile', false);
                            }}
                            label={isLockedMarginsOnMobile ? __('Unlock', 'getwid') : __('Lock', 'getwid')}
                        />
                    </div>
                    <SelectControl
                        label={__('Margin Bottom', 'getwid')}
                        value={marginBottomMobile !== undefined ? marginBottomMobile : ''}
                        disabled={isLockedMarginsOnMobile ? true : null}
                        onChange={marginBottomMobile => setAttributes({ marginBottomMobile })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                    <SelectControl
                        label={__('Margin Left', 'getwid')}
                        value={marginLeftMobile !== undefined ? marginLeftMobile : ''}
                        disabled={isLockedMarginsOnMobile ? true : null}
                        onChange={marginLeftMobile => setAttributes({ marginLeftMobile })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />

                    <SelectControl
                        label={__('Margin Right', 'getwid')}
                        value={marginRightMobile !== undefined ? marginRightMobile : ''}
                        disabled={isLockedMarginsOnMobile ? true : null}
                        onChange={marginRightMobile => setAttributes({ marginRightMobile })}
                        options={[
                            { value: '', label: __('Default', 'getwid') },
                            { value: 'small', label: __('Small', 'getwid') },
                            { value: 'medium', label: __('Medium', 'getwid') },
                            { value: 'normal', label: __('Normal', 'getwid') },
                            { value: 'large', label: __('Large', 'getwid') },
                            { value: 'none', label: __('None', 'getwid') }
                        ]}
                    />
                </Fragment>
            );
        }
    }
};
/* #endregion */

/* #region Font size panel (Advanced heading)*/
export const renderFontSizePanel = self => {

    const { fontSize, fontSizeTablet, fontSizeMobile } = self.props.attributes;
    const { setAttributes } = self.props;

    return (
        <Fragment>
            <TabPanel className='getwid-editor-tabs'
                activeClass='is-active'
                tabs={[
                    {
                        name: 'desktop',
                        title: __('Desktop', 'getwid'),
                        className: 'components-button is-link is-small'
                    },
                    {
                        name: 'tablet',
                        title: __('Tablet', 'getwid'),
                        className: 'components-button is-link is-small'
                    },
                    {
                        name: 'mobile',
                        title: __('Mobile', 'getwid'),
                        className: 'components-button is-link is-small'
                    }
                ]}>
                {tab => renderResponsiveFontSizeTabs(self, tab)}
            </TabPanel>
            <BaseControl>
                <Button isLink
                    onClick={() => setAttributes({
                        fontSizeTablet: 'fs-tablet-100',
                        fontSizeMobile: 'fs-mobile-100',
                        fontSize: undefined
                    })}
                    disabled={!(fontSizeTablet != 'fs-tablet-100' || fontSizeMobile != 'fs-mobile-100' || fontSize != undefined)}>
                    {__('Reset All', 'getwid')}
                </Button>
            </BaseControl>
        </Fragment>
    );
}

const renderResponsiveFontSizeTabs = (self, tab) => {

    const { fontSize, fontSizeTablet, fontSizeMobile } = self.props.attributes;
    const { setAttributes } = self.props;

    switch (tab.name) {
        case 'desktop': {
            return (
                <GetwidStyleLengthControl
                    label={__('Font Size', 'getwid')}
                    value={fontSize}
                    onChange={fontSize => setAttributes({ fontSize })}
                />
            );
        }
        case 'tablet': {
            return (
                <SelectControl
                    label={__('Font Size', 'getwid')}
                    value={fontSizeTablet}
                    onChange={fontSizeTablet => setAttributes({ fontSizeTablet })}
                    options={[
                        { value: 'fs-tablet-50', label: __('50%', 'getwid') },
                        { value: 'fs-tablet-60', label: __('60%', 'getwid') },
                        { value: 'fs-tablet-70', label: __('70%', 'getwid') },
                        { value: 'fs-tablet-80', label: __('80%', 'getwid') },
                        { value: 'fs-tablet-90', label: __('90%', 'getwid') },
                        { value: 'fs-tablet-100', label: __('100%', 'getwid') },
                        { value: 'fs-tablet-110', label: __('110%', 'getwid') },
                        { value: 'fs-tablet-120', label: __('120%', 'getwid') }
                    ]}
                />
            );
        }
        case 'mobile': {
            return (
                <SelectControl
                    label={__('Font Size', 'getwid')}
                    value={fontSizeMobile}
                    onChange={fontSizeMobile => setAttributes({ fontSizeMobile })}
                    options={[
                        { value: 'fs-mobile-50', label: __('50%', 'getwid') },
                        { value: 'fs-mobile-60', label: __('60%', 'getwid') },
                        { value: 'fs-mobile-70', label: __('70%', 'getwid') },
                        { value: 'fs-mobile-80', label: __('80%', 'getwid') },
                        { value: 'fs-mobile-90', label: __('90%', 'getwid') },
                        { value: 'fs-mobile-100', label: __('100%', 'getwid') },
                        { value: 'fs-mobile-110', label: __('110%', 'getwid') },
                        { value: 'fs-mobile-120', label: __('120%', 'getwid') }
                    ]}
                />
            );
        }
    }
}
/* #endregion */

/* #region Slide height panel (Image slider) */
export const renderSlideHeightPanel = self => {

    const { slideHeight } = self.props.attributes;
    const { setAttributes } = self.props;

    return (
        <Fragment>
            <TabPanel className='getwid-editor-tabs'
                activeClass='is-active'
                tabs={[
                    {
                        name: 'desktop',
                        title: __('Desktop', 'getwid'),
                        className: 'components-button is-link is-small'
                    },
                    {
                        name: 'tablet',
                        title: __('Tablet', 'getwid'),
                        className: 'components-button is-link is-small'
                    },
                    {
                        name: 'mobile',
                        title: __('Mobile', 'getwid'),
                        disabled: true,
                        className: 'components-button is-link is-small'
                    }
                ]}>
                {tab => renderSlideHeightTabs(self, tab)}
            </TabPanel>
            <BaseControl>
                <Button isLink
                    onClick={() => setAttributes({ slideHeight: '' })}
                    disabled={!(slideHeight != '')}>
                    {__('Reset All', 'getwid')}
                </Button>
            </BaseControl>
        </Fragment>
    );
}

const renderSlideHeightTabs = (self, tab) => {

    const { slideHeight, resetHeightOnTablet, resetHeightOnMobile } = self.props.attributes;
    const { setAttributes } = self.props;

    /* #region manage tabs panel */
    const setActivePanel = ($panel, active) => {
        const tabs = $panel.find('button[tabindex=\'-1\']');
        $.each( tabs, (index, button) => { $( button ).attr( 'disabled', active ); } );
    }

    let waitLoadPanel = setInterval( () => {
        const $tabsPanel = $( '.getwid-editor-tabs' );

        if ( $tabsPanel.length ) {
            ! slideHeight ? setActivePanel( $tabsPanel, true ) : setActivePanel( $tabsPanel, false );
            clearInterval( waitLoadPanel );
        }
    }, 1 );
    /* #endregion */

    switch (tab.name) {
        case 'desktop': {
            return (
                <GetwidStyleLengthControl
                    label={__('Slide height', 'getwid')}
                    value={slideHeight}
                    units={[
                        { label: 'px', value: 'px' },
                        { label: 'vh', value: 'vh' }
                    ]}
                    onChange={slideHeight => {
                        const $tabsPanel = $('.getwid-editor-tabs');

                        if (slideHeight) {
                            setActivePanel($tabsPanel, false);
                            setAttributes({ slideHeight });
                        } else {
                            setActivePanel($tabsPanel, true);
                            setAttributes({ slideHeight, resetHeightOnTablet: false, resetHeightOnMobile: false });
                        }
                    }}
                />
            );
        }
        case 'tablet': {
            return (
                <CheckboxControl
                    label='Reset height on tablet'
                    checked={resetHeightOnTablet}
                    onChange={value => {
                        setAttributes({ resetHeightOnTablet: value });
                    }}
                />
            );
        }
        case 'mobile': {
            return (
                <CheckboxControl
                    label='Reset height on mobile'
                    checked={resetHeightOnMobile}
                    onChange={value => {
                        setAttributes({ resetHeightOnMobile: value });
                    }}
                />
            );
        }
    }
}
/* #endregion */

/* #region Margins panel (Advance heading, icon-box, image-hotspot) */
export const renderMarginsPanel = self => {

    const { setAttributes, isLockedMargins, changeState } = self.props;
    const { marginTop, marginBottom, marginLeft, marginRight } = self.props.attributes;

    const hasMargin = () => (
        marginBottom !== undefined ||
        marginRight !== undefined ||
        marginLeft !== undefined ||
        marginTop !== undefined
    );

    const resetMargin = () => setAttributes({
        marginBottom: undefined,
        marginRight: undefined,
        marginLeft: undefined,
        marginTop: undefined
    });

    return (
        <Fragment>
            <div className='components-base-control-with-lock'>
                <GetwidStyleLengthControl
                    label={__('Margin Top', 'getwid')}
                    value={marginTop}
                    onChange={marginTop => {
                        const setMargins = () => setAttributes({
                            marginBottom: marginTop,
                            marginRight: marginTop,
                            marginLeft: marginTop,
                            marginTop
                        });
                        isLockedMargins ? setMargins() : setAttributes({ marginTop });
                    }}
                    allowNegative
                //allowAuto
                />
                <IconButton
                    icon={isLockedMargins ? 'lock' : 'unlock'}
                    onClick={() => {
                        const setMargins = () => {
                            changeState('isLockedMargins', true);
                            setAttributes({
                                marginBottom: marginTop,
                                marginRight: marginTop,
                                marginLeft: marginTop
                            });
                        };
                        !isLockedMargins ? setMargins() : changeState('isLockedMargins', false);
                    }}
                    label={isLockedMargins ? __('Unlock', 'getwid') : __('Lock', 'getwid')}
                />
            </div>
            <GetwidStyleLengthControl
                label={__('Margin Bottom', 'getwid')}
                isLocked={isLockedMargins ? true : null}
                value={marginBottom}
                onChange={marginBottom => {
                    setAttributes({ marginBottom });
                }}
                allowNegative
            //allowAuto
            />
            <GetwidStyleLengthControl
                label={__('Margin Left', 'getwid')}
                isLocked={isLockedMargins ? true : null}
                value={marginLeft}
                onChange={marginLeft => {
                    setAttributes({ marginLeft });
                }}
                allowNegative
            //allowAuto
            />
            <GetwidStyleLengthControl
                label={__('Margin Right', 'getwid')}
                isLocked={isLockedMargins ? true : null}
                value={marginRight}
                onChange={marginRight => {
                    setAttributes({ marginRight });
                }}
                allowNegative
            //allowAuto
            />
            <BaseControl>
                <Button isLink isDestructive
                    onClick={resetMargin}
                    isLocked={!hasMargin()}>
                    {__('Reset', 'getwid')}
                </Button>
            </BaseControl>
        </Fragment>
    );
};
/* #endregion */

/* #region Paddings panel (Advance heading, media&text slider) */
export const renderPaddingsPanel = that => {

    const { setAttributes, isLockedPaddings, changeState } = that.props;
    const { paddingTop, paddingBottom, paddingLeft, paddingRight } = that.props.attributes;

    const hasPadding = () => (
        paddingTop !== undefined ||
        paddingBottom !== undefined ||
        paddingRight !== undefined ||
        paddingLeft !== undefined
    );

    const resetPadding = () => setAttributes({
        paddingTop: undefined,
        paddingBottom: undefined,
        paddingLeft: undefined,
        paddingRight: undefined
    });

    return (
        <Fragment>
            <div className='components-base-control-with-lock'>
                <GetwidStyleLengthControl
                    label={__('Padding Top', 'getwid')}
                    value={paddingTop}

                    onChange={paddingTop => {
                        const setPaddings = () => setAttributes({
                            paddingBottom: paddingTop,
                            paddingRight: paddingTop,
                            paddingLeft: paddingTop,
                            paddingTop
                        });
                        isLockedPaddings ? setPaddings() : setAttributes({ paddingTop });
                    }}
                    allowNegative
                //allowAuto
                />
                <IconButton
                    icon={isLockedPaddings ? 'lock' : 'unlock'}
                    onClick={() => {
                        const setPaddings = () => {
                            changeState('isLockedPaddings', true);
                            setAttributes({
                                paddingBottom: paddingTop,
                                paddingRight: paddingTop,
                                paddingLeft: paddingTop
                            });
                        };
                        !isLockedPaddings ? setPaddings() : changeState('isLockedPaddings', false);
                    }}
                    label={isLockedPaddings ? __('Unlock', 'getwid') : __('Lock', 'getwid')}
                />
            </div>

            <GetwidStyleLengthControl
                label={__('Padding Bottom', 'getwid')}
                isLocked={isLockedPaddings ? true : null}
                value={paddingBottom}
                onChange={paddingBottom => {
                    setAttributes({ paddingBottom });
                }}
            />
            <GetwidStyleLengthControl
                label={__('Padding Left', 'getwid')}
                isLocked={isLockedPaddings ? true : null}
                value={paddingLeft}
                onChange={paddingLeft => {
                    setAttributes({ paddingLeft });
                }}
            />
            <GetwidStyleLengthControl
                label={__('Padding Right', 'getwid')}
                isLocked={isLockedPaddings ? true : null}
                value={paddingRight}
                onChange={paddingRight => {
                    setAttributes({ paddingRight });
                }}
            />
            <BaseControl>
                <Button isLink isDestructive
                    onClick={resetPadding}
                    disabled={!hasPadding()}>
                    {__('Reset', 'getwid')}
                </Button>
            </BaseControl>
        </Fragment>
    );
}
/* #endregion */

/* #region Point settings panel (Image hot spot) */
export const renderPointSettingsPanel = self => {

    return (
        <TabPanel className={'getwid-editor-tabs left'}
            activeClass={'is-active'}
            tabs={[
                {
                    name: 'content',
                    title: __( 'Content', 'getwid' ),
                    className: 'components-button is-link is-small'
                },
                {
                    name: 'poisition',
                    title: __( 'Poisition', 'getwid' ),
                    className: 'components-button is-link is-small'
                },
                {
                    name: 'style',
                    title: __( 'Style', 'getwid' ),
                    className: 'components-button is-link is-small'
                }
            ]}>
            { tab => renderPointSettingsTabs( self, tab ) }
        </TabPanel>
    );
}

const renderPointSettingsTabs = (self, tab) => {

    const { imagePoints } = self.props.attributes;
    const { getState, updateArrValues, changeState } = self.props;

    const points = imagePoints ? JSON.parse( imagePoints ) : [];    
    const index = getState( 'currentPoint' );

    switch ( tab.name ) {
        case 'content': {
            return (
                <Fragment>
                    <TextControl
                        label={__( 'Title', 'getwid' )}
                        value={points[ index ].title}
                        onChange={value => {
                            updateArrValues( { title: value }, index );
                        }}
                    />
                    <TextControl
                        placeholder={__( 'Enter URL', 'getwid' )}
                        value={points[ index ].link}
                        onChange={value => {
                            updateArrValues( { link: value }, index);
                        }}
                    />
                    <ToggleControl
                        label={__( 'Open in New Tab', 'getwid' )}
                        checked={points[ index ].newTab}
                        onChange={value => {
                            updateArrValues( { newTab: value }, index );
                        }}
                    />
                    <TextareaControl
                        label={__( 'Popup Content. Plain Text or HTML.', 'getwid' )}
                        rows={'5'}
                        value={unescape( points[ index ].content )}
                        onChange={value => {
                            updateArrValues( { content: escape( value ) }, index );
                        }}
                    />
                    <ToggleControl
                        label={__( 'Opened by default', 'getwid' )}
                        checked={points[ index ].popUpOpen}
                        onChange={ value => {
                            updateArrValues( { popUpOpen: value }, index );
                        } }
                    />
                </Fragment>
            );
        }
        case 'poisition': {
            return (
                <Fragment>
                    <RangeControl
                        label={__( 'X Coord (%)', 'getwid' )}
                        value={parseFloat( points[ index ].position.x )}
                        onChange={value => {
                            if (typeof value == 'undefined') {
                                value = 50;
                            }

                            updateArrValues( {
                                position: {
                                    x: parseFloat( value ) + '%',
                                    y: points[ index ].position.y
                                }
                            }, index );
                        }}
                        allowReset
                        min={0}
                        max={100}
                        step={0.5}
                    />
                    <RangeControl
                        label={__( 'Y Coord (%)', 'getwid' )}
                        value={parseFloat( points[ index ].position.y )}
                        onChange={value => {
                            if ( typeof value == 'undefined' ) {
                                value = 50;
                            }

                            updateArrValues( {
                                position: {
                                    x: points[ index ].position.x,
                                    y: parseFloat( value ) + '%'
                                }
                            }, index );
                        }}
                        allowReset
                        min={0}
                        max={100}
                        step={0.5}
                    />
                    <RadioControl
                        label={__( 'Tooltip Position', 'getwid' )}
                        selected={points[ index ].placement}
                        options={[
                            { value: 'top'   , label: __( 'Top'   , 'getwid' ) },
                            { value: 'right' , label: __( 'Right' , 'getwid' ) },
                            { value: 'bottom', label: __( 'Bottom', 'getwid' ) },
                            { value: 'left'  , label: __( 'Left'  , 'getwid' ) }
                        ]}
                        onChange={value => {
                            updateArrValues( { placement: value }, index );
                            changeState( {
                                updatePoints: true,
                                highlightDot: true
                            } );
                        }}
                    />
                    <TextControl
                        label={__( 'Popup Maximum Width, px.', 'getwid' )}
                        value={points[ index ].popUpWidth}
                        type={'number'}
                        onChange={value => {
                            updateArrValues( { popUpWidth: value }, index );
                        }}
                    />
                </Fragment>
            );
        }
        case 'style': {
            return (
                <Fragment>
                    <BaseControl
                        label={__( 'Point Icon', 'getwid' )}
                    >
                        <GetwidIconPicker
                            value={points[ index ].icon}
                            onChange={value => {
                                updateArrValues( { icon: value }, index );
                                changeState( {
                                    updatePoints: true,
                                    highlightDot: true
                                } );
                            }}
                        />
                    </BaseControl>

                    <GetwidCustomColorPalette
                        colorSettings={[
                            {
                                title: __( 'Point Background', 'getwid' ),
                                colors: {
                                    customColor: points[ index ].backgroundColor
                                },
                                changeColor: value => {
                                    updateArrValues( { backgroundColor: value }, index );
                                    changeState( {
                                        updatePoints: true,
                                        highlightDot: true
                                    } );
                                }
                            },
                            {
                                title: __( 'Icon Color', 'getwid' ),
                                colors: {
                                    customColor: points[ index ].color
                                },
                                changeColor: value => {
                                    updateArrValues( { color: value }, index );
                                    changeState( {
                                        updatePoints: true,
                                        highlightDot: true
                                    } );
                                }
                            }
                        ]}
                    />
                </Fragment>
            );
        }
    }
}
/* #endregion */