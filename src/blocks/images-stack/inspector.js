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

	getImageCropHelp( checked ) {
		return checked ? __( 'Thumbnails are cropped to align.' ) : __( 'Thumbnails are not cropped.' );
	}

	render() {
		const {
			attributes:{
				align,
				images,
				ids,
				linkTo,
				imageSize,
				stackStyle,
				stackOverlap
			},
			setAttributes,
			pickRelevantMediaFiles,
			isSelected,
			className,
			imgObj
		} = this.props;

		const onChangeImageSize = (imageSize) => {
			setAttributes( {
				imageSize,
				images: imgObj.map( ( image ) => pickRelevantMediaFiles( image, imageSize ) ),
			} );
		};

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>
					<SelectControl
						label={__('Image Size', 'getwid')}
						value={imageSize}
						onChange={onChangeImageSize}
						options={[
							{value: 'thumbnail', label: __('Thumbnail', 'getwid')},
							{value: 'medium', label: __('Medium', 'getwid')},
							{value: 'large', label: __('Large', 'getwid')},
							{value: 'full', label: __('Full Size', 'getwid')},
						]}
					/>				
					<SelectControl
						label={__('Style', 'getwid')}
						value={stackStyle}
						onChange={stackStyle => setAttributes({stackStyle})}
						options={[
							{ value: 'default', label: __( 'Default', 'getwid' ) },
							{ value: 'alpha', label: __( 'Alpha', 'getwid' ) },
							{ value: 'beta', label: __( 'Beta', 'getwid' ) },
							{ value: 'gamma', label: __( 'Gamma', 'getwid' ) },
							{ value: 'delta', label: __( 'Delta', 'getwid' ) },
							{ value: 'epsilon', label: __( 'Epsilon', 'getwid' ) },
							{ value: 'zeta', label: __( 'Zeta', 'getwid' ) },
						]}
					/>
					<SelectControl
						label={__('Link to', 'getwid')}
						value={linkTo}
						onChange={linkTo => setAttributes({linkTo})}
						options={[
							{ value: 'attachment', label: __( 'Attachment Page', 'getwid' ) },
							{ value: 'media', label: __( 'Media File', 'getwid' ) },
							{ value: 'none', label: __( 'None', 'getwid' ) },
						]}
					/>
				</PanelBody>	
			</InspectorControls>
		);
	}

}

export default ( Inspector );