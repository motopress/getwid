/**
* External dependencies
*/
import classnames from 'classnames';
import Inspector from './inspector';
import attributes from './attributes';
import './editor.scss';
import {
	get,
} from "lodash";


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	Fragment,
	Component
} = wp.element;
const {
	BlockControls,
	InnerBlocks,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} = wp.editor;
const {compose} = wp.compose;
const {
	withSelect
} = wp.data;
const {
	Toolbar,
	IconButton
} = wp.components;


/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/social-links' ];
const TEMPLATE_BLOCKS = [
	['getwid/social-links', { textAlignmentDesktop: "center"} ]
];
const baseClass = 'wp-block-getwid-person';

/**
* Create an Component
*/
class Edit extends Component {

	constructor(){
		super( ...arguments );
	}

	render(){
		const {
			attributes:{
				imageCrop,
				title,
				subtitle,
				content,
				id,
				url,
				alt,
			},
			className,
			setAttributes
		} = this.props;

		const changeImageSize = ( media, imageSize) => {
			if ( ! media ) {
				setAttributes( { id: undefined, url: undefined } );
				return;
			}
	
			const url_link = get( media, [ 'sizes', imageSize, 'url' ] ) || get( media, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || media.url;
	
			setAttributes({
				id: media.id,
				url: (typeof url_link !='undefined' ? url_link : url),
			});
		};
		
		const onSelectMedia = ( media ) => {	
			let {
				attributes:{
					imageSize,
				},
			} = this.props;

			if (!['full', 'large', 'medium', 'thumbnail'].includes(imageSize)) {
				imageSize = attributes.imageSize.default;
				setAttributes( {
					imageSize
				} );
			}
	
			changeImageSize(media, imageSize);
		};

		return(
			<Fragment>
				<BlockControls key={'toolbar'}>
					{ !! url && (
						<Fragment>
							<MediaUploadCheck>
								<Toolbar>
									<MediaUpload
										onSelect={ onSelectMedia }
										allowedTypes={ ['image'] }
										value={ id }
										render={ ( { open } ) => (
											<IconButton
												className="components-toolbar__control"
												label={ __( 'Edit Media', 'getwid' ) }
												icon="edit"
												onClick={ open }
											/>
										) }
									/>
								</Toolbar>
							</MediaUploadCheck>
						</Fragment>
					) }
				</BlockControls>

				<Inspector {...{...this.props, changeImageSize}} key={'inspector'}/>

				<div
				className={
					classnames(
						className,
						imageCrop ? `is-image-cropped` : null
					)
				}				
				key={'edit'}>
					{ ! url && (
						<MediaPlaceholder
							icon={'format-image'}
							labels={{
								title: __('Person', 'getwid'),
							}}
							onSelect={onSelectMedia}
							accept="image/*"
							allowedTypes={ ['image'] }
						/>
					)}
					{url &&
					<Fragment>
						<div className={`${baseClass}__image`}>
							<img
								src={url}
								alt={alt}
								className={ id ? `wp-image-${ id }` : null }
							/>
						</div>
						<div className={`${baseClass}__content-wrapper`}>

							<div className="editor-testimonial__title-wrapper">
								<RichText
									tagName="span"
									className={`${baseClass}__title`}
									placeholder={__('Write heading…', 'getwid')}
									value={title}
									onChange={title => setAttributes({title})}
								/>
							</div>
							<div className="editor-testimonial__subtitle-wrapper">
								<RichText
									tagName="span"
									className={`${baseClass}__subtitle`}
									placeholder={__('Write subtitle…', 'getwid')}
									value={subtitle}
									onChange={subtitle => setAttributes({subtitle})}
								/>
							</div>
							<div className="editor-testimonial__content-wrapper">
								<RichText
									tagName="p"
									className={`${baseClass}__content`}
									placeholder={__('Write text…', 'getwid')}
									value={content}
									onChange={content => setAttributes({content})}
									formattingControls={['bold', 'italic', 'strikethrough']}
								/>
							</div>
							<div className="editor-testimonial__social-links-wrapper">
								<InnerBlocks
									template={ TEMPLATE_BLOCKS }
									templateLock="all"
									templateInsertUpdatesSelection={false}
									allowedBlocks={ ALLOWED_BLOCKS }
								/>
							</div>
						</div>
					</Fragment>
					}

				</div>

			</Fragment>
		)

	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { id } = props.attributes;
		return {
			imgObj: id ? getMedia( id ) : null,
		};
	} ),
] )( Edit );