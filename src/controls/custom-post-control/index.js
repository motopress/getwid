/**
 * External dependencies
 */
import classnames from 'classnames';
import { isUndefined, pickBy, pick, isEqual, map } from 'lodash';


/**
 * WordPress dependencies
 */
const {
	startCase,
	toLower
} = lodash;

import { __ } from 'wp.i18n';

const {
	Fragment,
} = wp.element;

const {
	// withInstanceId,
	compose } = wp.compose;

const apiFetch = wp.apiFetch;

const {
	addQueryArgs
} = wp.url;

const {
	withSelect,
} = wp.data;


const POST_TYPES_LIST_QUERY = {
	per_page: -1,
	// context: 'edit'
};




// const { compose } = wp.compose;

const {
	Button,
	BaseControl,
	Dropdown,
	MenuGroup,
	MenuItem,
	SelectControl,
	TextControl
} = wp.components;

const { Component } = wp.element;

/**
* Internal dependencies
*/
import './editor.scss';

class CustomPostsControl extends Component {
	constructor() {
		super( ...arguments );
		// this.search = React.createRef();

		this.state = {
			postTypeList: null,
			taxonomyList: null,
			termsList: null,
/* 			fonts: null,
			font: [],
			variants: null,
			search: '' */
		};
	}

	componentWillMount() {
		this.isStillMounted = true;
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/types` ),
			// path: addQueryArgs( `/wp/v2/types`, POST_TYPES_LIST_QUERY ),
		} ).then(
			( postTypeList ) => {
				if ( this.isStillMounted ) {
					this.setState( { postTypeList } );
				}
			}
		).catch(() => {});
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	// async componentDidMount() {
	// 	await apiFetch( {
	// 		path: addQueryArgs( `/wp/v2/categories` ),
	// 		// path: addQueryArgs( `/wp/v2/types`, POST_TYPES_LIST_QUERY ),
	// 	} ).then(
	// 		( postTypeList ) => {
	// 			if ( this.isStillMounted ) {
	// 				this.setState( { postTypeList } );
	// 			}
	// 		}
	// 	).catch(
	// 		() => {
	// 			if ( this.isStillMounted ) {
	// 				this.setState( { postTypeList: [] } );
	// 			}
	// 		}
	// 	);
	// }

/* 	async componentDidMount() {
		await fetch( 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAWN8pd8HMruaR92oVbykdg-Q2HpgsikKU' )
			.then( blob => blob.json() )
			.then( data => {
				this.setState({ fonts: data.items });
				if ( this.props.value ) {
					data.items.find( i => {
						if ( this.props.value === i.family ) {
							const variants = ( i.variants )
								.filter( o => false === o.includes( 'italic' ) )
								.map( o => {
									return o = {
										'label': startCase( toLower( o ) ),
										'value': o
									};
								});
							return this.setState({ variants });
						}
					});
				}
			});
	} */

	// addQueryArgs( `/wp/v2/getwid-get-terms`, {taxonomy_name : 'category'}),

	getTaxonomyFromCustomPostType(postType){
		if (typeof postType != 'undefined' && postType != ''){
			this.fetchRequest = apiFetch( {
				path: addQueryArgs( `/wp/v2/getwid-get-taxonomy`, {post_type_name : postType} ),
			} ).then(
				( taxonomyList ) => {
					if ( this.isStillMounted && Array.isArray(taxonomyList) && taxonomyList.length ) {
						// debugger;
						this.setState( { taxonomyList } );
					}
				}
			).catch(() => {});
		}
	}

	getTermsFromTaxonomy(taxonomy){
		if (typeof taxonomy != 'undefined' && taxonomy != ''){
			this.fetchRequest = apiFetch( {
				path: addQueryArgs( `/wp/v2/getwid-get-terms`, {taxonomy_name : taxonomy} ),
			} ).then(
				( termsList ) => {
					if ( this.isStillMounted && Array.isArray(termsList) && termsList.length  ) {
						// debugger;
						this.setState( { termsList } );
					}
				}
			).catch(() => {});
		}
	}







	







	render() {
		const {
			recentPosts,
		} = this.props;

		console.warn(this.state.postTypeList);

		// var temp = this.state.postTypeList;

		const postTypeArr = [];
		if (this.state.postTypeList){
			for (const key in this.state.postTypeList) {
				if (!['attachment', 'wp_block'].includes(key)){
						let postType = {};
						postType['value'] = this.state.postTypeList[key]['slug'];
						postType['label'] = this.state.postTypeList[key]['name'];
						postTypeArr.push(postType);
					// debugger;
				}

				// if (object.hasOwnProperty(key)) {
				// 	const element = object[key];
					
				// }
			}
		}


/* 		var test = temp ? Object.keys(temp).map((type) => {
			console.log(type);
			// return pickBy(temp[type], [value: 'name', 'slug']);
			return pick(temp[type], [{value:'name'}, 'slug']);
		}) : null;

		console.log(test); */

		// console.log(recentPosts);
		
		// return ('control');
		// const id = `inspector-google-fonts-control`;
		// const id = `inspector-google-fonts-control-${ /* this.props.instanceId */ }`;


		console.error(this.props.customTaxonomy);
		// value={ this.props.customTaxonomy ? this.props.customTaxonomy : 'Select TEST 2' }

		const renderPostTypeSelect = () => {

			if (null == this.state.taxonomyList){
				this.getTaxonomyFromCustomPostType(this.props.customPostTypes);
			}

			return (
				<SelectControl
					label={ __( 'Custom Post Types', 'getwid' ) }
					value={ this.props.customPostTypes ? this.props.customPostTypes : '' }
					onChange={ (value) => {
						this.setState( {
							taxonomyList: null,
							termsList: null,
						} );

						this.props.onChangePostType(value);
						this.getTaxonomyFromCustomPostType(value);
						console.log('2 Custom post Type');
						// debugger;
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
					value={ this.props.customTaxonomy ? this.props.customTaxonomy : '' }
					onChange={ (value) => {
						this.props.onChangeTaxonomy(value);
						this.getTermsFromTaxonomy(value);
						console.log('2 Taxonomy');	
						// debugger;
					} }
					options={[
						...[{'value': '', 'label': __( '--Select Taxonomy--', 'getwid' )}],
						...this.state.taxonomyList
					]}
				/>
			);
		};

		const renderTermsSelect = () => {

/* 			if (null == this.state.termsList){
				this.getTermsFromTaxonomy(this.props.customTaxonomy);
			} */

			return (
				<SelectControl
					label={ __( 'Terms List', 'getwid' ) }
					value={ this.props.customTerms ? this.props.customTerms : '' }
					onChange={ (value) => {
						this.props.onChangeTerms(value);
						// this.getTermsFromTaxonomy(value);
						console.log('2 Terms');	
						// debugger;
					} }
					options={[
						...[{'value': '', 'label': __( '--Select Terms--', 'getwid' )}],
						...this.state.termsList
					]}
				/>
			);
		};		
		
		return (
			<Fragment>
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
			</Fragment>		
		);
	}
}

// export default withInstanceId( CustomPostsControl );
export default compose([
	withSelect( ( select, props ) => {
		// const { postsToShow, order, orderBy, categories } = props.attributes;
		const { getEntityRecords, getMedia } = select( 'core' );
		const postsQuery = pickBy( {
			categories: '',
			// categories,
			order: 'desc',
			// order,
			orderby: 'date',
			// orderby: orderBy,
			per_page: 5,
			// per_page: postsToShow,
		}, ( value ) => ! isUndefined( value ) );
	

		//recentPosts: getEntityRecords( 'postType', 'post', postsQuery ),
		return {
			recentPosts: getEntityRecords( 'postType' ),
		};
	} ),
/* 	withInstanceId(()=>{
		return 'custom-post-type';
	}), */
])(CustomPostsControl);