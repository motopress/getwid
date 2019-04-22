/**
* WordPress dependencies
*/
const {Component, Fragment} = wp.element;
const {
	withSelect
} = wp.data;
const {
	isBlobURL
} = wp.blob;
const {
	Spinner
} = wp.components;


/**
 * Module Constants
 */
const baseClass = 'wp-block-getwid-images-stack';


/**
* Create an Sub Component
*/
class MediaContainer extends Component {
	constructor() {
		super( ...arguments );

		this.bindContainer = this.bindContainer.bind( this );
	}

	bindContainer( ref ) {
		this.container = ref;
	}

	componentDidUpdate( prevProps ) {
		const { image, url } = this.props;
		if ( image && ! url ) {
			this.props.setAttributes( {
				url: image.source_url,
				alt: image.alt_text,
			} );
		}
	}

	render() {
		const { url, alt, id, linkTo, link } = this.props;

		let href;

		switch ( linkTo ) {
			case 'media':
				href = url;
				break;
			case 'attachment':
				href = link;
				break;
		}

		const img = (
			<Fragment>
				<img
					className={`${baseClass}__media`}
					src={ url }
					alt={ alt }
					data-id={ id }
					tabIndex="0"
				/>
				{ isBlobURL( url ) && <Spinner /> }
			</Fragment>
		);

		return (	
			<Fragment>		
				{ href ? <a href={ href }>{ img }</a> : img }
			</Fragment>
		);
	}
}

export default withSelect( ( select, ownProps ) => {
	const { getMedia } = select( 'core' );
	const { id } = ownProps;

	return {
		image: id ? getMedia( id ) : null,
	};
} )( MediaContainer );