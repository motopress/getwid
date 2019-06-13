/**
* External dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import {renderPaddingsPanel} from 'GetwidUtils/render-inspector';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
} = wp.editor;
const {
	SelectControl,
	PanelBody,
} = wp.components;


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				//Content
				minHeight,
				imageSize
			},
			setAttributes,
			changeState,
			getState,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
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
						label={__('Image Size', 'getwid')}
						help={__('For images from Media Library only.', 'getwid')}
						value={imageSize}
						onChange={ (value) => {
							setAttributes( { imageSize: value } );
						}}
						options={Getwid.settings.image_sizes}
					/>						
				</PanelBody>

				{renderPaddingsPanel(this)}
								
			</InspectorControls>
		);
	}
}