/**
 * Internal block libraries
 */
import classnames from "classnames";
 
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

const {
	withSelect
} = wp.data;

const {
	isBlobURL
} = wp.blob;

const {
	IconButton,
	Spinner
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
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
		const { url, alt, id, linkTo, link, setAttributes, 'aria-label': ariaLabel } = this.props;

		const className = 'wp-block-getwid-images-stack';

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
					className={`${className}__media`}
					src={ url }
					alt={ alt }
					data-id={ id }
					tabIndex="0"
					aria-label={ ariaLabel }
				/>
				{ isBlobURL( url ) && <Spinner /> }
			</Fragment>
		);

/*<figure className={ className } tabIndex="-1" ref={ this.bindContainer }>
</figure>*/

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