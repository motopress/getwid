/**
 * Internal dependencies
 */
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

const { Fragment } = wp.element;
const { SelectControl, PanelBody, TabPanel, BaseControl, Button, IconButton, CheckboxControl } = wp.components;

/* #region Paddings panel ( Section, Post featured background image ) */
export const renderPaddingsPanel = self => {

    const resetPadding = () => {

		const { setAttributes } = self.props;
                
        setAttributes( {
            paddingTopValue   : undefined,
            paddingBottomValue: undefined,
            paddingLeftValue  : undefined,
            paddingRightValue : undefined,

            paddingTop   : '',
            paddingBottom: '',
            paddingLeft  : '',
            paddingRight : '',

            paddingTopTablet   : '',
            paddingBottomTablet: '',
            paddingLeftTablet  : '',
            paddingRightTablet : '',

            paddingTopMobile   : '',
            paddingBottomMobile: '',
            paddingLeftMobile  : '',
            paddingRightMobile : ''
        } );
    };

    return (
        <PanelBody title={__( 'Padding', 'getwid' )} initialOpen={false}>
            <TabPanel className='getwid-editor-tabs'
                    activeClass='is-active'
                    tabs={ [
                        {
                            name: 'desktop',
                            title: __( 'Desktop', 'getwid' ),
                            className: 'components-button is-link is-small'
                        },
                        {
                            name: 'tablet',
                            title: __( 'Tablet', 'getwid' ),
                            className: 'components-button is-link is-small'
                        },
                        {
                            name: 'mobile',
                            title: __( 'Mobile', 'getwid' ),
                            className: 'components-button is-link is-small'
                        }
                    ] }>
                {
                    tab => renderResponsivePaddingsTabs( self, tab )
                }
            </TabPanel>
            <BaseControl>
                <Button isLink
                    onClick={resetPadding}
                    disabled={ ! hasPadding( self ) }>
                    {__( 'Reset All', 'getwid' )}
                </Button>
            </BaseControl>
        </PanelBody>
    );
}

const hasPadding = self => {

    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = self.props.attributes;
    const { paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue } = self.props.attributes;

    const { paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet } = self.props.attributes;
    const { paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile } = self.props.attributes;

    return paddingTopValue !== undefined ||
        paddingBottomValue !== undefined ||
        paddingRightValue  !== undefined ||
        paddingLeftValue   !== undefined ||

        paddingTop    !== '' ||
        paddingRight  !== '' ||
        paddingBottom !== '' ||
        paddingLeft   !== '' ||

        paddingTopTablet    !== '' ||
        paddingRightTablet  !== '' ||
        paddingBottomTablet !== '' ||
        paddingLeftTablet   !== '' ||

        paddingTopMobile    !== '' ||
        paddingRightMobile  !== '' ||
        paddingBottomMobile !== '' ||
        paddingLeftMobile   !== '';
};

