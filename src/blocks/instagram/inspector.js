/**
* External dependencies
*/
import attributes from './attributes';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
} = wp.blockEditor || wp.editor;
const {
	Button,
	BaseControl,
	ButtonGroup,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Modal,
	TextControl,
	TextareaControl,
	ExternalLink,
	RadioControl,
	Notice
} = wp.components;


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );
	}

	render() {
		const {
			attributes: {
				photoCount,
				gridColumns,
				spacing,
			},
			//Functions
			changeState,
			getState,

			setAttributes,
			className
		} = this.props;

		return (
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>

					<RangeControl
						label={__('Number of items', 'getwid')}
						value={photoCount}
						onChange={photoCount => {
							if (typeof photoCount == 'undefined'){
								photoCount = attributes.photoCount.default;
							}
							setAttributes({photoCount});
						}}
						allowReset
						min={1}
						max={25}
						step={1}
					/>

					<RangeControl
						label={__('Columns', 'getwid')}
						value={gridColumns}
						onChange={gridColumns => {
							if (typeof gridColumns == 'undefined'){
								photoCount = attributes.gridColumns.default;
							}
							setAttributes({gridColumns});
						}}
						allowReset
						min={1}
						max={6}
						step={1}
					/>

					<SelectControl
						label={__('Spacing', 'getwid')}
						value={spacing}
						onChange={spacing => setAttributes({spacing})}
						options={[
							{ value: 'default', label: __( 'Default', 'getwid' ) },
							{ value: 'none', label: __( 'None', 'getwid' ) },
							{ value: 'small', label: __( 'Small', 'getwid' ) },
							{ value: 'medium', label: __( 'Medium', 'getwid' ) },
							{ value: 'normal', label: __( 'Normal', 'getwid' ) },
							{ value: 'large', label: __( 'Large', 'getwid' ) },
						]}
					/>
				</PanelBody>

			</InspectorControls>
		);
	}

}

export default ( Inspector );