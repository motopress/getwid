
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

	RichText
} = wp.editor;

const {
	Toolbar,
	IconButton
} = wp.components;


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
				imgSize
			},
			setAttributes
		} = this.props;

		const getMedia = () =>{
		};		
			
		return(
			<Fragment>
				<BlockControls key={'toolbar'}>
					{ !! imgUrl && (
						<Fragment>
							<MediaUploadCheck>
								<Toolbar>
									<MediaUpload
										onSelect={ this.onSelectMedia }
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

				<Inspector {...this.props} key={'inspector'}/>

				<div className={'wp-block-getwid-person'} key={'edit'}>
					{ ! imgUrl && (
						<MediaPlaceholder
							icon={'format-image'}
							// className={className}
							labels={{
								title: __('Person', 'getwid'),
							}}
							onSelect={this.onSelectMedia}
							accept="image/*"
							allowedTypes={ ['image'] }
						/>
					)}
					{imgUrl &&
					<Fragment>
						<div className={'wp-block-getwid-person__image'}>
							<img
								src={imgUrl}
							/>
						</div>
						<div className={'wp-block-getwid-person__content-wrapper'}>

							<ul className={'wp-block-getwid-person__social-links'}>
								<li className={'wp-block-getwid-person__social-item'}>
									<a href="#" className={'wp-block-getwid-person__social-link'}>
										<i className="fab fa-linkedin"></i>
										<span className="wp-block-getwid-person__social-label">
										LinkedIn
									</span>
									</a>
								</li>
								<li className={'wp-block-getwid-person__social-item'}>
									<a href="#" className={'wp-block-getwid-person__social-link'}>
										<i className="fab fa-facebook"></i>
										<span className="wp-block-getwid-person__social-label">
										Facebook
									</span>
									</a>
								</li>
								<li className={'wp-block-getwid-person__social-item'}>
									<a href="#" className={'wp-block-getwid-person__social-link'}>
										<i className="fab fa-twitter"></i>
										<span className="wp-block-getwid-person__social-label">
										Twitter
									</span>
									</a>
								</li>
							</ul>

							<RichText
								tagName="h3"
								className={`wp-block-getwid-person__title`}
								placeholder={__('Write heading…', 'getwid')}
								value={title}
								onChange={title => setAttributes({title})}
								// formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
							/>

							<RichText
								tagName="span"
								className={`wp-block-getwid-person__subtitle`}
								placeholder={__('Write subtitle…', 'getwid')}
								value={subtitle}
								onChange={subtitle => setAttributes({subtitle})}
								formattingControls={['bold', 'italic', 'strikethrough']}
							/>

							<RichText
								tagName="p"
								className={`wp-block-getwid-person__content`}
								placeholder={__('Write text…', 'getwid')}
								value={content}
								onChange={content => setAttributes({content})}
								formattingControls={['bold', 'italic', 'strikethrough']}
							/>

						</div>
					</Fragment>
					}

				</div>

			</Fragment>
		)

	}

	onSelectMedia(media){

		this.props.setAttributes({
			imgId: media.id,
			imgUrl: media.sizes.full.url
		})

	}
}

export default Edit;