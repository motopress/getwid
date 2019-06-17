import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
/**
* Module Constants
*/
const $ = window.jQuery;


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	Fragment,
} = wp.element;
const {
	SelectControl,
	PanelBody,
	TabPanel,
	BaseControl,
	Button,
} = wp.components;


export function renderPaddingsPanel(obj) {

    const resetPadding = () => {
		const {
			setAttributes,
        } = obj.props;
                
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
            paddingRightMobile: '',
        })
    };

    return (
        <PanelBody title={__('Padding', 'getwid')} initialOpen={false}>
            <TabPanel className="getwid-editor-tabs"
                    activeClass="is-active"
                    tabs={ [
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
                        },
                    ] }>
                {
                    (tab) => renderResponsivePaddingsTabs(obj, tab)
                }
            </TabPanel>
            <BaseControl>
                <Button isLink
                    onClick={resetPadding}
                    disabled={ !hasPadding(obj) }>
                    {__('Reset All', 'getwid')}
                </Button>
            </BaseControl>
        </PanelBody>
    );

}

function hasPadding(obj) {
    const {attributes: {
        paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
        paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,
    }} = obj.props;
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
}

function renderResponsivePaddingsTabs( obj, tab ){

    const{
        attributes:{
            paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue,
            paddingTop, paddingRight, paddingBottom, paddingLeft,
            paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
            paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,
        },
        setAttributes
    } = obj.props;

    switch (tab.name){
        case 'desktop': {
            return(
                <Fragment>
                    <SelectControl
                        label={__('Padding Top', 'getwid')}
                        value={paddingTop !== undefined ? paddingTop : ''}
                        onChange={paddingTop => setAttributes({paddingTop})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'custom', label: __('Custom', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    {
                        paddingTop === 'custom' && (
                            <GetwidStyleLengthControl
                                value={paddingTopValue}
                                onChange={paddingTopValue => {
                                    setAttributes({paddingTopValue});
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Padding Bottom', 'getwid')}
                        value={paddingBottom !== undefined ? paddingBottom : ''}
                        onChange={paddingBottom => setAttributes({paddingBottom})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'custom', label: __('Custom', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    {
                        paddingBottom === 'custom' && (
                            <GetwidStyleLengthControl
                                // label={__('Custom Bottom', 'getwid')}
                                value={paddingBottomValue}
                                onChange={paddingBottomValue => {
                                    setAttributes({paddingBottomValue});
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Padding Left', 'getwid')}
                        value={paddingLeft !== undefined ? paddingLeft : ''}
                        onChange={paddingLeft => setAttributes({paddingLeft})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'custom', label: __('Custom', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    {
                        paddingLeft === 'custom' && (
                            <GetwidStyleLengthControl
                                value={paddingLeftValue}
                                onChange={paddingLeftValue => {
                                    setAttributes({paddingLeftValue});
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Padding Right', 'getwid')}
                        value={paddingRight !== undefined ? paddingRight : ''}
                        onChange={paddingRight => setAttributes({paddingRight})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'custom', label: __('Custom', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    {
                        paddingRight === 'custom' && (
                            <GetwidStyleLengthControl
                                // label={__('Custom Right', 'getwid')}
                                value={paddingRightValue}
                                onChange={paddingRightValue => {
                                    setAttributes({paddingRightValue});
                                }}
                            />
                        )
                    }
                </Fragment>
            )
        }
        case 'tablet': {
            return(
                <Fragment>
                    <SelectControl
                        label={__('Padding Top', 'getwid')}
                        value={paddingTopTablet !== undefined ? paddingTopTablet : ''}
                        onChange={paddingTopTablet => setAttributes({paddingTopTablet})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    <SelectControl
                        label={__('Padding Bottom', 'getwid')}
                        value={paddingBottomTablet !== undefined ? paddingBottomTablet : ''}
                        onChange={paddingBottomTablet => setAttributes({paddingBottomTablet})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    <SelectControl
                        label={__('Padding Left', 'getwid')}
                        value={paddingLeftTablet !== undefined ? paddingLeftTablet : ''}
                        onChange={paddingLeftTablet => setAttributes({paddingLeftTablet})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />

                    <SelectControl
                        label={__('Padding Right', 'getwid')}
                        value={paddingRightTablet !== undefined ? paddingRightTablet : ''}
                        onChange={paddingRightTablet => setAttributes({paddingRightTablet})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                </Fragment>
            )
        }
        case 'mobile': {
            return(
                <Fragment>
                    <SelectControl
                        label={__('Padding Top', 'getwid')}
                        value={paddingTopMobile !== undefined ? paddingTopMobile : ''}
                        onChange={paddingTopMobile => setAttributes({paddingTopMobile})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    <SelectControl
                        label={__('Padding Bottom', 'getwid')}
                        value={paddingBottomMobile !== undefined ? paddingBottomMobile : ''}
                        onChange={paddingBottomMobile => setAttributes({paddingBottomMobile})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    <SelectControl
                        label={__('Padding Left', 'getwid')}
                        value={paddingLeftMobile !== undefined ? paddingLeftMobile : ''}
                        onChange={paddingLeftMobile => setAttributes({paddingLeftMobile})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />

                    <SelectControl
                        label={__('Padding Right', 'getwid')}
                        value={paddingRightMobile !== undefined ? paddingRightMobile : ''}
                        onChange={paddingRightMobile => setAttributes({paddingRightMobile})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                </Fragment>
            )
        }

    }
}


// Margins
export function renderMarginsPanel(obj) {

    const resetMargin = () => {
        const {
			setAttributes,
        } = obj.props;

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
            marginRightMobile: '',
        })
    };

    return (
        <PanelBody title={ __( 'Margin', 'getwid' ) } initialOpen={false}>
            <TabPanel className="getwid-editor-tabs"
                    activeClass="is-active"
                    tabs={ [
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
                        },
                    ] }>
                {
                    (tab) => renderResponsiveMarginsTabs(obj, tab)

                }
            </TabPanel>
            <BaseControl>
                <Button isLink
                        onClick={resetMargin}
                        disabled={ !hasMargin(obj) }>
                    {__('Reset All', 'getwid')}
                </Button>
            </BaseControl>
        </PanelBody>
    );

}

function hasMargin(obj) {
    const {attributes: {
        marginTopValue, marginRightValue, marginBottomValue, marginLeftValue,
        marginTop, marginRight, marginBottom, marginLeft,
        marginTopTablet, marginRightTablet, marginBottomTablet, marginLeftTablet,
        marginTopMobile, marginRightMobile, marginBottomMobile, marginLeftMobile,
    }} = obj.props;
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
}

function renderResponsiveMarginsTabs( obj, tab ){
    const{
        attributes:{
            marginTopValue, marginRightValue, marginBottomValue, marginLeftValue,
            marginTop, marginRight, marginBottom, marginLeft,
            marginTopTablet, marginRightTablet, marginBottomTablet, marginLeftTablet,
            marginTopMobile, marginRightMobile, marginBottomMobile, marginLeftMobile,
        },
        setAttributes
    } = obj.props;

    switch (tab.name){
        case 'desktop': {
            return(
                <Fragment>
                    <SelectControl
                        label={__('Margin Top', 'getwid')}
                        value={marginTop !== undefined ? marginTop : ''}
                        onChange={marginTop => setAttributes({marginTop})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'custom', label: __('Custom', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    {
                        marginTop === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginTopValue}
                                onChange={marginTopValue => {
                                    setAttributes({marginTopValue});
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Margin Bottom', 'getwid')}
                        value={marginBottom !== undefined ? marginBottom : ''}
                        onChange={marginBottom => setAttributes({marginBottom})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'custom', label: __('Custom', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    {
                        marginBottom === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginBottomValue}
                                onChange={marginBottomValue => {
                                    setAttributes({marginBottomValue});
                                }}
                            />
                        )
                    }
                    <SelectControl
                        label={__('Margin Left', 'getwid')}
                        value={marginLeft !== undefined ? marginLeft : ''}
                        onChange={marginLeft => setAttributes({marginLeft})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'custom', label: __('Custom', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
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
                        label={__('Margin Right', 'getwid')}
                        value={marginRight !== undefined ? marginRight : ''}
                        onChange={marginRight => setAttributes({marginRight})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'custom', label: __('Custom', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    {
                        marginRight === 'custom' && (
                            <GetwidStyleLengthControl
                                allowNegative
                                value={marginRightValue}
                                onChange={marginRightValue => {
                                    setAttributes({marginRightValue});
                                }}
                            />
                        )
                    }
                </Fragment>
            )
        }
        case 'tablet': {
            return(
                <Fragment>
                    <SelectControl
                        label={__('Margin Top', 'getwid')}
                        value={marginTopTablet !== undefined ? marginTopTablet : ''}
                        onChange={marginTopTablet => setAttributes({marginTopTablet})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    <SelectControl
                        label={__('Margin Bottom', 'getwid')}
                        value={marginBottomTablet !== undefined ? marginBottomTablet : ''}
                        onChange={marginBottomTablet => setAttributes({marginBottomTablet})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    <SelectControl
                        label={__('Margin Left', 'getwid')}
                        value={marginLeftTablet !== undefined ? marginLeftTablet : ''}
                        onChange={marginLeftTablet => setAttributes({marginLeftTablet})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />

                    <SelectControl
                        label={__('Margin Right', 'getwid')}
                        value={marginRightTablet !== undefined ? marginRightTablet : ''}
                        onChange={marginRightTablet => setAttributes({marginRightTablet})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                </Fragment>
            )
        }
        case 'mobile': {
            return(
                <Fragment>
                    <SelectControl
                        label={__('Margin Top', 'getwid')}
                        value={marginTopMobile !== undefined ? marginTopMobile : ''}
                        onChange={marginTopMobile => setAttributes({marginTopMobile})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    <SelectControl
                        label={__('Margin Bottom', 'getwid')}
                        value={marginBottomMobile !== undefined ? marginBottomMobile : ''}
                        onChange={marginBottomMobile => setAttributes({marginBottomMobile})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                    <SelectControl
                        label={__('Margin Left', 'getwid')}
                        value={marginLeftMobile !== undefined ? marginLeftMobile : ''}
                        onChange={marginLeftMobile => setAttributes({marginLeftMobile})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />

                    <SelectControl
                        label={__('Margin Right', 'getwid')}
                        value={marginRightMobile !== undefined ? marginRightMobile : ''}
                        onChange={marginRightMobile => setAttributes({marginRightMobile})}
                        options={[
                            {value: '', label: __('Default', 'getwid')},
                            {value: 'small', label: __('Small', 'getwid')},
                            {value: 'medium', label: __('Medium', 'getwid')},
                            {value: 'normal', label: __('Normal', 'getwid')},
                            {value: 'large', label: __('Large', 'getwid')},
                            {value: 'none', label: __('None', 'getwid')},
                        ]}
                    />
                </Fragment>
            )
        }

    }
}