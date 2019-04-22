/**
* External dependencies
*/
import { isUndefined, pickBy, isEqual } from 'lodash';
import Inspector from './inspector';
import './editor.scss';


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
} = wp.element;
const {
	Placeholder,
	Spinner,
	ServerSideRender,
	Disabled
} = wp.components;
const apiFetch = wp.apiFetch;
const {
	addQueryArgs
} = wp.url;
const {
	BlockAlignmentToolbar,
	BlockControls,
} = wp.editor;
const {
	withSelect,
} = wp.data;


/**
 * Module Constants
 */
const CATEGORIES_LIST_QUERY = {
	per_page: -1,
};


/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			categoriesList: [],
		};

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);		
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	destroySlider(){
		const {className} = this.props;
		const sliderEl = $(ReactDOM.findDOMNode(this));
		const sliderSelector = $(`.${className}__wrapper`, sliderEl);

		sliderSelector.hasClass('slick-initialized') && sliderSelector.slick('unslick');
	}

	initSlider() {
		const {
			attributes: {
				sliderAnimationEffect,
				sliderSlidesToShow,
				sliderSlidesToShowLaptop,
				sliderSlidesToShowTablet,
				sliderSlidesToShowMobile,
				sliderSlidesToScroll,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderCenterMode,
				sliderVariableWidth,
				sliderSpacing,
				sliderArrows,
				sliderDots
			},
			clientId,
			className
		} = this.props;

		this.waitLoadInstagram = setInterval( () => {
			const sliderEl = $(ReactDOM.findDOMNode(this));
			const sliderSelector = $(`.${className}__wrapper`, sliderEl);

			if (sliderSelector.length && sliderSelector.hasClass('no-init-slider')){
				//Wait all images loaded
				sliderSelector.imagesLoaded().done( function( instance ) {
	
					sliderSelector.not('.slick-initialized').slick({
						arrows: sliderArrows != 'none' ? true : false,
						dots: sliderDots != 'none' ? true : false,
						rows: 0,
						slidesToShow: parseInt(sliderSlidesToShow),
						slidesToScroll: parseInt(sliderSlidesToScroll),
						autoplay: sliderAutoplay,
						autoplaySpeed: parseInt(sliderAutoplaySpeed),
						fade: sliderAnimationEffect == 'fade' ? true : false,
						speed: parseInt(sliderAnimationSpeed),
						infinite: sliderInfinite,
	
						centerMode: sliderCenterMode,
						variableWidth: sliderVariableWidth,
						pauseOnHover: true,
						adaptiveHeight: true,
					});
					sliderSelector.removeClass('no-init-slider');
				});

				clearInterval(this.waitLoadInstagram);
			}
		}, 1);
	}

	componentWillMount() {		
		this.isStillMounted = true;
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/categories`, CATEGORIES_LIST_QUERY ),
		} ).then(
			( categoriesList ) => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList } );
				}
			}
		).catch(
			() => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList: [] } );
				}
			}
		);
	}

	componentDidMount(){
		this.initSlider();
	}

	componentWillUnmount() {
		clearInterval(this.waitLoadInstagram);
		this.isStillMounted = false;
	}

	componentWillUpdate(nextProps, nextState) {
		if (!isEqual(nextProps.attributes, this.props.attributes)){
			this.destroySlider();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEqual(prevProps.attributes, this.props.attributes)){
			this.initSlider();
		}
	}

	render() {
		const {
			attributes: {
				align,
			},
			setAttributes,
			recentPosts,
			className
		} = this.props;

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
						icon="admin-post"
						label={ __( 'Recent Posts', 'getwid' ) }
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
					...{hasPosts},
				}} key='inspector'/>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						controls= {[ 'wide', 'full' ]}
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
				</BlockControls>

				<Disabled>
					<ServerSideRender
						block="getwid/recent-posts"
						attributes={this.props.attributes}
					/>
				</Disabled>

			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy, categories } = props.attributes;
	const { getEntityRecords, getMedia } = select( 'core' );
	const postsQuery = pickBy( {
		categories,
		order,
		orderby: orderBy,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );

	return {
		recentPosts: getEntityRecords( 'postType', 'post', postsQuery ),
	};
} )( Edit );