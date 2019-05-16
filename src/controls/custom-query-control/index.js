/**
 * External dependencies
 */
import './editor.scss';
import GetwidSelectControl from 'GetwidControls/select-control';
import {isEmpty} from 'lodash';


/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const { Component, Fragment } = wp.element;
const { withInstanceId } = wp.compose;
const apiFetch = wp.apiFetch;
const {
	addQueryArgs
} = wp.url;
const {
	SelectControl,
	RangeControl,
	RadioControl,
	Spinner
} = wp.components;


/**
* Create an Control
*/
class GetwidCustomQueryControl extends Component {
	constructor() {
		super( ...arguments );

		this.firstCheckTaxonomy = true;
		this.firstCheckTerms = true;

		this.state = {
			postTypeList: null,
			taxonomyList: null,
			termsList: null,
		};
	}

	//Get Post Types
	componentWillMount() {
		this.isStillMounted = true;
		this.waitLoadPostTypes = true;
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/types` ),
		} ).then(
			( postTypeList ) => {
				this.waitLoadPostTypes = false;
				if ( this.isStillMounted ) {
					this.setState( { postTypeList } );
				}
			}
		).catch(() => {
			this.waitLoadPostTypes = false;
		});
	}

	//Get Taxonomy
	getTaxonomyFromCustomPostType(postType){
		if (typeof postType != 'undefined' && postType != ''){
			this.waitLoadTaxonomy = true;
			this.firstCheckTaxonomy = false;
			this.fetchRequest = apiFetch( {
				path: addQueryArgs( `/wp/v2/getwid-get-taxonomy`, {post_type_name : postType} ),
			} ).then(
				( taxonomyList ) => {
					this.waitLoadTaxonomy = false;
					if ( this.isStillMounted && Array.isArray(taxonomyList) && taxonomyList.length ) {						
						this.setState( { taxonomyList } );
					} else {
						this.setState( { taxonomyList: null } );
					}
				}
			).catch(() => {
				this.waitLoadTaxonomy = false;
			});
		}
	}
	
	//Get Terms
	getTermsFromTaxonomy(taxonomy){
		if (typeof taxonomy != 'undefined' && taxonomy != ''){
			this.waitLoadTerms = true;
			this.firstCheckTerms = false;
			this.fetchRequest = apiFetch( {
				path: addQueryArgs( `/wp/v2/getwid-get-terms`, {taxonomy_name : taxonomy} ),
			} ).then(
				( termsList ) => {
					this.waitLoadTerms = false;
					if ( this.isStillMounted && termsList instanceof Object && !isEmpty( termsList ) ) {	
						this.setState( { termsList } );
					} else {
						this.setState( { termsList: null } );
					}
				}
			).catch(() => {
				this.waitLoadTerms = false;
			});
		}
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	render() {
		console.warn(this.state.postTypeList);

		const controlClassPrefix = 'components-getwid-custom-query-control';
		const controlID = `inspector-getwid-custom-query-control-${ this.props.instanceId }`;

		const postTypeArr = [];
		if (this.state.postTypeList){
			for (const key in this.state.postTypeList) {
				if (!['attachment', 'wp_block'].includes(key)){
					// if (this.state.postTypeList[key]['taxonomies'].length){
						let postType = {};
						postType['value'] = this.state.postTypeList[key]['slug'];
						postType['label'] = this.state.postTypeList[key]['name'];
						postTypeArr.push(postType);
					// }
				}
			}
		}

		const renderPostTypeSelect = () => {
			
			if (null == this.state.taxonomyList && this.props.postType && this.firstCheckTaxonomy){
				this.getTaxonomyFromCustomPostType(this.props.postType);
			}

			return (
				<Fragment>
					{(this.waitLoadPostTypes) ? <Spinner/> : undefined}

					<SelectControl
						label={ __( 'Post Type', 'getwid' ) }
						className={[`${controlClassPrefix}__post-type`]}
						value={ this.props.postType ? this.props.postType : '' }
						onChange={ (value) => {
	
							//Reset values
							this.setState( {
								taxonomyList: null,
								termsList: null,
							} );
	
							this.props.onChangePostType(value);
							this.getTaxonomyFromCustomPostType(value);
						} }
						options={[
							...[{'value': '', 'label': '-' }],
							...(postTypeArr ? postTypeArr : [])
						]}
						disabled={(null == this.state.postTypeList)}
					/>
				</Fragment>
			);
		};

		const renderTaxonomySelect = () => {

			if (null == this.state.termsList && this.props.taxonomy && this.firstCheckTerms){
				this.getTermsFromTaxonomy(this.props.taxonomy);
			}

			return (
				<Fragment>
					{(this.waitLoadTaxonomy) ? <Spinner/> : undefined}

					<SelectControl
						label={ __( 'Taxonomies', 'getwid' ) }
						help={ __( 'Hold ctrl/cmd key to select multiple.', 'getwid' ) }
						className={[`${controlClassPrefix}__taxonomy`]}
						value={ this.props.taxonomy ? this.props.taxonomy : '' }
						onChange={ (value) => {
							
							//Reset values
							this.setState( {
								termsList: null,
							} );

							this.props.onChangeTaxonomy(value);
							this.getTermsFromTaxonomy(value);
						} }
						multiple
						size = {7}
						options={this.state.taxonomyList ? this.state.taxonomyList : [{'value': '', 'label': ''}]}
						disabled={(null == this.state.taxonomyList)}
					/>
				</Fragment>
			);
		};

		const renderTermsSelect = () => {

			return (
				<Fragment>
					{(this.waitLoadTerms) ? <Spinner/> : undefined}
				
					<GetwidSelectControl
						label={ __( 'Terms', 'getwid' ) }
						help={ __( 'Hold ctrl/cmd key to select multiple.', 'getwid' ) }
						className={[`${controlClassPrefix}__terms`]}
						multiple
						groups
						size = {7}
						value={ this.props.terms ? this.props.terms : [] }
						onChange={ (value) => {
							this.props.onChangeTerms(value);
						} }
						options={
							(
								this.state.termsList ? this.state.termsList :								
								{
									'' : {
										group_name : '',
										group_value : [
											{'value': '', 'label': ''}
										]
									}
								}
							)
						}							
						disabled={(null == this.state.termsList)}
					/>
				</Fragment>
			);
		};
		
		return (
			<div
				className={controlClassPrefix}
				id={ controlID }
			>				
				<RangeControl
					label={ __( 'Number of items', 'getwid' ) }
					value={ this.props.postsToShow }
					onChange={ (value) => {
							this.props.onChangePostsToShow(value);
					} }
					min={ 0 }
					max={ 100 }
					step={ 1 }
				/>

				{renderPostTypeSelect()}
				{renderTaxonomySelect()}
				{renderTermsSelect()}

				<RadioControl
				    label={__('Relation', 'getwid')}
				    selected={ this.props.relation ? this.props.relation : '' }
				    options={ [
						{value: 'AND', label: __('Item should have all of selected terms.', 'getwid')},
						{value: 'OR', label: __('Item should have at one of selected terms.', 'getwid')},
				    ] }
					onChange={ (value) => {
						this.props.onChangeRelation(value);
					} }
				/>

				<SelectControl
					label={ __( 'Order', 'getwid' ) }
					className={[`${controlClassPrefix}__order`]}
					value={ this.props.order ? this.props.order : '' }
					onChange={ (value) => {
						this.props.onChangeOrder(value);
					} }
					options={[
						{value: 'desc', label: __('Z → A, 9 → 1', 'getwid')},
						{value: 'asc', label: __('A → Z, 1 → 9', 'getwid')},
					]}
				/>

				<SelectControl
					label={ __( 'Order by', 'getwid' ) }
					className={[`${controlClassPrefix}__order-by`]}
					value={ this.props.orderBy ? this.props.orderBy : '' }
					onChange={ (value) => {
						this.props.onChangeOrderBy(value);
					} }
					options={[
						{value: 'title', label: __('Title', 'getwid')},
						{value: 'date', label: __('Date', 'getwid')},
						{value: 'menu_order', label: __('Menu order', 'getwid')},
						{value: 'rand', label: __('Random', 'getwid')},
					]}
				/>

			</div>	
		);
	}
}

export default withInstanceId(GetwidCustomQueryControl);