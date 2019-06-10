/**
* External dependencies
*/
import { isUndefined, pickBy, isEqual } from 'lodash';
import Inspector from './inspector';
import './editor.scss';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
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
	AlignmentToolbar,
	BlockControls,
	withColors
} = wp.editor;
const {
	select,
} = wp.data;
const { compose } = wp.compose;


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
		clearInterval(this.waitLoadPosts);

		const sliderEl = $(ReactDOM.findDOMNode(this));
		const sliderSelector = $(`.${baseClass}__content`, sliderEl);

		sliderSelector.hasClass('slick-initialized') && sliderSelector.slick('unslick');
	}

	initSlider() {
		const {
			attributes: {
				sliderAnimationEffect,				
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderArrows,
				sliderDots
			},
			clientId,
			className
		} = this.props;

		this.waitLoadPosts = setInterval( () => {
			const sliderEl = $(ReactDOM.findDOMNode(this));
			const sliderSelector = $(`.${baseClass}__content`, sliderEl);

			if (sliderSelector.length && sliderSelector.hasClass('no-init-slider')){
				//Wait all images loaded
				sliderSelector.imagesLoaded().done( function( instance ) {
	
					sliderSelector.not('.slick-initialized').slick({
						arrows: sliderArrows != 'none' ? true : false,
						dots: sliderDots != 'none' ? true : false,
						rows: 0,
						slidesToShow: 1,
						slidesToScroll: 1,
						autoplay: sliderAutoplay,
						autoplaySpeed: parseInt(sliderAutoplaySpeed),
						fade: sliderAnimationEffect == 'fade' ? true : false,
						speed: parseInt(sliderAnimationSpeed),
						infinite: sliderInfinite,
	
						centerMode: false,
						variableWidth: false,
						pauseOnHover: true,
						adaptiveHeight: true,
					});
					sliderSelector.removeClass('no-init-slider');
				});

				clearInterval(this.waitLoadPosts);
			}
		}, 1);
	}

	componentDidMount(){
		this.initSlider();
	}

	componentWillUnmount() {
		this.destroySlider();
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
				postTemplate,
				textAlignment
			},
			setAttributes,
			recentPosts,
			className
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const current_id = select("core/editor").getCurrentPostId();
		this.props.attributes.currentID = current_id;

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
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
					{(!postTemplate || postTemplate == '') && (
						<AlignmentToolbar
							value={ textAlignment }
							onChange={ textAlignment => setAttributes({textAlignment}) }
						/>		
					)}			
				</BlockControls>
				<ServerSideRender
					block="getwid/post-slider"
					attributes={this.props.attributes}
				/>
			</Fragment>
		);
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);