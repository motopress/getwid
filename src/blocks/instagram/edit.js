/**
* External dependencies
*/
import { merge, isEqual, escape, unescape } from "lodash";
import classnames from 'classnames';
import stylesArr from 'GetwidUtils/map-styles';
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
	BlockControls,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	Button,
	IconButton,
	TextControl,
	ServerSideRender,
	Disabled	
} = wp.components;
const { __, sprintf } = wp.i18n;


/**
* Create an Component
*/
class Edit extends Component {
	constructor(props) {

		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);
		this.manageInstagramToken = this.manageInstagramToken.bind(this);
		// this.removeInstagramToken = this.removeInstagramToken.bind(this);

		this.state = {
			instagramToken : Getwid.settings.instagram_token != '' ? Getwid.settings.instagram_token : '',
			checkToken : Getwid.settings.instagram_token != '' ? Getwid.settings.instagram_token : '',
			// instagramObj: undefined,
			// instagramUser : undefined,
		};

		console.warn(Getwid.settings.instagram_token);
	}

	getInstagramData() {
		$.get( "https://api.instagram.com/v1/users/7705691465/media/recent?access_token="+Getwid.settings.instagram_token, function( data ) {
			console.log(data);
		});
	}

	// removeInstagramToken() {
	// 	const main_google_js = $('#google_api_js');

	// 	if (main_google_js.length){
	// 		main_google_js.remove();
	// 	}

	// 	const other_google_js = $("script[src*='maps.googleapis.com']");

	// 	if (other_google_js.length){
	// 		$.each(other_google_js, function(index, val) {
	// 			$(val).remove();
	// 		});
	// 	}

	// 	window.google = {};
	// }

	manageInstagramToken(event, option) {
		event.preventDefault();

		const data = {
			'action': 'getwid_instagram_token',
			'data': this.getState('checkToken'),
			'option': option,
			// 'nonce': Getwid.nonces.instagram_token
		};

		if (option == 'set'){
			Getwid.settings.instagram_token = this.getState('checkToken');
			// this.addGoogleAPIScript();
		} else if (option == 'delete'){
			Getwid.settings.instagram_token = '';
		}

		jQuery.post(Getwid.ajax_url, data, function(response) {});
	}

	enterInstagramTokenForm() {
		return (
			<form className={`${this.props.className}__key-form`} onSubmit={ event => this.manageInstagramToken(event, 'set')}>
				<span className={'form-title'}>{__('Instagram Access token.', 'getwid')} <a href="https://www.instagram.com/developer/authentication/" target="_blank">{__('Get your key.', 'getwid')}</a></span>
				
				<div className={'form-wrapper'}>

					<a href="#" className={`components-button is-button is-primary instagram-auth-button`}>
						<i class="fab fa-instagram"></i>
						{__('Connect Instagram Account', 'getwid')}
					</a>

					<TextControl
						placeholder={__('Instagram Access token', 'getwid')}
						onChange={ value => this.changeState('checkToken', value) }
					/>

						

					<Button
						isPrimary
						type="submit"
						disabled={((this.getState('checkToken') != '') ? null : true)}	
					>
						{__('Connect Instagram Account', 'getwid')}
						
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

	componentDidMount() {
		if (this.getState('instagramToken') != ''){
			this.getInstagramData();
		}
	}

	componentDidUpdate(prevProps, prevState) {

		// const allowRender = 
			// this.state.firstInit == true ||
			// (!isEqual(this.props.attributes.userName, prevProps.attributes.userName));

		// if (Getwid.settings.instagram_token != '' && allowRender){
			// this.checkInstagramUser();
			// this.initMap(!!prevItems.length, prevProps );
		// }
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
		const manageInstagramToken = this.manageInstagramToken;
		// const removeInstagramToken = this.removeInstagramToken;

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
					...{manageInstagramToken},
					// ...{removeInstagramToken},
				}} key='inspector'/>

				<Disabled>
					<ServerSideRender
						block="getwid/instagram"
						attributes={this.props.attributes}
					/>
				</Disabled>

			</Fragment>
		);

	}
}
export default ( Edit );