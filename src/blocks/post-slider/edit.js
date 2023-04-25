/**
* External dependencies
*/
import { __, isRTL } from 'wp.i18n';
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
const { serverSideRender: ServerSideRender } = wp;
const { Component, Fragment } = wp.element;
const { Placeholder, Spinner, Disabled } = wp.components;
const { BlockAlignmentToolbar, AlignmentToolbar, BlockControls } = wp.blockEditor || wp.editor;
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
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
	}

	getState(value) {
		return this.state[ value ];
	}

	initSlider(block) {
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

		const slider = $(block).find( `.${baseClass}__content` );

		slider.not( '.slick-initialized' ).slick( {
			arrows: sliderArrows !== 'none',
			dots: sliderDots !== 'none',
			autoplay: sliderAutoplay,
			infinite: sliderInfinite,
			speed: parseInt( sliderAnimationSpeed ),
			autoplaySpeed: parseInt( sliderAutoplaySpeed ),
			fade: sliderAnimationEffect === 'fade',
			rows: 0,
			slidesToShow: 1,
			slidesToScroll: 1,
			centerMode: false,
			variableWidth: false,
			pauseOnHover: true,
			adaptiveHeight: true,
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
					<Inspector
						{ ...{
							...this.props,
							changeState,
							getState,
							hasPosts
						} }
					/>
					<Placeholder
						icon="admin-post"
						label={ __( 'Post Slider', 'getwid' ) }
					>
						{ ! Array.isArray( recentPosts ) ?
							<Spinner />
							:
							__( 'No posts found.', 'getwid' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		return (
			<Fragment>
				<Inspector
					{ ...{
						...this.props,
						changeState,
						getState
					} }
				/>
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
	const { postsToShow, order } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const postsQuery = pickBy( {
		order,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );

	return {
		recentPosts: getEntityRecords( 'postType', 'post', postsQuery ),
	};
} )( Edit );
