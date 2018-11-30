/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

const {
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
} = wp.editor;

const {
	IconButton,
	ResizableBox,
	Toolbar	
} = wp.components;

const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];

/**
 * Create an Inspector Controls wrapper Component
 */
export default class MediaContainer extends Component {
	renderToolbarEditButton() {
		const {
			mediaId,
			onSelectMedia,
			noticeOperations,
			noticeUI
		} = this.props;
		return (
			<BlockControls>
				<Toolbar>
					<MediaUpload
						onSelect={ onSelectMedia }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						value={ mediaId }
						multiple
						accept="image/*"
						labels={{
							title: __( 'Images', 'getwid' ),
							instructions: __( 'Drag images, upload new ones or select files from your library.', 'getwid' ),
						}}
						render={ ( { open } ) => (
							<IconButton
								className="components-toolbar__control"
								label={ __( 'Edit media' ) }
								icon="edit"
								onClick={ open }
							/>
						)}
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/>
				</Toolbar>
			</BlockControls>
		);
	}

	renderImage() {
		const {
			attributes: {
				sliderImages			
			},
			className
		} = this.props;

		const renderSliderImages = sliderImages.map(( img ) => {
		    return (
		    	<figure className={ className }>
		    		<img src = {img.url} alt = {img.alt}/>
		    	</figure>
		    );
		});

		return (
			<Fragment>
				{ this.renderToolbarEditButton() }
				{ renderSliderImages }
			</Fragment>
		);
	}

	renderVideo() {
		const { mediaUrl, className } = this.props;
		return (
			<Fragment>
				{ this.renderToolbarEditButton() }
				<figure className={ className }>
					<video controls src={ mediaUrl } />
				</figure>
			</Fragment>
		);
	}

	renderPlaceholder() {
		const { onSelectMedia, className } = this.props;
		return (
			<MediaPlaceholder
				icon="format-image"
				labels={ {
					title: __( 'Media area' ),
				} }
				className={ className }
				onSelect={ onSelectMedia }
				accept="image/*,video/*"
				allowedTypes={ ALLOWED_MEDIA_TYPES }
			/>
		);
	}

	render() {
		const { mediaUrl, mediaType } = this.props;
		if ( mediaType && mediaUrl ) {

			let mediaElement = null;
			switch ( mediaType ) {
				case 'image':
					mediaElement = this.renderImage();
					break;
				case 'video':
					mediaElement = this.renderVideo();
					break;
			}
			return (
				<Fragment>
					{ mediaElement }
				</Fragment>
			);
		}
		return this.renderPlaceholder();
	}
}