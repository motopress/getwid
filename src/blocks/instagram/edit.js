/**
* External dependencies
*/
import { isEqual } from "lodash";
import Inspector from './inspector';
import './editor.scss';
import './style.scss';


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
} = wp.element;
const {
	BlockControls,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	ServerSideRender,
	Disabled,
	Button
} = wp.components;


/**
* Create an Component
*/
class Edit extends Component {
	constructor(props) {
		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);

		this.state = {
			checkToken : false,
			getTokenURL : 'https://instagram.com/oauth/authorize/?client_id=42816dc8ace04c5483d9f7cbd38b4ca0&redirect_uri=https://api.getmotopress.com/get_instagram_token.php&response_type=code&state='+Getwid.options_writing_url+'&hl=en'
		};
		// console.warn(Getwid.settings.instagram_token);
	}

	getInstagramData() {
		$.get( "https://api.instagram.com/v1/users/self/media/recent?access_token="+Getwid.settings.instagram_token, function( data ) {
			// console.log(data);
		});
	}

	manageInstagramToken(event, option) {
		event.preventDefault();
		const changeState = this.changeState;
		const data = {
			'action': 'getwid_instagram_token',
			'data': '',
			'option': option,
		};

		jQuery.post(Getwid.ajax_url, data, function(response) {
			if (response.data !=''){
				Getwid.settings.instagram_token = response.data;
				changeState('checkToken', true);
			}
		});
	}

	enterInstagramTokenForm() {
		// console.log(this.state);
		const {
			getTokenURL
		} = this.state;
		
		return (
			<form className={`${this.props.className}__key-form`} onSubmit={ (event) => {
				event.preventDefault();
				this.manageInstagramToken(event, 'get')				
			}}>	
				<span className={'form-title'}>{__('Connect an Instagram Account to display your feed')}.</span>

				<div className={'form-wrapper'}>
					<a href={getTokenURL} target="_blank" className={`components-button is-button is-primary instagram-auth-button`}>
						<i class="fab fa-instagram"></i>
						{__('Connect Instagram Account', 'getwid')}
					</a>
					<Button
						isDefault
						type="submit"
					>
						{__('Update', 'getwid')}
					</Button>
				</div>
			</form>
		);
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

	componentWillUnmount() {
		clearInterval(this.waitLoadInstagram);
	}

	componentDidMount() {
		if (Getwid.settings.instagram_token != ''){
			this.getInstagramData();
		}
		this.initSlider();
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

		if (Getwid.settings.instagram_token == ''){
			return this.enterInstagramTokenForm();
		}

		const {
			attributes:
			{
				align,
			},
			className,
			setAttributes
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		return (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						controls={ [ 'wide', 'full' ] }
						onChange={ value => setAttributes( { align: value } ) }
					/>
				</BlockControls>
				<Inspector {...{
					...this.props,
					...{changeState},
					...{getState},
				}} key='inspector'/>								

				{/* <Disabled> */}
					<ServerSideRender
						block="getwid/instagram"
						attributes={this.props.attributes}
					/>
				{/* </Disabled> */}

			</Fragment>
		);

	}
}
export default ( Edit );