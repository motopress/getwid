/**
* External dependencies
*/
import './editor.scss';
import classnames from "classnames";
import Inspector from './inspector';


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
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText
} = wp.blockEditor || wp.editor;
const {
	ToolbarGroup,
	ToolbarButton
} = wp.components;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-testimonial';

const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color'
];

/**
* Create an Component
*/
class Edit extends Component{
	constructor(){
		super( ...arguments );
		this.onSelectMedia = this.onSelectMedia.bind(this);
	}

	render(){
		const {
			attributes:{
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

		const onSelectMedia = this.onSelectMedia;

		const testimonialClasses = classnames(
			className,
			{
				['has-image'] : imgUrl !== undefined
			}
		);

		return(
			<Fragment>

				<BlockControls key={'toolbar'}>
					{ !! imgUrl && (
						<Fragment>
							<MediaUploadCheck>
								<ToolbarGroup>
									<MediaUpload
										onSelect={ this.onSelectMedia }
										allowedTypes={ ['image'] }
										value={ imgId }
										render={ ( { open } ) => (
											<ToolbarButton
												className="components-toolbar__control"
												label={ __( 'Edit Media', 'getwid' ) }
												icon="edit"
												onClick={ open }
											/>
										) }
									/>
								</ToolbarGroup>
							</MediaUploadCheck>
						</Fragment>
					) }
				</BlockControls>

				<Inspector {...{...this.props, onSelectMedia}} key={'inspector'}/>

				<div className={testimonialClasses} key={'edit'}>

					{ ! imgUrl && (
						<MediaPlaceholder
							icon={'format-image'}
							// className={className}
							labels={{
								title: __('Testimonial', 'getwid'),
							}}
							onSelect={this.onSelectMedia}
							accept="image/*"
							allowedTypes={ ['image'] }
						/>
					)}

					<div className={`${baseClass}__wrapper`}>
						<div className={`${baseClass}__content-wrapper`}>
							<RichText
								tagName="p"
								className={`${baseClass}__content`}
								placeholder={ __( 'Write text…', 'getwid' ) }
								value={ content }
								onChange={content => setAttributes({content})}
								allowedFormats={allowedFormats}
							/>
						</div>
						<div className={`${baseClass}__header`}>
							{imgUrl &&
								<div className={`${baseClass}__image-wrapper`}>
									<div className={`${baseClass}__image`}>
										<img
											src={imgUrl}
											alt={imgAlt}
											className={ imgId ? `wp-image-${ imgId }` : null }
										/>
									</div>
								</div>
							}
							<div className={`${baseClass}__heading`}>
								<RichText
									tagName="span"
									className= {`${baseClass}__title`}
									placeholder={ __( 'Write heading…', 'getwid' ) }
									value={ title }
									onChange={title => setAttributes({title})}
									allowedFormats={allowedFormats}
								/>
								<RichText
									tagName="span"
									className= {`${baseClass}__subtitle`}
									placeholder={ __( 'Write subtitle…', 'getwid' ) }
									value={ subtitle }
									onChange={subtitle => setAttributes({subtitle})}
									allowedFormats={allowedFormats}
								/>
							</div>
						</div>
					</div>
				</div>

			</Fragment>
		)
	}

	onSelectMedia(media){
		this.props.setAttributes({
			imgId: media.id,
			imgUrl: typeof media.sizes.thumbnail !== 'undefined' ? media.sizes.thumbnail.url : media.sizes.full.url,
			imgAlt: media.alt
		})
	}
}

export default Edit;
