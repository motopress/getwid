/**
 * Internal dependencies
 */
import Inspector from './inspector';
import './editor.scss';

/**
* External dependencies
*/
import { __, isRTL } from 'wp.i18n';
const {jQuery: $} = window;
import { isEqual, pickBy } from 'lodash';

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

	initSlider(block) {
		const {
			attributes: {
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderDots,
				sliderAnimationSpeed,
				sliderCenterMode,
				sliderArrows,
				sliderSlidesToShowDesktop,
				sliderSlidesToScroll,
				sliderAutoplay
			}
		} = this.props;

		const slider = $(block).find( `.${baseClass}__wrapper` );

		slider.not( '.slick-initialized' ).slick( {
			arrows: sliderArrows !== 'none',
			dots: sliderDots !== 'none',
			slidesToShow: parseInt( sliderSlidesToShowDesktop ),
			slidesToScroll: parseInt( sliderSlidesToScroll ),
			autoplaySpeed: parseInt( sliderAutoplaySpeed ),
			speed: parseInt( sliderAnimationSpeed ),
			centerMode: sliderCenterMode,
			autoplay: sliderAutoplay,
			infinite: sliderInfinite,
			variableWidth : false,
			pauseOnHover  : true,
			adaptiveHeight: true,
			fade: false,
			rows: 0,
			rtl: isRTL()
		} );
	}

	observeSliderMarkupChange() {
		const block = document.getElementById( `block-${this.props.clientId}` );

		const mutationObserver = new MutationObserver( () => {
			this.initSlider(block);
		} );

		mutationObserver.observe( block, {
			childList: true,
			subtree: true
		} );
	}

	componentDidMount() {
		this.observeSliderMarkupChange();
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
	}, ( value ) => typeof value !== 'undefined' );

	return {
		recentPosts: getEntityRecords( 'postType', 'post', postsQuery )
	};
} )( Edit );
