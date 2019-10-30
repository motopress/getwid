/**
* Internal dependencies
*/
import Inspector from './inspector';

import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';
import { map } from 'lodash';

const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { InnerBlocks, RichText, withColors } = wp.blockEditor;
const { TextControl, Button } = wp.components;

/**
* Module Constants
*/
const mainBlock = 'mailchimp';

const ALLOWED_BLOCKS = [
	`getwid/${mainBlock}-field-email`,
	`getwid/${mainBlock}-field-first-name`,
	`getwid/${mainBlock}-field-last-name`,
	'core/paragraph'
];

/**
* Create an Component
*/
class GetwidSubscribeForm extends Component {

	constructor() {
		super(...arguments);

		this.changeData = this.changeData.bind( this );
		this.getData    = this.getData   .bind( this );

		this.manageMailchimpApiKey     = this.manageMailchimpApiKey    .bind( this );
		this.renderMailchimpApiKeyForm = this.renderMailchimpApiKeyForm.bind( this );

		this.setGroupsName = this.setGroupsName.bind( this );

		this.state = {
			mailchimpApiKey: Getwid.settings.mailchimp_api_key != '' ? Getwid.settings.mailchimp_api_key   : '',
			checkApiKey    : Getwid.settings.mailchimp_api_key != '' ? Getwid.settings.mailchimp_api_key   : '',

			firstInit: false,
			waitLoadList: true,
			error: '',
			list: []
		};
	}

	changeData ( data ) {
		this.setState( { ...data } );
	}

	getData ( value ) {
		return this.state[ value ];
	}

	renderMailchimpApiKeyForm() {
		const { baseClass } = this.props.attributes;
		return (
			<form className={`${baseClass}__key-form`} onSubmit={ event => this.manageMailchimpApiKey( event, 'sync')}>
				<span className={'form-title'}>{__( 'Mailchimp API key.', 'getwid' )} <a href='https://mailchimp.com/help/about-api-keys/#Find_or_Generate_Your_API_Key' target='_blank'>{__( 'Get your key.', 'getwid' )}</a></span>

				<div className={'form-wrapper'}>
					<TextControl
						placeholder={__( 'Mailchimp API Key', 'getwid' )}
						onChange={ value => this.changeData( { checkApiKey: value } ) } 
					/>

					<Button
						isPrimary
						type='submit'
						disabled={this.getData( 'checkApiKey' ) != '' ? null : true}
					>
						{__( 'Save API Key', 'getwid' )}
					</Button>
				</div>
			</form>
		);
	}

	manageMailchimpApiKey(event, option) {

		if ( event ) {
			event.preventDefault();
		}		

		const { getData, changeData } = this;

		const data = {
			'action': 'getwid_mailchimp_api_key_manage',
			'data': {
				'api_key': getData( 'checkApiKey' )
			},
			'option': option,
			'nonce' : Getwid.nonces.mailchimp_api_key
		};

		if ( option == 'sync' || option == 'save' ) {
			Getwid.settings.mailchimp_api_key = getData( 'checkApiKey' );

			const { waitLoadList } = this.state;
			if ( ! waitLoadList ) {
				changeData( { waitLoadList: true } );
			}

			$.post( Getwid.ajax_url, data, response => {
				changeData( { waitLoadList: false } );

				( ! response.success ) ? changeData( {
					error: response.data,
					list: []
				} ) : changeData( {
					error: '',
					list: response.data,
				} );
			} );
			changeData( { firstInit: true } );

		} else if ( option == 'delete' ) {
			Getwid.settings.mailchimp_api_key = '';
			$.post( Getwid.ajax_url, data );
		}
	}

	setGroupsName() {
		const { list } = this.state;

		let options = [];
		if ( list.length ) {
			map( list, item => {
				options.push( { value: item.id, label: item.title } );

				const listID = item.id;

				map( item.categories, item => {
					map( item.interests, item => {
						options.push( { value: `${listID}/${item.id}`, label: item.title } );
					} );
				} );
			} );
		}
		return options;
	}

	componentDidUpdate() {
		/* */
	}

	componentDidMount() {
		if ( Getwid.settings.mailchimp_api_key != '' ) {
			this.manageMailchimpApiKey( null, 'save' );
		}
	}

	render() {

		if ( Getwid.settings.mailchimp_api_key == '' ) {
			return this.renderMailchimpApiKeyForm();
		}

		const { className, textColor, backgroundColor, baseClass } = this.props;

		const buttonSubmitClass = classnames(
			'wp-block-button__link', {
				'has-background': backgroundColor.color,
				[backgroundColor.class]: backgroundColor.class,

				'has-text-color': textColor.color,
				[textColor.class]: textColor.class
			}
		);

		const changeData = this.changeData;
		const getData    = this.getData;

		const setGroupsName = this.setGroupsName;
		const manageMailchimpApiKey = this.manageMailchimpApiKey;

		return (
			<Fragment>
				<Inspector {...{
					...this.props,
					...{setGroupsName},
					...{manageMailchimpApiKey},
					...{changeData},
					...{getData}
				}} key='inspector'/>
				<div className={ `${className}` }>
					<div className={ `${baseClass}__wrapper` }>
						<InnerBlocks
							templateInsertUpdatesSelection={ false }
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ [
								[ `getwid/${mainBlock}-field-first-name` , { required: false } ],
								[ `getwid/${mainBlock}-field-last-name`  , { required: false } ],

								[ `getwid/${mainBlock}-field-email`      , { required: true  } ]
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