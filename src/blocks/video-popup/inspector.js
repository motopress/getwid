/**
* External dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {Component} = wp.element;
const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;
const {
	PanelBody,
	RangeControl,
    TextControl,
	SelectControl,
	CheckboxControl
} = wp.components;


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
        this.onSetLinkRel = this.onSetLinkRel.bind( this );
	}

    onSetLinkRel( value ) {
        this.props.setAttributes( { rel: value } );
    }

    render() {

		const {
			attributes: {
				imageSize,
				id,
				url,
				type,
				title,
				text,
				link,
				align,
				minHeight,
				imageAnimation,
				buttonAnimation,
				rel,
				linkTarget
			},
			changeImageSize,
			setAttributes,
			setBackgroundColor,
			setTextColor,

			backgroundColor,
			textColor,
			imgObj
		} = this.props;

		const onChangeImageSize = (imageSize) => {

			if (typeof imgObj != 'undefined'){
				setAttributes( {
					imageSize
				} );
				changeImageSize(imgObj, imageSize);
			}
		};

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>

					<SelectControl
						label={__('Image Size', 'getwid')}
						help={__('For images from Media Library only.', 'getwid')}
						value={imageSize}
						onChange={onChangeImageSize}
						options={Getwid.settings.image_sizes}
					/>						
					<GetwidStyleLengthControl
						label={__('Image Height', 'getwid')}
						value={minHeight}
						units={[
							{label: 'px', value: 'px'},
							{label: 'vh', value: 'vh'},
							{label: 'vw', value: 'vw'},
							{label: '%', value: '%'}
						]}
						onChange={minHeight => setAttributes({minHeight})}
					/>

					<SelectControl
						label={__('Image Animation', 'getwid')}
						value={imageAnimation}
						onChange={imageAnimation => setAttributes({imageAnimation})}
						options={[
							{value: 'style1', label: __('Aries', 'getwid')},
							{value: 'style2', label: __('Taurus', 'getwid')},
							{value: 'style3', label: __('Gemini', 'getwid')},
							{value: 'style4', label: __('Cancer', 'getwid')},
							{value: 'style5', label: __('Leo', 'getwid')},
							{value: 'style6', label: __('Virgo', 'getwid')},
						]}
					/>

					<SelectControl
						label={__('Button Animation', 'getwid')}
						value={buttonAnimation}
						onChange={buttonAnimation => setAttributes({buttonAnimation})}
						options={[
							{value: 'none', label: __('None', 'getwid')},
							{value: 'opacity', label: __('Fade In', 'getwid')},
							{value: 'opacity-top', label: __('Fade In Up', 'getwid')},
							{value: 'opacity-bottom', label: __('Fade In Down', 'getwid')},
							{value: 'opacity-left', label: __('Fade In Left', 'getwid')},
							{value: 'opacity-right', label: __('Fade In Right', 'getwid')},
							{value: 'opacity-zoom-in', label: __('Zoom In', 'getwid')},
							{value: 'opacity-zoom-out', label: __('Zoom Out', 'getwid')},
						]}
					/>
                    <TextControl
                        label={ __( 'Link Rel', 'getwid' ) }
                        value={ rel || '' }
                        onChange={ this.onSetLinkRel }
                    />
					<PanelColorSettings
						title={__('Colors', 'getwid')}
						initialOpen={ true }
						colorSettings={[
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __('Text Color', 'getwid')
							},
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __('Overlay Color', 'getwid')
							}
						]}
					>
					</PanelColorSettings>
				</PanelBody>
			</InspectorControls>
		);
	}
}