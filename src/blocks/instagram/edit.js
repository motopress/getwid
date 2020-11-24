/**
* External dependencies
*/
import Inspector from './inspector';

import './editor.scss';
import './style.scss';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const {
	Component,
	Fragment,
} = wp.element;
const {
	BlockControls,
	BlockAlignmentToolbar,
} = wp.blockEditor || wp.editor;
const {
	ServerSideRender,
	Button,
	Disabled
} = wp.components;

/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.changeState = this.changeState.bind( this );
		this.getState    = this.getState   .bind( this );

		this.state = {
			checkToken : false,
			getTokenURL : 'https://api.instagram.com/oauth/authorize?client_id=910186402812397&redirect_uri=https://api.getmotopress.com/get_instagram_token.php&scope=user_profile,user_media&response_type=code&state='+Getwid.options_writing_url
		};
	}

	manageInstagramToken(event, option) {
		event.preventDefault();
		const changeState = this.changeState;

		const data = {
			'action': 'get_instagram_token',
			'data': '',
			'option': option
		};

		jQuery.post( Getwid.ajax_url, data, response => {
			if ( response.data !='' ) {
				Getwid.settings.instagram_token = response.data;
				changeState( 'checkToken', true );
			}
		});
	}

	enterInstagramTokenForm() {
		const {
			getTokenURL
		} = this.state;

		return (
			<form className={`${this.props.className}__key-form`} onSubmit={ event => {
				event.preventDefault();
				this.manageInstagramToken( event, 'get' );
			}}>
				<span className={'form-title'}>{__('Connect Instagram Account', 'getwid')}</span>

				<div className={'form-wrapper'}>
					<a href={getTokenURL} target="_blank" className={`components-button is-button is-primary getwid-instagram-auth-button`}>
						{__( 'Connect Instagram Account', 'getwid' )}
					</a>
					<Button
						isDefault
						type='submit'
					>
						{__( 'Update', 'getwid' )}
					</Button>
				</div>
				<span className={'form-description'}>{__( 'Click Connect Instagram Account and authorize the app in a new tab to receive access token. Then return to this tab and click Update. You can revoke the granted access any time in your Instagram profile settings.', 'getwid' )}</span>
			</form>
		);
	}

	changeState (param, value) {
		this.setState( { [ param ]: value } );
	}

	getState (value) {
		return this.state[ value ];
	}

	render() {

		if ( Getwid.settings.instagram_token == '' ) {
			return this.enterInstagramTokenForm();
		}

		const {
			attributes: {
				align
			},
			setAttributes
		} = this.props;

		const changeState = this.changeState;
		const getState    = this.getState;

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

				<Disabled>
					<ServerSideRender
						block='getwid/instagram'
						attributes={this.props.attributes}
					/>
				</Disabled>
			</Fragment>
		);

	}
}
export default ( Edit );