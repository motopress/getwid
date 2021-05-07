/**
 * External dependencies
 */
import './editor.scss';
import GetwidSelectControl from 'GetwidControls/select-control';
import { map, isEmpty, isUndefined, pickBy } from 'lodash';
import classnames from "classnames";

/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const { jQuery: $ } = window;
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
	ToggleControl,
	Spinner,
	TextControl,
	PanelBody,
} = wp.components;


/**
* Create an Control
*/
class GetwidCustomQueryControl extends Component {
	constructor() {
		super( ...arguments );

		this.firstCheckTaxonomy = true;
		this.firstCheckTerms = true;
		this.firstCheckField = true;

		this.state = {
			postTypeList: null,
			taxonomyList: null,
			termsList: null,
			fieldTypeList: null,
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
				path: addQueryArgs( `/getwid/v1/taxonomies`, {post_type_name : postType} ),
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
	getTermsFromTaxonomy(taxonomy) {
		if (typeof taxonomy != 'undefined' && taxonomy != ''){
			this.waitLoadTerms = true;
			this.firstCheckTerms = false;
			this.fetchRequest = apiFetch( {
				path: addQueryArgs( `/getwid/v1/terms`, {taxonomy_name : taxonomy} ),
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

	//Get Field Type from ACF
	getFieldTypeFromAcf( postType ) {
		if ( typeof postType != 'undefined' && postType != '' ) {
			this.waitLoadFieldType = true;
			this.firstCheckField   = false;
			this.fetchRequest 	   = apiFetch( {
				path: addQueryArgs( `/getwid/v1/field_types`, { post_type_name: postType } ),
			} ).then(
				fieldTypeList => {
					this.waitLoadFieldType = false;

					if ( this.isStillMounted && Array.isArray( fieldTypeList ) && fieldTypeList.length ) {
						this.setState( { fieldTypeList } );
					} else {
						this.setState( { fieldTypeList: null } );
					}
				}
			).catch( () => {
				this.waitLoadFieldType = false;
			} );
		}
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	render() {
		const controlClassPrefix = 'components-getwid-custom-query-control';
		const postTypeArr = [];
		if (this.state.postTypeList){
			for (const key in this.state.postTypeList) {
				if (!['attachment', 'wp_block', 'getwid_template_part', 'getwid_template'].includes(key)){
					let postType = {};
					postType['value'] = this.state.postTypeList[key]['slug'];
					postType['label'] = this.state.postTypeList[key]['name'];
					postTypeArr.push(postType);
				}
			}
		}

		const renderPagination = () => {

			if (this.props.options && this.props.options.includes('page')){
				return (
					<Fragment>
						<ToggleControl
							label={ __( 'Use pagination', 'getwid' ) }
							checked={ this.props.values.pagination ? this.props.values.pagination : false }
							onChange={ (value) => {
								//Callback
								if (this.props.callbackOn && this.props.callbackOn.includes('pagination')){
									this.props.onChangeCallback(value, 'pagination');
								} else {
									this.props.setValues({pagination: !this.props.values.pagination})
								}
							}}
						/>
					</Fragment>
				);
			}

		};

		const renderSticky = () => {

			if (this.props.options && this.props.options.includes('sticky')){
				return (
					<Fragment>
						<ToggleControl
							label={ __( 'Ignore Sticky posts', 'getwid' ) }
							checked={ this.props.values.ignoreSticky ? this.props.values.ignoreSticky : false }
							onChange={ (value) => {
								//Callback
								if (this.props.callbackOn && this.props.callbackOn.includes('ignoreSticky')){
									this.props.onChangeCallback(value, 'ignoreSticky');
								} else {
									this.props.setValues({ignoreSticky: !this.props.values.ignoreSticky})
								}
							}}
						/>
					</Fragment>
				);
			}

		};

		const renderParentFilterID = () => {

			if (this.props.options && this.props.options.includes('parentFilter')){
				return (
					<Fragment>

						<ToggleControl
							label={ __( 'Display child pages of current page', 'getwid' ) }
							checked={ this.props.values.childPagesCurrentPage ? this.props.values.childPagesCurrentPage : false }
							onChange={ (value) => {
								//Callback
								if (this.props.callbackOn && this.props.callbackOn.includes('childPagesCurrentPage')){
									this.props.onChangeCallback(value, 'childPagesCurrentPage');
								} else {
									this.props.setValues({childPagesCurrentPage: !this.props.values.childPagesCurrentPage})
								}
							}}
						/>

						{this.props.values.childPagesCurrentPage == false && (
							<TextControl
								label={__('Enter page ID to display its child pages', 'getwid')}
								help={__('Parent page ID', 'getwid')}
								value={ this.props.values.parentPageId ? this.props.values.parentPageId : '' }
								onChange={ (value) => {
									//Callback
									if (this.props.callbackOn && this.props.callbackOn.includes('parentPageId')){
										this.props.onChangeCallback(value, 'parentPageId');
									} else {
										this.props.setValues({parentPageId: value})
									}
								} }
							/>
						)}

					</Fragment>
				);
			}

		};

		const renderPostTypeSelect = () => {

			if (null == this.state.taxonomyList && this.props.values.postType && this.firstCheckTaxonomy){
				this.getTaxonomyFromCustomPostType(this.props.values.postType);
			}

			return (
				<Fragment>
					{(this.waitLoadPostTypes) ? <Spinner/> : undefined}

					<SelectControl
						label={ __( 'Choose what to display', 'getwid' ) }
						className={[`${controlClassPrefix}__post-type`]}
						value={ this.props.values.postType ? this.props.values.postType : '' }
						onChange={ (value) => {
							//Reset values
							this.setState( {
								taxonomyList: null,
								termsList: null,
							} );

							//Callback
							if (this.props.callbackOn && this.props.callbackOn.includes('postType')){
								this.props.onChangeCallback(value, 'postType');
							} else {
								//Set values
								if (value == ''){
									this.props.setValues({
										postType: undefined,
										taxonomy: undefined,
										terms: undefined,
										filterTypes: undefined,

									});
								} else {
									this.props.setValues({
										postType: value,
										taxonomy: undefined,
										terms: undefined,
										filterTypes: undefined,

									});
								}
							}

							this.getTaxonomyFromCustomPostType(value);
							this.getFieldTypeFromAcf(value);
						} }
						options={[
							...(postTypeArr ? postTypeArr : [{'value': '', 'label': '-' }])
						]}
						disabled={(null == this.state.postTypeList)}
					/>
				</Fragment>
			);
		};

		const renderTaxonomySelect = () => {

			if (null == this.state.termsList && this.props.values.taxonomy && this.firstCheckTerms){
				this.getTermsFromTaxonomy(this.props.values.taxonomy);
			}

			return (
				<Fragment>
					{(this.waitLoadTaxonomy) ? <Spinner/> : undefined}

					<SelectControl
						label={ __( 'Taxonomies', 'getwid' ) }
						help={ __( 'Hold ctrl/cmd to select multiple or deselect', 'getwid' ) }
						className={[`${controlClassPrefix}__taxonomy`]}
						value={ this.props.values.taxonomy ? this.props.values.taxonomy : '' }
						onChange={ (value) => {
							//Reset values
							this.setState( {
								termsList: null,
							} );

							//Callback
							if (this.props.callbackOn && this.props.callbackOn.includes('taxonomy')){
								this.props.onChangeCallback(value, 'taxonomy');
							} else {
								//Set values
								if (value == ''){
									this.props.setValues({
										taxonomy: undefined,
										terms: undefined,
										filterTypes: undefined,

									});
								} else {
									this.props.setValues({
										taxonomy: value,
										terms: undefined,
										filterTypes: undefined,

									});
								}
							}

							this.getTermsFromTaxonomy(value);
						} }
						multiple
						size = {5}
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
						help={ __( 'Hold ctrl/cmd to select multiple or deselect', 'getwid' ) }
						className={[`${controlClassPrefix}__terms`]}
						multiple
						groups
						size = {5}
						value={ this.props.values.terms ? this.props.values.terms : [] }
						onChange={ (value) => {
							//Callback
							if (this.props.callbackOn && this.props.callbackOn.includes('terms')){
								this.props.onChangeCallback(value, 'terms');
							} else {
								if (!value.length){
									this.props.setValues({
										terms: undefined,
										filterTypes: undefined,
									});
								} else {
									this.props.setValues({
										terms: value,
										filterTypes: undefined,
									});
								}
							}
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

		const renderFieldTypeSelectACF = () => {
			if ( null == this.state.fieldTypeList && this.props.values.postType && this.firstCheckField ) {
 				this.getFieldTypeFromAcf( this.props.values.postType );
			}

			return (
				<Fragment>
					{ ( this.waitLoadFieldType ) ? <Spinner/> : undefined }

					<SelectControl
						label={ __( 'Field Types (ACF)', 'getwid' ) }
						help={ __( 'Hold ctrl/cmd to select multiple or deselect', 'getwid' ) }
						className={ [ `${controlClassPrefix}__taxonomy` ] }
						value={ this.props.values.filterTypes ? this.props.values.filterTypes : '' }
						onChange={ value => {
							//Reset values
							this.setState( {
								fieldTypeList: null,
							} );

							//Callback
							if ( this.props.callbackOn && this.props.callbackOn.includes('filterTypes') ) {
								this.props.onChangeCallback( value, 'filterTypes' );
							} else {
								if ( ! value.length ) {
									this.props.setValues( {
										filterTypes: undefined,
									} );
								} else {
									this.props.setValues( {
										filterTypes: value,
									} );
								}
							}

							this.getFieldTypeFromAcf( this.props.values.postType );
						} }
						multiple
						size={5}
						options={ this.state.fieldTypeList ? this.state.fieldTypeList : [ { 'value': '', 'label': '-' } ] }
						disabled={ ( null == this.state.fieldTypeList ) }
					/>
				</Fragment>
			);
		};

		return (
			<div
				className={classnames('components-base-control', controlClassPrefix)}
			>
				{ renderPostTypeSelect() }

				<RangeControl
					label={ (this.props.options && this.props.options.includes('page') && this.props.values.pagination) ? __( 'Number of items per page', 'getwid' ) : __( 'Number of items', 'getwid' ) }
					value={ this.props.values.postsToShow }
					onChange={ (value) => {
						//Callback
						if (this.props.callbackOn && this.props.callbackOn.includes('postsToShow')){
							this.props.onChangeCallback(value, 'postsToShow');
						} else {
							this.props.setValues({postsToShow: value});
						}
					} }
					min={ -1 }
					max={ 100 }
					step={ 1 }
				/>

				<RangeControl
					label={ __( 'Number of posts to pass over', 'getwid' ) }
					value={ this.props.values.offset }
					onChange={ (value) => {
						//Callback
						if (this.props.callbackOn && this.props.callbackOn.includes('offset')){
							this.props.onChangeCallback(value, 'offset');
						} else {
							this.props.setValues({offset: value});
						}
					} }
					min={ 0 }
					max={ 100 }
					step={ 1 }
				/>

				{ renderPagination() }

				<PanelBody title={ __( 'Sorting and Filtering', 'getwid' ) } initialOpen={false} >

					<SelectControl
						label={ __( 'Order', 'getwid' ) }
						className={[`${controlClassPrefix}__order`]}
						value={ this.props.values.order ? this.props.values.order : '' }
						onChange={ (value) => {
							//Callback
							if (this.props.callbackOn && this.props.callbackOn.includes('order')){
								this.props.onChangeCallback(value, 'order');
							} else {
								this.props.setValues({order: value})
							}
						} }
						options={[
							{value: 'desc', label: __('Z → A, 9 → 1', 'getwid')},
							{value: 'asc', label: __('A → Z, 1 → 9', 'getwid')},
						]}
					/>

					<SelectControl
						label={ __( 'Order by', 'getwid' ) }
						className={[`${controlClassPrefix}__order-by`]}
						value={ this.props.values.orderBy ? this.props.values.orderBy : '' }
						onChange={ (value) => {
							//Callback
							if (this.props.callbackOn && this.props.callbackOn.includes('orderBy')){
								this.props.onChangeCallback(value, 'orderBy');
							} else {
								this.props.setValues({orderBy: value})
							}
						} }
						options={[
							{value: 'title', label: __('Title', 'getwid')},
							{value: 'date', label: __('Date', 'getwid')},
							{value: 'rand', label: __('Random', 'getwid')},
							{value: 'author', label: __('Author', 'getwid')},
							{value: 'modified', label: __('Last modified date', 'getwid')},
							{value: 'menu_order', label: __('Menu order', 'getwid')},
						]}
					/>

					{ this.props.values.postType != 'page' && renderSticky() }

					<TextControl
						label={__('Display only the specific posts', 'getwid')}
						help={__('Comma-separated IDs', 'getwid')}
						value={ this.props.values.filterById ? this.props.values.filterById : '' }
						onChange={ (value) => {
							//Callback
							if (this.props.callbackOn && this.props.callbackOn.includes('filterById')){
								this.props.onChangeCallback(value, 'filterById');
							} else {
								this.props.setValues({filterById: value})
							}
						} }
					/>

					<TextControl
						label={__('Display all posts but NOT the specified ones', 'getwid')}
						help={__('Comma-separated IDs', 'getwid')}
						value={ this.props.values.excludeById ? this.props.values.excludeById : '' }
						onChange={ (value) => {
							//Callback
							if (this.props.callbackOn && this.props.callbackOn.includes('excludeById')){
								this.props.onChangeCallback(value, 'excludeById');
							} else {
								this.props.setValues({excludeById: value})
							}
						} }
					/>

					<ToggleControl
						label={ __( 'Exclude Current Post', 'getwid' ) }
						checked={ this.props.values.excludeCurrentPost ? this.props.values.excludeCurrentPost : false }
						onChange={ (value) => {
							//Callback
							if (this.props.callbackOn && this.props.callbackOn.includes('excludeCurrentPost')){
								this.props.onChangeCallback(value, 'excludeCurrentPost');
							} else {
								this.props.setValues({excludeCurrentPost: !this.props.values.excludeCurrentPost})
							}
						}}
					/>

					{ this.props.values.postType == 'page' && renderParentFilterID() }

					{ this.props.values.postType != 'page' && renderTaxonomySelect() }
					{ this.props.values.postType != 'page' && renderTermsSelect() }

					{ this.props.values.postType != 'page' && (
						<RadioControl
							label={__('Terms Relation', 'getwid')}
							selected={ this.props.values.relation ? this.props.values.relation : '' }
							options={ [
								{value: 'AND', label: __('Item should have all of selected terms.', 'getwid')},
								{value: 'OR', label: __('Item should have at least one of selected terms.', 'getwid')},
							] }
							onChange={ (value) => {
								//Callback
								if (this.props.callbackOn && this.props.callbackOn.includes('relation')){
									this.props.onChangeCallback(value, 'relation');
								} else {
									this.props.setValues({relation: value})
								}
							} }
						/>
					) }

					{ Getwid.acf_exist != '' && renderFieldTypeSelectACF() }
				</PanelBody>

			</div>
		);
	}
}

export default ( GetwidCustomQueryControl );
