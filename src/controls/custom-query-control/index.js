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
import React from "react";

const { jQuery: $ } = window;
const { Component, Fragment } = wp.element;
const { withInstanceId } = wp.compose;
const apiFetch = wp.apiFetch;
const {
	addQueryArgs
} = wp.url;
const {
	Modal,
	Dashicon,
	ButtonGroup,
	Button,
	SelectControl,
	RangeControl,
	RadioControl,
	ToggleControl,
	Spinner,
	TextControl,
	PanelBody
} = wp.components;

let lastId = 0;

/**
* Create an Control
*/
class GetwidCustomQueryControl extends Component {

	constructor() {
		super( ...arguments );

		this.firstCheckTaxonomy = true;
		this.firstCheckTerms    = true;

		this.state = {
			postTypeList: null,
			taxonomyList: null,
			termsList: null,
			modalOpen: false,
			queryValueFocus: null,
			queryValueSecondFocus: null,
			queryKeyFocus: null
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

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	findRecursivelyIdArray( id, parent ) {
		if ( parent.id === id ) {
			return parent;
		}

		for ( const currentArr of parent ) {
			if ( currentArr.id === id ) {
				return currentArr;
			} else if ( currentArr.children ) {
				const subArr = this.findRecursivelyIdArray( id, currentArr.children );

				if ( subArr ) {
					return subArr;
				}
			}
		}
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

									});
								} else {
									this.props.setValues({
										postType: value,
										taxonomy: undefined,
										terms: undefined,
									});
								}
							}

							this.getTaxonomyFromCustomPostType(value);
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

									});
								} else {
									this.props.setValues({
										taxonomy: value,
										terms: undefined,

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
									});
								} else {
									this.props.setValues({
										terms: value,
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

		const uniqueId = ( prefix = 'id' ) => {
			lastId++;
			return `${ prefix }${ lastId }`;
		}

		const updateData = ( prop, value, id ) => {
			const data = this.findRecursivelyIdArray( id, this.props.values.metaQuery );
			Object.assign( data, { [ prop ]: value } );
			const newData = Object.assign( [], this.props.values.metaQuery );

			//Callback
			if ( this.props.callbackOn && this.props.callbackOn.includes( 'metaQuery' ) ) {
				this.props.onChangeCallback(  newData, 'metaQuery' );
			} else {
				this.props.setValues( { metaQuery:  newData } )
			}
		}

		const ConditionComponent = ( { query, index } ) => {
			const removedSpacesTextCompare = query.queryCompare.replace(/ /g,''),
			 	    removedSpacesTextType        = query.queryType.replace(/ /g,''),
				    nowDate		     = Date.now(),
				    futureDayDate   = Date.now() + ( 24 * 60 * 60 * 1000 ),
				    futureHourDate = Date.now() + ( 1 * 60 * 60 * 1000 );

			let itemQueryValue;

			const removeCondition = () => {
				const parent = this.findRecursivelyIdArray( query.parentConditionId, this.props.values.metaQuery );
				const index  = parent.children.findIndex( j => j.id === query.id );

				parent.children.splice( index, 1 );

				const newData = Object.assign( [], this.props.values.metaQuery );

				//Callback
				if ( this.props.callbackOn && this.props.callbackOn.includes( 'metaQuery' ) ) {
					this.props.onChangeCallback( newData, 'metaQuery' );
				} else {
					this.props.setValues( { metaQuery: newData } );
				}
			}
	
			switch ( removedSpacesTextCompare ) {
				case 'EXISTS':
				case 'NOTEXISTS':
					itemQueryValue = null;
					break;
				case 'BETWEEN':
				case 'NOTBETWEEN':
					switch ( removedSpacesTextType ) {
						case 'DATETIME' :
							itemQueryValue = (
								<div className={ [ `${controlClassPrefix}__custom-between` ] }>
									<TextControl
										autoFocus={ query.id == this.state.queryValueFocus ? true : false }
										placeholder={ __( '2000-01-01 00:00', 'getwid' ) }
										value={ ( query.queryValue ? query.queryValue : '' ) }
										onChange={ value => {
											updateData( 'queryValue', value, query.id );
											this.setState( { queryValueFocus: query.id, queryKeyFocus: null, queryValueSecondFocus: null } );
										} }
									/>
									<TextControl
										autoFocus={ query.id == this.state.queryValueSecondFocus ? true : false }
										placeholder={ __( '2000-01-02 00:00', 'getwid' ) }
										value={ ( query.queryValueSecond ? query.queryValueSecond : '' ) }
										onChange={ value => {
											updateData( 'queryValueSecond', value, query.id );
											this.setState( { queryValueFocus: null, queryKeyFocus: null, queryValueSecondFocus: query.id } );
										} }
									/>
								</div>
							);
							break;
						case 'DATE' :
							itemQueryValue = (
								<div className={ [ `${controlClassPrefix}__custom-between` ] }>
									<TextControl
										autoFocus={ query.id == this.state.queryValueFocus ? true : false }
										placeholder={ __( '2000-01-01 00:00', 'getwid' ) }
										value={ ( query.queryValue ? query.queryValue : '' ) }
										onChange={ value => {
											updateData( 'queryValue', value, query.id );
											this.setState( { queryValueFocus: query.id, queryKeyFocus: null, queryValueSecondFocus: null } );
										} }
									/>
									<TextControl
										autoFocus={ query.id == this.state.queryValueSecondFocus ? true : false }
										placeholder={ __( '2000-01-02 00:00', 'getwid' ) }
										value={ ( query.queryValueSecond ? query.queryValueSecond : '' ) }
										onChange={ value => {
											updateData( 'queryValueSecond', value, query.id );
											this.setState( { queryValueFocus: null, queryKeyFocus: null, queryValueSecondFocus: query.id } );
										} }
									/>
								</div>
							);
							break;
						case 'TIME' :
							itemQueryValue = (
								<div className={ [ `${controlClassPrefix}__custom-between` ] }>
									<TextControl
										autoFocus={ query.id == this.state.queryValueFocus ? true : false }
										placeholder={ __( '00:00', 'getwid' ) }
										value={ ( query.queryValue ? query.queryValue : '' ) }
										onChange={ value => {
											updateData( 'queryValue', value, query.id );
											this.setState( { queryValueFocus: query.id, queryKeyFocus: null, queryValueSecondFocus: null } );
										} }
									/>
									<TextControl
										autoFocus={ query.id == this.state.queryValueSecondFocus ? true : false }
										placeholder={ __( '01:00', 'getwid' ) }
										value={ ( query.queryValueSecond ? query.queryValueSecond : '' ) }
										onChange={ value => {
											updateData( 'queryValueSecond', value, query.id );
											this.setState( { queryValueFocus: null, queryKeyFocus: null, queryValueSecondFocus: query.id } );
										} }
									/>
								</div>
							);
							break;
						default :
							itemQueryValue = (
								<div className={ [ `${controlClassPrefix}__custom-between` ] }>
									<TextControl
										autoFocus={ query.id == this.state.queryValueFocus ? true : false }
										placeholder={ __( 'From', 'getwid' ) }
										value={ ( query.queryValue ? query.queryValue : '' ) }
										onChange={ value => {
											updateData( 'queryValue', value, query.id );
											this.setState( { queryValueFocus: query.id, queryValueSecondFocus: null, queryKeyFocus: null } );
										} }
									/>
									<TextControl
										autoFocus={ query.id == this.state.queryValueSecondFocus ? true : false }
										placeholder={ __( 'To', 'getwid' ) }
										value={ ( query.queryValueSecond ? query.queryValueSecond : '' ) }
										onChange={ value => {
											updateData( 'queryValueSecond', value, query.id );
											this.setState( { queryValueFocus: null, queryValueSecondFocus: query.id, queryKeyFocus: null } );
										} }
									/>	
								</div>
							);
							break;
					}
					break;
				default:
					switch ( removedSpacesTextType ) {
						case 'DATETIME' :
							itemQueryValue = (
								<TextControl
									autoFocus={ query.id == this.state.queryValueFocus ? true : false }
									placeholder={ __( '2000-01-01 00:00', 'getwid' ) }
									value={ ( query.queryValue ? query.queryValue : '' ) }
									onChange={ value => {
										updateData( 'queryValue', value, query.id );
										this.setState( { queryValueFocus: query.id, queryKeyFocus: null, queryValueSecondFocus: null } );
									} }
								/>
							);
							break;
						case 'DATE' :
							itemQueryValue = (
								<TextControl
									autoFocus={ query.id == this.state.queryValueFocus ? true : false }
									placeholder={ __( '2000-01-01', 'getwid' ) }
									value={ ( query.queryValue ? query.queryValue : '' ) }
									onChange={ value => {
										updateData( 'queryValue', value, query.id );
										this.setState( { queryValueFocus: query.id, queryKeyFocus: null, queryValueSecondFocus: null } );
									} }
								/>
							);
							break;
						case 'TIME' :
							itemQueryValue = (
								<TextControl
									autoFocus={ query.id == this.state.queryValueFocus ? true : false }
									placeholder={ __( '00:00', 'getwid' ) }
									value={ ( query.queryValue ? query.queryValue : '' ) }
									onChange={ value => {
										updateData( 'queryValue', value, query.id );
										this.setState( { queryValueFocus: query.id, queryKeyFocus: null, queryValueSecondFocus: null } );
									} }
								/>
							);
							break;
						default:
							itemQueryValue = (
								<TextControl
									autoFocus={ query.id == this.state.queryValueFocus ? true : false }
									placeholder={ __( 'Query Value', 'getwid' ) }
									value={ ( query.queryValue ? query.queryValue : '' ) }
									onChange={ value => {
										updateData( 'queryValue', value, query.id );
										this.setState( { queryValueFocus: query.id, queryKeyFocus: null, queryValueSecondFocus: null } );
									} }
								/>
							);
							break;
					}
					break;
			}

			return (
				<div className={ [ `${controlClassPrefix}__custom-query` ] }>
					<TextControl
						autoFocus={ query.id == this.state.queryKeyFocus ? true : false }
						placeholder={ __( 'Query Key', 'getwid' ) }
						value={ ( query.queryKey ? query.queryKey : '' ) }
						onChange={ value => {
							updateData( 'queryKey', value, query.id );
							this.setState( { queryKeyFocus: query.id, queryValueFocus: null, queryValueSecondFocus: null } );
						} }
					/> 
					<SelectControl
						className={ [ `${controlClassPrefix}__custom-query--compare` ] }
						value={ ( query.queryCompare ? query.queryCompare : '' ) }
						onChange={ value => { 
							updateData( 'queryCompare', value, query.id ); 
							this.setState( { queryValueFocus: null, queryKeyFocus: null, queryValueSecondFocus: null  } );
						} }
						options={ [
							{ value: '', label: __( 'Compare', 'getwid' ) },
							{ value: '=', label: __( '=', 'getwid' ) },
							{ value: '!=', label: __( '!=', 'getwid' ) },
							{ value: '>', label: __( '>', 'getwid' ) },
							{ value: '>=', label: __( '>=', 'getwid' ) },
							{ value: '<', label: __( '<', 'getwid' ) },
							{ value: '<=', label: __( '<=', 'getwid' ) },
							{ value: 'LIKE', label: __( 'LIKE', 'getwid' ) },
							{ value: 'NOT LIKE', label: __( 'NOT LIKE', 'getwid' ) },
							{ value: 'IN', label: __( 'IN', 'getwid' ) },
							{ value: 'NOT IN', label: __( 'NOT IN', 'getwid' ) },
							{ value: 'BETWEEN', label: __( 'BETWEEN', 'getwid' ) },
							{ value: 'NOT BETWEEN', label: __( 'NOT BETWEEN', 'getwid' ) },
							{ value: 'EXISTS', label: __( 'EXISTS', 'getwid' ) },
							{ value: 'NOT EXISTS', label: __( 'NOT EXISTS', 'getwid' ) },
							{ value: 'REGEXP', label: __( 'REGEXP', 'getwid' ) },
							{ value: 'NOT REGEXP', label: __( 'NOT REGEXP', 'getwid' ) },
							{ value: 'RLIKE', label: __( 'RLIKE', 'getwid' ) },
						] }
					/>
					{ itemQueryValue }
					<SelectControl
						className={ [ `${controlClassPrefix}__custom-query--type` ] }
						value={ ( query.queryType ? query.queryType : '' ) }
						onChange={ value => {
							updateData( 'queryType', value, query.id );
							this.setState( { queryValueFocus: null, queryKeyFocus: null, queryValueSecondFocus: null } );
						} }
						options={ [
							{ value: '', label: __( 'Type', 'getwid' ) },
							{ value: 'NUMERIC', label: __( 'NUMERIC', 'getwid' ) },
							{ value: 'DECIMAL', label: __( 'DECIMAL', 'getwid' ) },
							{ value: 'SIGNED', label: __( 'SIGNED', 'getwid' ) },
							{ value: 'UNSIGNED', label: __( 'UNSIGNED', 'getwid' ) },
							{ value: 'CHAR', label: __( 'CHAR', 'getwid' ) },
							{ value: 'BINARY', label: __( 'BINARY', 'getwid' ) },
							{ value: 'DATETIME', label: __( 'DATETIME', 'getwid' ) },
							{ value: 'DATE', label: __( 'DATE', 'getwid' ) },
							{ value: 'TIME', label: __( 'TIME', 'getwid' ) },
						] }
					/>
					<Button
						onClick={ removeCondition }
					>
						<Dashicon icon="no-alt" />
					</Button>
				</div>
			);
		}

		const GroupComponent = ( { query, index } ) => {
			const nestedLevelComponent = ( query.children || [] ).map( ( query, index ) => {
				if ( query.type === 'Group' ) {
					return <GroupComponent key={ index } index={ index } query={ query } />
				} else if ( query.type === 'Condition' ) {
					return <ConditionComponent key={ index } index={ index } query={ query } type="child" />
				}
			} );

			const addCondition = () => {
				query.children.push( {
					id:             uniqueId( 'c-' ),
					parentConditionId:    query.id,
					type:         'Condition',
					queryKey:     '',
					queryCompare: '',
					queryValue:   '',
					queryValueSecond:   '',
					queryType:    '',
				} );

				const newConditions = Object.assign( [], this.props.values.metaQuery );

				//Callback
				if ( this.props.callbackOn && this.props.callbackOn.includes( 'metaQuery' ) ) {
					this.props.onChangeCallback( newConditions, 'metaQuery' );
				} else {
					this.props.setValues( { metaQuery: newConditions } )
				}
			}
				
			const addGroup = () => {
				query.children.push( {
					id:             uniqueId( 'g-' ),
					parentGroupId:  query.id,
					type:          'Group',
					queryRelation: 'AND',
					children:      []
				} );

				const newGroup= Object.assign( [], this.props.values.metaQuery );

				//Callback
				if ( this.props.callbackOn && this.props.callbackOn.includes( 'metaQuery' ) ) {
					this.props.onChangeCallback( newGroup, 'metaQuery' );
				} else {
					this.props.setValues( { metaQuery: newGroup } )
				}
			}

			const removeGroup = () => {
				const parent = this.findRecursivelyIdArray( query.parentGroupId, this.props.values.metaQuery );
				const index  = parent.children.findIndex( j => j.id === query.id );

				parent.children.splice( index, 1 );

				const newData = Object.assign( [], this.props.values.metaQuery );

				//Callback
				if ( this.props.callbackOn && this.props.callbackOn.includes( 'metaQuery' ) ) {
					this.props.onChangeCallback( newData, 'metaQuery' );
				} else {
					this.props.setValues( { metaQuery: newData } )
				}
			}

			return (
				<div className={ [ `${controlClassPrefix}__custom-condition` ] }>
					<div className={ [ `${controlClassPrefix}__group` ] }>
						<SelectControl
							className={ [ `${controlClassPrefix}__custom-relation` ] }
							placeholder={ __( 'Meta Relation', 'getwid' ) }
							value={ ( query.queryRelation ? query.queryRelation : '' ) }
							onChange={ value => {
								updateData( 'queryRelation', value, query.id );
							} }
							options={ [
								{ value: 'AND', label: __( 'AND', 'getwid' ) },
								{ value: 'OR', label: __( 'OR', 'getwid' ) },
							] }
						/>
						{ query.id != 'g-0' && (
							<Button
								onClick={ removeGroup }
							>
								<Dashicon icon="no-alt" />
							</Button>
						) }
					</div>
					{ nestedLevelComponent }
					<ButtonGroup
						className={ [ `${controlClassPrefix}__custom-btn-condition` ] }
					>
						<Button
							isDefault
							onClick={ addCondition }
						>
							<Dashicon icon="plus-alt" />
							{ __( 'Add Condition', 'getwid' ) }
						</Button>
						<Button
							isDefault
							onClick={ addGroup }
						>
							<Dashicon icon="editor-justify" />
							{ __( 'Add Group', 'getwid' ) }
						</Button>
					</ButtonGroup>
				</div>
			);
		}

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

					<Button
						isPrimary
						className="ab-layout-modal-button"
						onClick={ () => {
							this.setState( {
								modalOpen: true
							} )
						} }
					>
						<Dashicon icon="admin-generic" />
						{ __( 'Advanced Filtering', 'getwid' ) }
					</Button>
					{ this.state.modalOpen ? (
						<Modal
							title={ __( 'Query Builder', 'getwid' ) }
							onRequestClose={ () => {
								this.setState( {
									modalOpen: false,
								} );
							} }
						>
							<div className={ [ `${controlClassPrefix}__custom-conditions` ] }>
								{
									this.props.values.metaQuery.map( ( query, index ) =>
										{
											return (
												<GroupComponent key={ index } index={ index } query={ query } />
											)
										}
									)
								}
								<ButtonGroup className={ [ `${controlClassPrefix}__custom-btn-group` ] }>
									<Button isDefault onClick={
										() => {
											this.setState( {
												modalOpen: false,
											} );
										}
									}> 
										{ __( 'Cancel', 'getwid' ) }
									</Button>
									<Button isPrimary onClick={ 
										() => {
											this.props.setValues ( { updateData: ! this.props.values.updateData } );
										}
									}>
										{ __( 'Save', 'getwid' ) }
									</Button>
								</ButtonGroup>
							</div>
						</Modal>
					) : null }

				</PanelBody>

			</div>
		);
	}
}

export default ( GetwidCustomQueryControl );
