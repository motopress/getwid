/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { isEqual, pickBy, isUndefined } from 'lodash';

/**
* Internal dependencies
*/
import Inspector from './inspector';
import './editor.scss';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { ServerSideRender, Placeholder, Spinner } = wp.components;
const { BlockAlignmentToolbar, AlignmentToolbar, BlockControls } = wp.editor;
const {	withSelect} = wp.data;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-post-slider';

/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.changeState = this.changeState.bind( this );
		this.getState    = this.getState.bind( this );		
	}

	changeState(param, value) {
		this.setState( { [ param ]: value } );
	}

	getState(value) {
		return this.state[ value ];
	}

	destroySlider() {
		const {
			clientId
		} = this.props;

		clearInterval( this.waitLoadPosts );

		const thisBlock = $(`[data-block='${clientId}']`);
		const sliderSelector = $( `.${baseClass}__content`, thisBlock );

		sliderSelector.hasClass( 'slick-initialized' ) && sliderSelector.slick( 'unslick' );
	}

	initSlider() {
		const {
			attributes: {
				sliderAnimationEffect,
				sliderAnimationSpeed,
				sliderAutoplaySpeed,
				sliderAutoplay,
				sliderInfinite,
				sliderArrows,
				sliderDots
			}
		} = this.props;

		this.waitLoadPosts = setInterval( () => {

			const elementById = $( `#block-${this.props.clientId}` );
			const sliderSelector = elementById.find( `.${baseClass}__content` );

			if ( sliderSelector.length && sliderSelector.hasClass( 'no-init-slider' ) ){
				
				sliderSelector.imagesLoaded().done( () => {
	
					sliderSelector.not( '.slick-initialized' ).slick( {
						arrows: sliderArrows != 'none' ? true : false,
						dots  : sliderDots   != 'none' ? true : false,

						autoplay: sliderAutoplay,
						infinite: sliderInfinite,

						speed		 : parseInt( sliderAnimationSpeed ),
						autoplaySpeed: parseInt( sliderAutoplaySpeed ),
						fade		 : sliderAnimationEffect == 'fade' ? true : false,
						
						rows: 0,
						slidesToShow: 1,
						slidesToScroll: 1,
	
						centerMode    : false,
						variableWidth : false,
						pauseOnHover  : true,
						adaptiveHeight: true
					} );
					sliderSelector.removeClass( 'no-init-slider' );
				});

				clearInterval( this.waitLoadPosts );
			}
		}, 1000);
	}

	componentDidMount() {
		this.initSlider();
	}

	componentWillUnmount() {
		this.destroySlider();
	}

	componentDidUpdate(prevProps, prevState) {
		if ( !isEqual( prevProps.attributes, this.props.attributes ) ) {
			this.destroySlider();
			this.initSlider();
		}
	}

	render() {
		const {
			attributes: {
				align,
				postTemplate,
				textAlignment
			},
			setAttributes,
			recentPosts
		} = this.props;

		const { changeState, getState } = this;

		const hasPosts = Array.isArray( recentPosts ) && recentPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
						...{changeState},
						...{getState},
						...{hasPosts},
					}} key='inspector'/>
					<Placeholder
						icon="admin-post"
						label={ __( 'Post Slider', 'getwid' ) }
					>
						{ ! Array.isArray( recentPosts ) ?
							<Spinner /> :
							__( 'No posts found.', 'getwid' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					...{ changeState },
					...{ getState },
				}} key={ 'inspector' }/>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						controls= { [ 'wide', 'full' ] }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
					{ ( typeof postTemplate != 'undefined' && postTemplate != '') && (
						<AlignmentToolbar
							value={ textAlignment }
							onChange={ textAlignment => setAttributes( { textAlignment } ) }
						/>		
					)}			
				</BlockControls>
				<ServerSideRender
					block={ 'getwid/post-slider' }
					attributes={ this.props.attributes }
				/>
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const postsQuery = pickBy( {
		order,
		orderby: orderBy,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );

	return {
		recentPosts: getEntityRecords( 'postType', 'post', postsQuery ),
	};
} )( Edit );