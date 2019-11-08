/**
* External dependencies
*/
import './editor.scss';
import classnames from "classnames";


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
} = wp.editor;
const {
	Toolbar,
	IconButton
} = wp.components;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-testimonial';


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
				id,
				url,
				alt,
			},
			className,
			setAttributes
		} = this.props;

		const testimonialClasses = classnames(
			className,
			{
				['has-image'] : url !== undefined
			}
		);

		return(
			<Fragment>

				<BlockControls key={'toolbar'}>
					{ !! url && (
						<Fragment>
							<MediaUploadCheck>
								<Toolbar>
									<MediaUpload
										onSelect={ this.onSelectMedia }
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

				<div className={testimonialClasses} key={'edit'}>

					{ ! url && (
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
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
							/>
						</div>
						<div className={`${baseClass}__header`}>
							{url &&
								<div className={`${baseClass}__image-wrapper`}>
									<div className={`${baseClass}__image`}>
										<img
											src={url}
											alt={alt}
											className={ id ? `wp-image-${ id }` : null }
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
								/>
								<RichText
									tagName="span"
									className= {`${baseClass}__subtitle`}
									placeholder={ __( 'Write subtitle…', 'getwid' ) }
									value={ subtitle }
									onChange={subtitle => setAttributes({subtitle})}
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
			id: media.id,
			url: typeof media.sizes.thumbnail !== 'undefined' ? media.sizes.thumbnail.url : media.sizes.full.url,
			alt: media.alt
		})
	}
}

export default Edit;