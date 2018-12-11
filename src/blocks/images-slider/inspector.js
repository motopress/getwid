/**
 * Inspector Controls
 */

import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import {
	pick,
	times
} from "lodash";

const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	MediaUpload,
	MediaPlaceholder,
	PanelColorSettings
} = wp.editor;
const {
	Button,
	BaseControl,
	ButtonGroup,
	Tooltip,
	TabPanel,
	IconButton,
	Dashicon,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	DropdownMenu,
	Toolbar,
	RadioControl,
	TextControl,
	CheckboxControl
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );	
	}

	render() {

		const {
			attributes: {
				mediaAlt,
				mediaType,
				backgroundColor
			},
			setAttributes,
			setBackgroundColor,
		} = this.props;

		const colorSettings = [ {
			value: backgroundColor,
			// value: backgroundColor.color,
			onChange: setBackgroundColor,
			label: __( 'Background Color' ),
		} ];

		const onMediaAltChange = ( newMediaAlt ) => {
			setAttributes( { mediaAlt: newMediaAlt } );
		};

		const mediaTextGeneralSettings = () => {		
			return (			
				<Fragment>
					{ mediaType === 'image' && ( <TextareaControl
						label={ __( 'Alt Text (Alternative Text)' ) }
						value={ mediaAlt }
						onChange={ onMediaAltChange }
						help={ __( 'Alternative text describes your image to people who can’t see it. Add a short description with its key details.' ) }
					/> ) }
				</Fragment>
			);
		};		

		return (
			<InspectorControls key="inspector">
				{ mediaTextGeneralSettings }
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					initialOpen={ false }
					colorSettings={ colorSettings }
				/>			
			</InspectorControls>
		);
	}

}

export default ( Inspector );