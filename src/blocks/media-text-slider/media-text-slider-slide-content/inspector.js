/**
* WordPress dependencies
*/
const {
	Component,
} = wp.element;
const {
	InspectorControls,
	MediaUpload,
} = wp.editor;
const {
	Button,
	BaseControl,
	PanelBody,
} = wp.components;


/**
* Module Constants
*/
const ALLOWED_MEDIA_TYPES = [ 'image' ];


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
				mediaAlt,
				mediaId,
				mediaType,
				mediaUrl,
			},
			setAttributes,
			onSelectMedia
		} = this.props;

		return (
			<InspectorControls key="inspector">

				<PanelBody title={__('Image', 'getwid')} initialOpen={true}>
					<MediaUpload
						onSelect={ onSelectMedia }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						value={ mediaId }
						render={ ( { open } ) => (
							<BaseControl>
								{ !!mediaUrl &&
								<div className="getwid-background-image-wrapper">
									<img src={mediaUrl} />
								</div>
								}							
								<Button
									isDefault
									onClick={ open }
								>
									{!mediaId && __('Select Image', 'getwid')}
									{!!mediaId && __('Replace Image', 'getwid')}
								</Button>
							</BaseControl>
						) }
					/>
				</PanelBody>

			</InspectorControls>
		);
	}

}

export default ( Inspector );