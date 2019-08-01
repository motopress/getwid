/**
* Internal dependencies
*/
import Inspector from './inspector';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { InnerBlocks, RichText, withColors } = wp.editor;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [
	'getwid/field-subscriptions',
	'getwid/field-first-name',
	'getwid/field-last-name'
];

/**
* Create an Component
*/
class GetwidSubscribeForm extends Component {

	constructor() {
		super(...arguments);

		this.changeState = this.changeState.bind( this );
		this.getState    = this.getState.bind( this );

		this.manageMailchimpApiKey = this.manageMailchimpApiKey.bind( this );

		/* #region Test */
		this.getAccountSubscribeLists = this.getAccountSubscribeLists.bind( this );
		/* #endregion */

		this.state = {
			mailchimpApiKey: Getwid.settings.mailchimp_api_key != '' ? Getwid.settings.mailchimp_api_key   : '',
			checkApiKey    : Getwid.settings.mailchimp_api_key != '' ? Getwid.settings.mailchimp_api_key   : ' ',
		};
	}

	changeState ( param, value ) {
		this.setState( { [param]: value } );
	}

	getState ( value ) {
		return this.state[ value ];
	}

	/* #region Mailchimp manage */
	manageMailchimpApiKey(event, option) {
		event.preventDefault();

		const { getState } = this;

		const data = {
			'action': 'getwid_mailchimp_api_key',
			'data': {
				'api_key': getState( 'checkApiKey' ),
			},
			'option': option,
			'nonce': Getwid.nonces.mailchimp_api_key
		};

		if ( option == 'set' ) {
			Getwid.settings.mailchimp_api_key = getState( 'checkApiKey' );
		} else if ( option == 'delete' ) {
			Getwid.settings.mailchimp_api_key = '';
		}

		$.post( Getwid.ajax_url, data );
	}	
	/* #endregion */

	/* #region Test */
	getAccountSubscribeLists() {
		$.post( Getwid.ajax_url, { 'action': 'getwid_mailchimp_get_account_subscribe_lists' }, ( response ) => {
			console.log( response );
		} );
	}
	/* #endregion */

	componentDidMount() {
		this.getAccountSubscribeLists();
	}

	render() {
		const { className, textColor, backgroundColor, subscribeFormClass } = this.props;
		
		const buttonSubmitClass = classnames(
			'wp-block-button__link', {
				'has-background': backgroundColor.color,
				[backgroundColor.class]: backgroundColor.class,

				'has-text-color': textColor.color,
				[textColor.class]: textColor.class
			}
		);

		const changeState = this.changeState;
		const getState    = this.getState;

		const manageMailchimpApiKey = this.manageMailchimpApiKey;

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					manageMailchimpApiKey,
					changeState,
					getState,
				}} key='inspector'/>
				<div className={ `${className}` }>
					<div className={ `${subscribeFormClass}__wrapper` }>
						<InnerBlocks
							templateInsertUpdatesSelection={ false }
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ [
								[ 'getwid/field-subscriptions'  , { required: true } ]
							] }
						/>
					</div>
					<div className={ 'wp-block-button' }>
						<RichText
							placeholder={ __( 'Write text…', 'getwid' ) }
							value={ this.props.attributes.text }
							formattingControls= { [ 'bold', 'italic', 'strikethrough' ] }
							onChange= { text =>
								this.props.setAttributes( { text } )
							}
							className={ buttonSubmitClass }
							style={ {
								backgroundColor: backgroundColor.color,
								color: textColor.color
							} }
							keepPlaceholderOnFocus
						/>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } )
] )( GetwidSubscribeForm );