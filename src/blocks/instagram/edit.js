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
			getTokenURL : 'https://instagram.com/oauth/authorize/?client_id=42816dc8ace04c5483d9f7cbd38b4ca0&redirect_uri=https://api.getmotopress.com/get_instagram_token.php&response_type=code&state='+Getwid.settings.getwid_settings_url+'&hl=en'
		};

		console.warn(Getwid.settings.instagram_token);
	}

	getInstagramData() {
		$.get( "https://api.instagram.com/v1/users/self/media/recent?access_token="+Getwid.settings.instagram_token, function( data ) {
			console.log(data);
		});
	}

	manageInstagramToken(event, option) {
		event.preventDefault();

		const data = {
			'action': 'getwid_instagram_token',
			'data': this.getState('checkToken'),
			'option': option,
		};

		if (option == 'set'){
			Getwid.settings.instagram_token = this.getState('checkToken');
		} else if (option == 'delete'){
			Getwid.settings.instagram_token = '';
		}

		jQuery.post(Getwid.ajax_url, data, function(response) {});
	}

	enterInstagramTokenForm() {
		console.log(this.state);

		const {
			getTokenURL
		} = this.state;
		
		return (
			<form className={`${this.props.className}__key-form`} onSubmit={ event => this.manageInstagramToken(event, 'set')}>							
				<div className={'form-wrapper'}>

					<a href={getTokenURL} target="_blank" className={`components-button is-button is-primary instagram-auth-button`}>
						<i class="fab fa-instagram"></i>
						{__('Connect Instagram Account', 'getwid')}
					</a>

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