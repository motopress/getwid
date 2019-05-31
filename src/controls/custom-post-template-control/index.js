/**
 * External dependencies
 */
import './editor.scss';
import {map, isEmpty, isUndefined, pickBy } from 'lodash';


/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const { Component, Fragment } = wp.element;
const apiFetch = wp.apiFetch;
const {
	addQueryArgs
} = wp.url;
const {
	select,
	withSelect,
} = wp.data;
const {
	SelectControl,
	BaseControl,
	ExternalLink,
	ButtonGroup,
	Button,
} = wp.components;


/**
* Create an Control
*/
class GetwidCustomPostTemplateControl extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			postTemplates: null,
		};		
	}

	componentWillMount() {
		this.isStillMounted = true;
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
				if ( this.isStillMounted && templatesList instanceof Object && !isEmpty( templatesList ) ) {	
					this.setState( { postTemplates : templatesList } );
				} else {
					this.setState( { postTemplates: null } );
				}
			}
		).catch(() => {
		
		});
	}

	render() {
		const {
			getwid_templates,
		} = this.props;

		const controlClassPrefix = 'components-getwid-custom-post-template-control';

		let postTemplateArr = [];	
		if (getwid_templates){
			map(getwid_templates, ( key, index ) => {
				let template = {};
				template['value'] = key.id;
				template['label'] = (key.title.raw ? key.title.raw : __( 'Template title', 'getwid' ) + '('+key.id+')');
				postTemplateArr.push(template);
			});
		}	
	
		if (this.state.postTemplates){
			postTemplateArr = this.state.postTemplates;
		}

		const renderTempalatesSelect = () => {
			return (
				<Fragment>
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
						disabled={(null == getwid_templates)}
					/>
					<ButtonGroup>
						{this.props.values.postTemplate && (
							<a href={`/wp-admin/post.php?post=${this.props.values.postTemplate}&action=edit`} className="components-button is-button is-default" target="_blank">{__( 'Edit', 'getwid' )}</a>
						)}
						<a href={Getwid.templates.new} className="components-button is-button is-default" target="_blank">{__( 'New', 'getwid' )}</a>
						<a href={Getwid.templates.view} className="components-button is-button is-default" target="_blank">{__( 'View All', 'getwid' )}</a>
						<Button isDefault onClick={ (e) => { this.updateTemplates(); }}>{__( 'Update', 'getwid' )}</Button>
					</ButtonGroup>															
				</Fragment>
			);
		};
		
		return (
			<div
				className={controlClassPrefix}
			>				
				{renderTempalatesSelect()}
			</div>	
		);
	}
}

export default withSelect( ( select, props ) => {
 	const { getEntityRecords } = select( 'core' );
	const postsQuery = pickBy( {
		per_page: -1,
	}, ( value ) => ! isUndefined( value ) );

	return {
		getwid_templates: getEntityRecords( 'postType', 'getwid_template_part', postsQuery ),
	}; 
} )( GetwidCustomPostTemplateControl );