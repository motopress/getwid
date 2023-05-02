/**
 * External dependencies
 */
import './editor.scss';
import classnames from "classnames";

/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const { Component, Fragment } = wp.element;
const apiFetch = wp.apiFetch;
const {
	addQueryArgs
} = wp.url;
const {
	SelectControl,
	BaseControl,
	ButtonGroup,
	Button,
	Spinner,
} = wp.components;


/**
* Create an Control
*/
class GetwidCustomPostTemplateControl extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			postTemplates: null,
			waitLoadTemplates: false
		};
	}

	componentWillMount() {
		this.isStillMounted = true;
		this.updateTemplates();
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	//Get Post Types
	updateTemplates() {
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/getwid/v1/templates`, {template_name : 'getwid_template_part'} ),
		} ).then(
			( templatesList ) => {
				this.waitLoadTemplates = false;
				if ( this.isStillMounted && templatesList instanceof Object ) {
					this.setState( {
						postTemplates : templatesList,
						waitLoadTemplates : false
					} );
				} else {
					this.setState( {
						postTemplates: null,
						waitLoadTemplates : false
					} );
				}
			}
		).catch(() => {
			this.setState( { waitLoadTemplates : false } );
		});
	}

	resetTemplates(){
		this.props.setValues({postTemplate: null});
	}

	render() {
		const controlClassPrefix = 'components-getwid-custom-post-template-control';

		let postTemplateArr = [];

		if (this.state.postTemplates){
			postTemplateArr = this.state.postTemplates;
		}

		const renderTempalatesSelect = () => {
			return (
				<Fragment>
					{(this.state.waitLoadTemplates) ? <Spinner/> : undefined}
					<SelectControl
						label={ __( 'Post Template', 'getwid' ) }
						className={[`${controlClassPrefix}__post-template`]}
						value={ this.props.values.postTemplate ? this.props.values.postTemplate : '' }
						onChange={ (value) => {
							//Callback
							if (this.props.callbackOn && this.props.callbackOn.includes('postTemplate')){
								this.props.onChangeCallback(value, 'postTemplate');
							} else {
								this.props.setValues({postTemplate: value});
							}
						} }
						options={[
							...[{'value': '', 'label': 'Default' }],
							...(postTemplateArr ? postTemplateArr : [])
						]}
					/>

					<ButtonGroup>
						{this.props.values.postTemplate && (
							<a href={`${Getwid.templates.edit}${this.props.values.postTemplate}&action=edit`} className="components-button is-button is-default" target="_blank">{__( 'Edit', 'getwid' )}</a>
						)}
						<a href={Getwid.templates.new} className="components-button is-button is-default" target="_blank">{__( 'New', 'getwid' )}</a>
						<a href={Getwid.templates.view} className="components-button is-button is-default" target="_blank">{__( 'View All', 'getwid' )}</a>
						<Button isSecondary onClick={ (e) => {
							this.setState( { waitLoadTemplates : true } );
							this.updateTemplates();
						}}>{__( 'Update', 'getwid' )}</Button>
					</ButtonGroup>

					{this.props.values.postTemplate && (
						<BaseControl>
							<Button isLink onClick={ (e) => { this.resetTemplates(); }}>{__( 'Reset to default', 'getwid' )}</Button>
						</BaseControl>
					)}
				</Fragment>
			);
		};

		return (
			<div
				className={classnames('components-base-control', controlClassPrefix)}
			>
				{renderTempalatesSelect()}
			</div>
		);
	}
}

export default (GetwidCustomPostTemplateControl);