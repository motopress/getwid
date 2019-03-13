/**
 * Inspector Controls
 */

const { __ } = wp.i18n;
const {
	Component,
	Fragment,
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

const ALLOWED_MEDIA_TYPES = [ 'image' ];

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
				mediaId,
				mediaType,
				mediaUrl,
			},
			setAttributes,
			onSelectMedia
		} = this.props;

		return (
			<InspectorControls key="inspector">

				<PanelBody title={__('Background Image', 'getwid')} initialOpen={true}>
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