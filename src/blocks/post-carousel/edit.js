/**
 * Internal dependencies
 */
import Inspector from './inspector';
import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { isEqual, pickBy, isUndefined } from 'lodash';

const { serverSideRender: ServerSideRender } = wp;
const { withSelect } = wp.data;
const { Component, Fragment } = wp.element;
const { BlockAlignmentToolbar, BlockControls } = wp.blockEditor || wp.editor;
const { Placeholder, Spinner } = wp.components;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-post-carousel';

/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.changeState = this.changeState.bind( this );
		this.getState    = this.getState.bind( this );
	}

	changeState (param, value) {
		this.setState( { [ param ]: value } );
	}

	getState (value) {
		return this.state[ value ];
	}

	destroySlider() {
		const {
			clientId
		} = this.props;

		clearInterval( this.waitLoadPosts );

		const thisBlock = $(`[data-block='${clientId}']`);
		const sliderSelector = $( `.${baseClass}__wrapper`, thisBlock );

		sliderSelector.hasClass( 'slick-initialized' ) && sliderSelector.slick( 'unslick' );
	}

	initSlider() {
		const { sliderAutoplaySpeed, sliderInfinite, sliderDots } = this.props.attributes;
		const { sliderAnimationSpeed, sliderCenterMode, sliderArrows } = this.props.attributes;
		const { sliderSlidesToShowDesktop, sliderSlidesToScroll, sliderAutoplay } = this.props.attributes;

		this.waitLoadPosts = setInterval( () => {

			const slider = $( `#block-${this.props.clientId}` );
			const sliderSelector = slider.find( `.${baseClass}__wrapper` );

			if ( sliderSelector.length && sliderSelector.hasClass( 'no-init-slider' ) && (typeof sliderSelector.imagesLoaded === "function") ) {

				sliderSelector.imagesLoaded().done( function( instance ) {

					sliderSelector.not( '.slick-initialized' ).slick( {
						arrows: sliderArrows != 'none' ? true : false,
						dots  : sliderDots   != 'none' ? true : false,

						slidesToShow:   parseInt( sliderSlidesToShowDesktop ),
						slidesToScroll: parseInt( sliderSlidesToScroll      ),

						autoplaySpeed:  parseInt( sliderAutoplaySpeed  ),
						speed: 			parseInt( sliderAnimationSpeed ),

						centerMode: sliderCenterMode,
						autoplay: sliderAutoplay,
						infinite: sliderInfinite,

						variableWidth : false,
						pauseOnHover  : true,
						adaptiveHeight: true,

						fade: false,
						rows: 0
					} );
					sliderSelector.removeClass( 'no-init-slider' );
				} );

				clearInterval( this.waitLoadPosts );
			}
		}, 1000 );
	}

	componentDidMount(){
		this.initSlider();
	}

	componentWillUnmount() {
		this.destroySlider();
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( !isEqual( prevProps.attributes, this.props.attributes ) ) {
			this.destroySlider();
			this.initSlider();
		}
	}

	render() {
		const { align } = this.props.attributes;
		const { setAttributes, recentPosts } = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

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
						icon='admin-post'
						label={ __( 'Post Carousel', 'getwid' ) }
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
					...{changeState},
					...{getState},
				}} key='inspector'/>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						controls= {[ 'wide', 'full' ]}
						onChange={ nextAlign => {
							setAttributes( { align: nextAlign } );
						} }
					/>
				</BlockControls>

				<ServerSideRender
					block='getwid/post-carousel'
					attributes={this.props.attributes}
				/>

			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const postsQuery = pickBy( {
		order,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );

	return {
		recentPosts: getEntityRecords( 'postType', 'post', postsQuery )
	};
} )( Edit );
