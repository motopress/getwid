/**
* External dependencies
*/
import classnames from "classnames";
 

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
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
		const { url, original_url, alt, id, linkTo, link, setAttributes } = this.props;

		let href;

		switch ( linkTo ) {
			case 'media':
				href = original_url;
				break;
			case 'attachment':
				href = link;
				break;
		}

		const img = (
			<Fragment>
				<img
					src={ url }
					alt={ alt }
					data-id={ id }
					tabIndex="0"
				/>
				{ isBlobURL( url ) && <Spinner /> }
			</Fragment>
		);

		const className = classnames( {
			'is-transient': isBlobURL( url ),
		} );

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