const renderResponsivePaddingsTabs = ( self, tab ) => {

    const { setAttributes } = self.props;
    const { changeState, isLockedDesktop, isLockedTablet, isLockedMobile, } = self.props;

    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = self.props.attributes;
    const { paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue } = self.props.attributes;

    const { paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet } = self.props.attributes;
    const { paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile } = self.props.attributes;

    switch ( tab.name ) {
        case 'desktop': {
            return(
                <Fragment>
                    <div className='components-base-control-with-lock'>
                        <SelectControl
                            label={__( 'Padding Top', 'getwid' )}
                            value={paddingTop !== undefined ? paddingTop : ''}
                            onChange={paddingTop => {
                                const setAllPaddings = () => {
                                    setAttributes( {
                                        paddingBottom: paddingTop,
                                        paddingLeft  : paddingTop,
                                        paddingRight : paddingTop,
                                        paddingTop
                                    } );
                                };
                                isLockedDesktop ? setAllPaddings() : setAttributes( { paddingTop } );
                            }}
                            options={[
                                { value: ''      , label: __( 'Default', 'getwid' ) },
                                { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                                { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                                { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                                { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                                { value: 'custom', label: __( 'Custom' , 'getwid' ) },
                                { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                            ]}
                        />
                        <IconButton
                            icon={ isLockedDesktop ? 'lock' : 'unlock' } 
                            onClick={() => {
                                const disableSelect = () => {                                    
                                    const setCustomPaddings = () => {
                                        changeState( 'isLockedDesktop', true );
                                        setAttributes( {
                                            paddingBottom: paddingTop,
                                            paddingLeft  : paddingTop,
                                            paddingRight : paddingTop,

                                            paddingBottomValue: paddingTopValue,
                                            paddingLeftValue  : paddingTopValue,
                                            paddingRightValue : paddingTopValue
                                        } );
                                    };

                                    const setPaddingsType = () => {
                                        changeState( 'isLockedDesktop', true );
                                        setAttributes( {
                                            paddingBottom: paddingTop,
                                            paddingLeft  : paddingTop,
                                            paddingRight : paddingTop
                                        } );
                                    }
                                    paddingTop =='custom' ? setCustomPaddings() : setPaddingsType();
                                };
                                ! isLockedDesktop ? disableSelect() : changeState( 'isLockedDesktop', false );
                            }}
                            label={__( isLockedDesktop ? 'Lock' : 'Unlock', 'getwid' )}
                        />
                    </div>
                    {
                        paddingTop === 'custom' && (
                            <GetwidStyleLengthControl                                
                                value={paddingTopValue}                                
                                onChange={paddingTopValue => {
                                    const setAllCustomPaddings = () => {
                                        setAttributes( {
                                            paddingBottomValue: paddingTopValue,
                                            paddingLeftValue  : paddingTopValue,
                                            paddingRightValue : paddingTopValue,
                                            paddingTopValue
                                        } );
                                    };
                                    isLockedDesktop ? setAllCustomPaddings() : setAttributes( { paddingTopValue } );
                                }}
                            />
                        )                            
                    }
                    <SelectControl
                        label={__( 'Padding Bottom', 'getwid' )}
                        disabled={ isLockedDesktop ? true : null }
                        value={paddingBottom !== undefined ? paddingBottom : ''}
                        onChange={paddingBottom => setAttributes( { paddingBottom } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'custom', label: __( 'Custom' , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    {
                        paddingBottom === 'custom' && (
                            <GetwidStyleLengthControl
                                value={paddingBottomValue}
                                isLocked={isLockedDesktop}
                                onChange={paddingBottomValue => {
                                    setAttributes( { paddingBottomValue } );
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__( 'Padding Left', 'getwid' )}
                        disabled={ isLockedDesktop ? true : null }
                        value={paddingLeft !== undefined ? paddingLeft : ''}
                        onChange={paddingLeft => setAttributes( { paddingLeft } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'custom', label: __( 'Custom' , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    {
                        paddingLeft === 'custom' && (
                            <GetwidStyleLengthControl
                                value={paddingLeftValue}
                                isLocked={isLockedDesktop}
                                onChange={paddingLeftValue => {
                                    setAttributes( { paddingLeftValue } );
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__( 'Padding Right', 'getwid' )}
                        disabled={ isLockedDesktop ? true : null }
                        value={paddingRight !== undefined ? paddingRight : ''}
                        onChange={paddingRight => setAttributes( { paddingRight } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'custom', label: __( 'Custom' , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    {
                        paddingRight === 'custom' && (
                            <GetwidStyleLengthControl
                                value={paddingRightValue}
                                isLocked={isLockedDesktop}
                                onChange={paddingRightValue => {
                                    setAttributes( { paddingRightValue } );
                                }}
                            />
                        )
                    }
                </Fragment>
            );
        }
        case 'tablet': {
            return(
                <Fragment>
                    <div className='components-base-control-with-lock'>
                        <SelectControl
                            label={__( 'Padding Top', 'getwid' )}
                            value={paddingTopTablet !== undefined ? paddingTopTablet : ''}
                            onChange={paddingTopTablet => {
                                const setAllPaddings = () => {
                                    setAttributes( {
                                        paddingBottomTablet: paddingTopTablet,
                                        paddingLeftTablet  : paddingTopTablet,
                                        paddingRightTablet : paddingTopTablet,
                                        paddingTopTablet
                                    } );
                                };
                                isLockedTablet ? setAllPaddings() : setAttributes( { paddingTopTablet } );
                            }}
                            options={[
                                { value: ''      , label: __( 'Default', 'getwid' ) },
                                { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                                { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                                { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                                { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                                { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                            ]}
                        />
                        <IconButton
                            icon={ isLockedTablet ? 'lock' : 'unlock' } 
                            onClick={() => {
                                const disableSelect = () => {
                                    changeState( 'isLockedTablet', true );
                                    setAttributes( {
                                        paddingBottomTablet: paddingTopTablet,
                                        paddingLeftTablet  : paddingTopTablet,
                                        paddingRightTablet : paddingTopTablet,
                                    });
                                };
                                ! isLockedTablet ? disableSelect() : changeState( 'isLockedTablet', false ); //setAttributes( { isLockedTablet: false } );
                            }}
                            label={__( isLockedTablet ? 'Lock' : 'Unlock', 'getwid' )}
                        />
                    </div>
                    
                    <SelectControl
                        label={__( 'Padding Bottom', 'getwid' )}
                        disabled={ isLockedTablet ? true : null }
                        value={paddingBottomTablet !== undefined ? paddingBottomTablet : ''}
                        onChange={paddingBottomTablet => setAttributes( { paddingBottomTablet } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    <SelectControl
                        label={__( 'Padding Left', 'getwid' )}
                        disabled={ isLockedTablet ? true : null }
                        value={paddingLeftTablet !== undefined ? paddingLeftTablet : ''}
                        onChange={paddingLeftTablet => setAttributes( { paddingLeftTablet } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />

                    <SelectControl
                        label={__( 'Padding Right', 'getwid' )}
                        disabled={ isLockedTablet ? true : null }
                        value={paddingRightTablet !== undefined ? paddingRightTablet : ''}
                        onChange={paddingRightTablet => setAttributes( { paddingRightTablet } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                </Fragment>
            );
        }
        case 'mobile': {
            return(
                <Fragment>
                    <div className='components-base-control-with-lock'>
                        <SelectControl
                            label={__( 'Padding Top', 'getwid' )}
                            value={paddingTopMobile !== undefined ? paddingTopMobile : ''}
                            onChange={paddingTopMobile => {
                                const setAllPaddings = () => {
                                    setAttributes( {
                                        paddingBottomMobile: paddingTopMobile,
                                        paddingLeftMobile  : paddingTopMobile,
                                        paddingRightMobile : paddingTopMobile,
                                        paddingTopMobile
                                    } );
                                };
                                isLockedMobile ? setAllPaddings() : setAttributes( { paddingTopMobile } );
                            }}
                            options={[
                                { value: ''      , label: __( 'Default', 'getwid' ) },
                                { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                                { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                                { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                                { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                                { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                            ]}
                        />
                        <IconButton
                            icon={ isLockedMobile ? 'lock' : 'unlock' } 
                            onClick={() => {
                                const disableSelect = () => {
                                    changeState( 'isLockedMobile', true );
                                    setAttributes( {
                                        paddingBottomMobile: paddingTopMobile,
                                        paddingLeftMobile  : paddingTopMobile,
                                        paddingRightMobile : paddingTopMobile,
                                    } );
                                };

                                ! isLockedMobile ? disableSelect() : changeState( 'isLockedMobile', false ); //setAttributes( { isLockedMobile: false } );
                            }}
                            label={__( isLockedMobile ? 'Lock' : 'Unlock', 'getwid' )}
                        />
                    </div>
                    <SelectControl
                        label={__( 'Padding Bottom', 'getwid' )}
                        disabled={ isLockedMobile ? true : null }
                        value={paddingBottomMobile !== undefined ? paddingBottomMobile : ''}
                        onChange={paddingBottomMobile => setAttributes( { paddingBottomMobile } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    <SelectControl
                        label={__( 'Padding Left', 'getwid' )}
                        disabled={ isLockedMobile ? true : null }
                        value={paddingLeftMobile !== undefined ? paddingLeftMobile : ''}
                        onChange={paddingLeftMobile => setAttributes( { paddingLeftMobile } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />

                    <SelectControl
                        label={__( 'Padding Right', 'getwid' )}
                        disabled={ isLockedMobile ? true : null }
                        value={paddingRightMobile !== undefined ? paddingRightMobile : ''}
                        onChange={paddingRightMobile => setAttributes( { paddingRightMobile } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                </Fragment>
            );
        }
    }
};
/* #endregion */

/* #region Margin panel ( Section ) */
export const renderMarginsPanel = self => {

    const resetMargin = () => {

        const { setAttributes } = self.props;

        setAttributes( {
            marginTopValue   : undefined,
            marginBottomValue: undefined,
            marginLeftValue  : undefined,
            marginRightValue : undefined,

            marginTop   : '',
            marginBottom: '',
            marginLeft  : '',
            marginRight : '',

            marginTopTablet   : '',
            marginBottomTablet: '',
            marginLeftTablet  : '',
            marginRightTablet : '',

            marginTopMobile   : '',
            marginBottomMobile: '',
            marginLeftMobile  : '',
            marginRightMobile : ''
        } );
    };

    return (
        <PanelBody title={ __( 'Margin', 'getwid' ) } initialOpen={false}>
            <TabPanel className='getwid-editor-tabs'
                    activeClass='is-active'
                    tabs={ [
                        {
                            name: 'desktop',
                            title: __( 'Desktop', 'getwid' ),
                            className: 'components-button is-link is-small',
                        },
                        {
                            name: 'tablet',
                            title: __( 'Tablet', 'getwid' ),
                            className: 'components-button is-link is-small',
                        },
                        {
                            name: 'mobile',
                            title: __( 'Mobile', 'getwid' ),
                            className: 'components-button is-link is-small',
                        }
                    ] }>
                { tab => renderResponsiveMarginsTabs( self, tab ) }
            </TabPanel>
            <BaseControl>
                <Button isLink
                        onClick={resetMargin}
                        disabled={ ! hasMargin( self ) }>
                    {__( 'Reset All', 'getwid' )}
                </Button>
            </BaseControl>
        </PanelBody>
    );
};

const hasMargin = self => {

    const { marginTop, marginRight, marginBottom, marginLeft } = self.props.attributes;
    const { marginTopValue, marginRightValue, marginBottomValue, marginLeftValue } = self.props.attributes;
    
    const { marginTopTablet, marginRightTablet, marginBottomTablet, marginLeftTablet } = self.props.attributes;
    const { marginTopMobile, marginRightMobile, marginBottomMobile, marginLeftMobile } = self.props.attributes;

    return marginTopValue !== undefined ||
        marginBottomValue !== undefined ||
        marginRightValue  !== undefined ||
        marginLeftValue   !== undefined ||

        marginTop    !== '' ||
        marginRight  !== '' ||
        marginBottom !== '' ||
        marginLeft   !== '' ||

        marginTopTablet    !== '' ||
        marginRightTablet  !== '' ||
        marginBottomTablet !== '' ||
        marginLeftTablet   !== '' ||

        marginTopMobile    !== '' ||
        marginRightMobile  !== '' ||
        marginBottomMobile !== '' ||
        marginLeftMobile   !== '';
};

const renderResponsiveMarginsTabs = ( self, tab ) => {

    const { marginTop, marginRight, marginBottom, marginLeft } = self.props.attributes;
    const { marginTopValue, marginRightValue, marginBottomValue, marginLeftValue } = self.props.attributes;

    const { marginTopTablet, marginRightTablet, marginBottomTablet, marginLeftTablet } = self.props.attributes;
    const { marginTopMobile, marginRightMobile, marginBottomMobile, marginLeftMobile } = self.props.attributes;

    switch ( tab.name ) {
        case 'desktop': {
            return (
                <Fragment>
                    <SelectControl
                        label={__( 'Margin Top', 'getwid' )}
                        value={marginTop !== undefined ? marginTop : ''}
                        onChange={marginTop => setAttributes( { marginTop } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'custom', label: __( 'Custom' , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    {
                        marginTop === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginTopValue}
                                onChange={marginTopValue => {
                                    setAttributes( { marginTopValue } );
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__( 'Margin Bottom', 'getwid' )}
                        value={marginBottom !== undefined ? marginBottom : ''}
                        onChange={marginBottom => setAttributes( { marginBottom } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'custom', label: __( 'Custom' , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    {
                        marginBottom === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginBottomValue}
                                onChange={marginBottomValue => {
                                    setAttributes( { marginBottomValue } );
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__( 'Margin Left', 'getwid' )}
                        value={marginLeft !== undefined ? marginLeft : ''}
                        onChange={marginLeft => setAttributes( { marginLeft } )}
                        options={[
                            { value: ''      , label: __('Default', 'getwid') },
                            { value: 'small' , label: __('Small'  , 'getwid') },
                            { value: 'medium', label: __('Medium' , 'getwid') },
                            { value: 'normal', label: __('Normal' , 'getwid') },
                            { value: 'large' , label: __('Large'  , 'getwid') },
                            { value: 'custom', label: __('Custom' , 'getwid') },
                            { value: 'none'  , label: __('None'   , 'getwid') }
                        ]}
                    />
                    {
                        marginLeft === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginLeftValue}
                                onChange={marginLeftValue => {
                                    setAttributes({marginLeftValue});
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__( 'Margin Right', 'getwid' )}
                        value={marginRight !== undefined ? marginRight : ''}
                        onChange={marginRight => setAttributes( { marginRight } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'custom', label: __( 'Custom' , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    {
                        marginRight === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginRightValue}
                                onChange={marginRightValue => {
                                    setAttributes( { marginRightValue } );
                                }}
                            />
                        )
                    }
                </Fragment>
            );
        }
        case 'tablet': {
            return(
                <Fragment>
                    <SelectControl
                        label={__( 'Margin Top', 'getwid' )}
                        value={marginTopTablet !== undefined ? marginTopTablet : ''}
                        onChange={marginTopTablet => setAttributes( { marginTopTablet } )}
                        options={[
                            { value: ''      , label: __('Default', 'getwid' ) },
                            { value: 'small' , label: __('Small'  , 'getwid' ) },
                            { value: 'medium', label: __('Medium' , 'getwid' ) },
                            { value: 'normal', label: __('Normal' , 'getwid' ) },
                            { value: 'large' , label: __('Large'  , 'getwid' ) },
                            { value: 'none'  , label: __('None'   , 'getwid' ) }
                        ]}
                    />
                    <SelectControl
                        label={__( 'Margin Bottom', 'getwid' )}
                        value={marginBottomTablet !== undefined ? marginBottomTablet : ''}
                        onChange={marginBottomTablet => setAttributes( { marginBottomTablet } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    <SelectControl
                        label={__( 'Margin Left', 'getwid' )}
                        value={marginLeftTablet !== undefined ? marginLeftTablet : ''}
                        onChange={marginLeftTablet => setAttributes( { marginLeftTablet } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />

                    <SelectControl
                        label={__( 'Margin Right', 'getwid' )}
                        value={marginRightTablet !== undefined ? marginRightTablet : ''}
                        onChange={marginRightTablet => setAttributes( { marginRightTablet } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                </Fragment>
            );
        }
        case 'mobile': {
            return(
                <Fragment>
                    <SelectControl
                        label={__( 'Margin Top', 'getwid')}
                        value={marginTopMobile !== undefined ? marginTopMobile : ''}
                        onChange={marginTopMobile => setAttributes( { marginTopMobile } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    <SelectControl
                        label={__( 'Margin Bottom', 'getwid' )}
                        value={marginBottomMobile !== undefined ? marginBottomMobile : ''}
                        onChange={marginBottomMobile => setAttributes( { marginBottomMobile } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />
                    <SelectControl
                        label={__( 'Margin Left', 'getwid' )}
                        value={marginLeftMobile !== undefined ? marginLeftMobile : ''}
                        onChange={marginLeftMobile => setAttributes( { marginLeftMobile  })}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
                        ]}
                    />

                    <SelectControl
                        label={__( 'Margin Right', 'getwid' )}
                        value={marginRightMobile !== undefined ? marginRightMobile : ''}
                        onChange={marginRightMobile => setAttributes( { marginRightMobile } )}
                        options={[
                            { value: ''      , label: __( 'Default', 'getwid' ) },
                            { value: 'small' , label: __( 'Small'  , 'getwid' ) },
                            { value: 'medium', label: __( 'Medium' , 'getwid' ) },
                            { value: 'normal', label: __( 'Normal' , 'getwid' ) },
                            { value: 'large' , label: __( 'Large'  , 'getwid' ) },
                            { value: 'none'  , label: __( 'None'   , 'getwid' ) }
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

    const { fontSizeTablet, fontSizeMobile } = self.props.attributes;
    const { setAttributes } = self.props;

    return (
        <Fragment>
            <TabPanel className='getwid-editor-tabs'
                activeClass='is-active'
                tabs={[
                    {
                        name: 'desktop',
                        title: __( 'Desktop', 'getwid' ),
                        className: 'components-button is-link is-small'
                    },
                    {
                        name: 'tablet',
                        title: __( 'Tablet', 'getwid' ),
                        className: 'components-button is-link is-small'
                    },
                    {
                        name: 'mobile',
                        title: __( 'Mobile', 'getwid' ),
                        className: 'components-button is-link is-small'
                    }
                ]}>
                { tab => renderResponsiveFontSizeTabs( self, tab ) }
            </TabPanel>
            <BaseControl>
                <Button isLink
                    onClick={() => setAttributes( { fontSizeTablet: '', fontSizeMobile: '' } )}
                    disabled={! ( fontSizeTablet != '' || fontSizeMobile != '' )}>
                    {__( 'Reset All', 'getwid' )}
                </Button>
            </BaseControl>
        </Fragment>
    );
}

const renderResponsiveFontSizeTabs = ( self, tab ) => {

    const { fontSize, fontSizeTablet, fontSizeMobile } = self.props.attributes;
    const { setAttributes } = self.props;

    switch ( tab.name ) {
        case 'desktop': {
            return (
                <GetwidStyleLengthControl
                    label={__( 'Font Size', 'getwid' )}
                    value={fontSize}
                    onChange={ fontSize => setAttributes( { fontSize } ) }
                />
            );
        }
        case 'tablet': {
            return (
                <SelectControl
                    label={__( 'Font Size', 'getwid' )}
                    value={fontSizeTablet}
                    onChange={fontSizeTablet => setAttributes( { fontSizeTablet } )}
                    options={[
                        { value: ''       , label: __( 'Default', 'getwid' ) },
                        { value: 'small'  , label: __( 'Small'  , 'getwid' ) },
                        { value: 'normal' , label: __( 'Normal' , 'getwid' ) },
                        { value: 'large'  , label: __( 'Large'  , 'getwid' ) },
                        { value: 'huge'   , label: __( 'Huge'   , 'getwid' ) }
                    ]}
                />
            );
        }
        case 'mobile': {
            return (
                <SelectControl
                    label={__( 'Font Size', 'getwid' )}
                    value={fontSizeMobile}
                    onChange={fontSizeMobile => setAttributes( { fontSizeMobile } )}
                    options={[
                        { value: ''       , label: __( 'Default' , 'getwid') },
                        { value: 'small'  , label: __( 'Small'   , 'getwid') },
                        { value: 'normal' , label: __( 'Normal'  , 'getwid') },
                        { value: 'large'  , label: __( 'Large'   , 'getwid') },
                        { value: 'huge'   , label: __( 'Huge'    , 'getwid') }
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
                        title: __( 'Desktop', 'getwid' ),
                        className: 'components-button is-link is-small'
                    },
                    {
                        name: 'tablet',
                        title: __( 'Tablet', 'getwid' ),
                        className: 'components-button is-link is-small'
                    },
                    {
                        name: 'mobile',
                        title: __( 'Mobile', 'getwid' ),
                        className: 'components-button is-link is-small'
                    }
                ]}>
                { tab => renderSlideHeightTabs( self, tab ) }
            </TabPanel>
            <BaseControl>
                <Button isLink
                    onClick={() => setAttributes( { slideHeight: '' } )}
                    disabled={! ( slideHeight != '' )}>
                    {__( 'Reset All', 'getwid' )}
                </Button>
            </BaseControl>
        </Fragment>
    );
}

const renderSlideHeightTabs = ( self, tab ) => {

    const { slideHeight, resetHeightOnTablet, resetHeightOnMobile } = self.props.attributes;
    const { setAttributes } = self.props;

    switch ( tab.name ) {
        case 'desktop': {
            return (
                <GetwidStyleLengthControl
                    label={__( 'Slide height', 'getwid' )}
                    value={slideHeight}
                    units={[
                        { label: 'px', value: 'px' },
                        { label: 'vh', value: 'vh' }
                    ]}                    
                    onChange={ slideHeight => setAttributes( { slideHeight } ) }
                />
            );
        }
        case 'tablet': {
            return (
                <CheckboxControl
                    label='Reset height on tablet'
                    checked={resetHeightOnTablet == 'true' ? true : false}
                    onChange={value => {
                        setAttributes( { resetHeightOnTablet: value ? 'true' : 'false' } );
                    }}
                />
            );
        }
        case 'mobile': {
            return (
                <CheckboxControl
                    label='Reset height on mobile'
                    checked={resetHeightOnMobile == 'true' ? true : false}
                    onChange={value => {
                        setAttributes( { resetHeightOnMobile: value ? 'true' : 'false' } );
                    }}
                />
            );
        }
    }
}
/* #endregion */