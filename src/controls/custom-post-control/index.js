/**
 * External dependencies
 */
import './editor.scss';


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
} = wp.components;


/**
* Create an Control
*/
class CustomPostsControl extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			postTypeList: null,
			taxonomyList: null,
			termsList: null,
		};
	}

	//Get Post Types
	componentWillMount() {
		this.isStillMounted = true;
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/types` ),
		} ).then(
			( postTypeList ) => {
				if ( this.isStillMounted ) {
					this.setState( { postTypeList } );
				}
			}
		).catch(() => {});
	}

	//Get Taxonomy
	getTaxonomyFromCustomPostType(postType){
		if (typeof postType != 'undefined' && postType != ''){
			this.fetchRequest = apiFetch( {
				path: addQueryArgs( `/wp/v2/getwid-get-taxonomy`, {post_type_name : postType} ),
			} ).then(
				( taxonomyList ) => {
					if ( this.isStillMounted && Array.isArray(taxonomyList) && taxonomyList.length ) {
						this.setState( { taxonomyList } );
					}
				}
			).catch(() => {});
		}
	}

	//Get Terms
	getTermsFromTaxonomy(taxonomy){
		if (typeof taxonomy != 'undefined' && taxonomy != ''){
			this.fetchRequest = apiFetch( {
				path: addQueryArgs( `/wp/v2/getwid-get-terms`, {taxonomy_name : taxonomy} ),
			} ).then(
				( termsList ) => {
					if ( this.isStillMounted && Array.isArray(termsList) && termsList.length  ) {
						this.setState( { termsList } );
					}
				}
			).catch(() => {});
		}
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	render() {
		console.warn(this.state.postTypeList);

		const controlClassPrefix = 'components-getwid-custom-post-control';
		const controlID = `inspector-getwid-custom-post-control-${ this.props.instanceId }`;

		const postTypeArr = [];
		if (this.state.postTypeList){
			for (const key in this.state.postTypeList) {
				if (!['attachment', 'wp_block'].includes(key)){
					let postType = {};
					postType['value'] = this.state.postTypeList[key]['slug'];
					postType['label'] = this.state.postTypeList[key]['name'];
					postTypeArr.push(postType);
				}
			}
		}

		const renderPostTypeSelect = () => {

			if (null == this.state.taxonomyList){
				this.getTaxonomyFromCustomPostType(this.props.customPostTypes);
			}

			return (
				<SelectControl
					label={ __( 'Custom Post Types', 'getwid' ) }
					className={[`${controlClassPrefix}__post-type`]}
					value={ this.props.customPostTypes ? this.props.customPostTypes : '' }
					onChange={ (value) => {
						this.setState( {
							taxonomyList: null,
							termsList: null,
						} );

						this.props.onChangePostType(value);
						this.getTaxonomyFromCustomPostType(value);
					} }
					options={[
						...[{'value': '', 'label': __( '--Select Post Types--', 'getwid' )}],
						...postTypeArr
					]}
				/>
			);
		};

		const renderTaxonomySelect = () => {

			if (null == this.state.termsList){
				this.getTermsFromTaxonomy(this.props.customTaxonomy);
			}

			return (
				<SelectControl
					label={ __( 'Taxonomy List', 'getwid' ) }
					className={[`${controlClassPrefix}__taxonomy`]}
					value={ this.props.customTaxonomy ? this.props.customTaxonomy : '' }
					onChange={ (value) => {
						this.setState( {
							termsList: null,
						} );

						this.props.onChangeTaxonomy(value);
						this.getTermsFromTaxonomy(value);
					} }
					options={[
						...[{'value': '', 'label': __( '--Select Taxonomy--', 'getwid' )}],
						...this.state.taxonomyList
					]}
				/>
			);
		};

		const renderTermsSelect = () => {

			return (
				<SelectControl
					label={ __( 'Terms List', 'getwid' ) }
					className={[`${controlClassPrefix}__terms`]}
					value={ this.props.customTerms ? this.props.customTerms : '' }
					onChange={ (value) => {
						this.props.onChangeTerms(value);
					} }
					options={[
						...[{'value': '', 'label': __( '--Select Terms--', 'getwid' )}],
						...this.state.termsList
					]}
				/>
			);
		};
		
		return (
			<div
				className={controlClassPrefix}
				id={ controlID }
			>
				{( null !== this.state.postTypeList ) ?
					(
						renderPostTypeSelect()
					) : undefined
				}

				{( null !== this.state.taxonomyList ) ?
					(
						renderTaxonomySelect()
					) : undefined
				}

				{( null !== this.state.termsList ) ?
					(
						renderTermsSelect()
					) : undefined
				}
			</div>	
		);
	}
}

export default withInstanceId(CustomPostsControl);