import classnames from 'classnames';
import Inspector from './inspector';

import './editor.scss';

import {
	filter,
	pick,
	map,
	get,
	chunk
} from "lodash";

const { __ } = wp.i18n;

const {
	Fragment,
	Component
} = wp.element;

const {
	BlockControls,
	AlignmentToolbar,
	InnerBlocks,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,

	RichText,
	withColors
} = wp.editor;

const {compose} = wp.compose;

const {
	withSelect
} = wp.data;

const {
	Toolbar,
	IconButton
} = wp.components;

const ALLOWED_BLOCKS = [ 'getwid/social-links' ];
const TEMPLATE_BLOCKS = [
	['getwid/social-links', { textAlignmentDesktop: "center"} ]
];

class Edit extends Component {

	constructor(){
		super( ...arguments );
	}

	render(){
		const {
			attributes:{
				imageSize,
				imageCrop,
				title,
				subtitle,
				content,
				imgId,
				imgUrl,
				imgAlt,
			},
			className,
			setAttributes
		} = this.props;

		const changeImageSize = ( media, imageSize) => {
			if ( ! media ) {
				setAttributes( { imgId: undefined, imgUrl: undefined } );
				return;
			}
	
			const url_link = get( media, [ 'sizes', imageSize, 'url' ] ) || get( media, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || media.url;
	
			setAttributes({
				imgId: media.id,
				imgUrl: (typeof url_link !='undefined' ? url_link : url),
			});
		};
		
		const onSelectMedia = ( media ) => {
			changeImageSize(media, imageSize);
		};

		return(
			<Fragment>
				<BlockControls key={'toolbar'}>
					{ !! imgUrl && (
						<Fragment>
							<MediaUploadCheck>
								<Toolbar>
									<MediaUpload
										onSelect={ onSelectMedia }
										allowedTypes={ ['image'] }
										value={ imgId }
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
					{ ! imgUrl && (
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
					{imgUrl &&
					<Fragment>
						<div className={`${className}__image`}>
							<img
								src={imgUrl}
								alt={imgAlt}
								className={ imgId ? `wp-image-${ imgId }` : null }
							/>
						</div>
						<div className={`${className}__content-wrapper`}>

							<RichText
								tagName="span"
								className={`${className}__title`}
								placeholder={__('Write heading…', 'getwid')}
								value={title}
								onChange={title => setAttributes({title})}
							/>

							<RichText
								tagName="span"
								className={`${className}__subtitle`}
								placeholder={__('Write subtitle…', 'getwid')}
								value={subtitle}
								onChange={subtitle => setAttributes({subtitle})}
							/>

							<RichText
								tagName="p"
								className={`${className}__content`}
								placeholder={__('Write text…', 'getwid')}
								value={content}
								onChange={content => setAttributes({content})}
								formattingControls={['bold', 'italic', 'strikethrough']}
							/>

							<InnerBlocks
								template={ TEMPLATE_BLOCKS }
								templateLock="all"
								templateInsertUpdatesSelection={false}
								allowedBlocks={ ALLOWED_BLOCKS }
							/>

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
		const { imgId } = props.attributes;
		return {
			imgObj: imgId ? getMedia( imgId ) : null,
		};
	} ),
] )( Edit );