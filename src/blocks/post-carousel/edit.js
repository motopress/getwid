/**
 * Internal dependencies
 */
import Inspector from './inspector';
import './editor.scss';
import { TemplateSelectToolbarButton } from 'GetwidControls/post-template-select';

/**
* External dependencies
*/
import { __, isRTL } from 'wp.i18n';
const {jQuery: $} = window;
import { isEqual, pickBy, isUndefined } from 'lodash';

const { serverSideRender: ServerSideRender } = wp;
const { withSelect } = wp.data;
const { Component, Fragment, createRef } = wp.element;
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

		this.sliderRef = createRef();
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
		const block = this.sliderRef.current;

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
		const { align, postTemplate } = this.props.attributes;
		const { setAttributes, recentPosts } = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

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
						icon='admin-post'
						label={ __( 'Post Carousel', 'getwid' ) }
					>
						{ ! Array.isArray( recentPosts ) ?
							<Spinner /> :
							__( 'No posts found.', 'getwid' )
						}
					</Placeholder>
					<div ref={ this.sliderRef }></div>
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
						controls= {[ 'wide', 'full' ]}
						onChange={ nextAlign => {
							setAttributes( { align: nextAlign } );
						} }
					/>
					<TemplateSelectToolbarButton
						selectedTemplate={ postTemplate }
						onSelect={ ( templateID ) => setAttributes( { postTemplate: templateID } ) }
						previewRender={
							( templateID ) => (
								<ServerSideRender
									block='getwid/post-carousel'
									attributes={ { ...this.props.attributes, postTemplate: templateID }}
								/>
							)
						}
					/>
				</BlockControls>

				<div ref={ this.sliderRef }>
					<ServerSideRender
						block='getwid/post-carousel'
						attributes={ this.props.attributes }
					/>
				</div>

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
