import GetwidStyleLengthControl from 'GetwidControls/style-length-control';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component} = wp.element;

const {
	InspectorControls,
	ColorPalette,
	FontSizePicker,
	PanelColorSettings
} = wp.editor;

const {
	IconButton,
	PanelBody,
	RangeControl,
	ToggleControl,
	Toolbar,
	SelectControl,
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {

		const {
			attributes: {
				id,
				url,
				link,
				newWindow,
				align,
				playOnScroll,
				minHeight,
				overlayColor,
				backgroundOpacity,
			},
			setAttributes
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>				
					<GetwidStyleLengthControl
						label={__('Block Min Height', 'getwid')}
						value={minHeight}
						units={[
							{label: 'px', value: 'px'},
							{label: 'vh', value: 'vh'},
							{label: 'vw', value: 'vw'},
							{label: '%', value: '%'}
						]}
						onChange={minHeight => setAttributes({minHeight})}
					/>
					<ToggleControl
						label={ __( 'Play on scroll', 'getwid' ) }
						checked={ playOnScroll }
						onChange={ () => {
							setAttributes( { playOnScroll: !playOnScroll } );
						}}
					/>					
					<PanelColorSettings
						title={ __( 'Colors', 'getwid' ) }
						initialOpen={ true }
						colorSettings={ [
							{
								value: overlayColor,
								onChange: overlayColor => setAttributes({overlayColor}),
								label: __( 'Overlay Color', 'getwid' ),
							}
						] }
					>
						<RangeControl
							label={ __( 'Overlay Opacity', 'getwid' ) }
							value={ backgroundOpacity }
							onChange={backgroundOpacity => setAttributes({backgroundOpacity})}
							min={ 0 }
							max={ 100 }
							step={ 5 }
						/>
					</PanelColorSettings>
				</PanelBody>
			</InspectorControls>
		);
	}
}