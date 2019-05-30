/**
* External dependencies
*/
import GetwidCustomQueryControl from 'GetwidControls/custom-query-control'; //Custom Post Type
import GetwidCustomPostTemplateControl from 'GetwidControls/custom-post-template-control'; //Custom Post Template


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
} = wp.editor;
const {
	SelectControl,
	PanelBody,
	RangeControl,
	ToggleControl,
} = wp.components;


/**
* Module Constants
*/
const MAX_POSTS_COLUMNS = 6;


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				//Custom Post Type
				postsToShow,
				postTemplate,
				postType,
				taxonomy,
				terms,
				relation,
				order,
				orderBy,				
				//Custom Post Type
				
				imageSize,
				titleTag,
				showContent,
				showTitle,
				showDate,
				showCategories,
				showCommentsCount,
				showFeaturedImage,
				align,
				postLayout,
				columns,

				categories,
				contentLength,
				cropImages
			},
			setAttributes,
			recentPosts,
			hasPosts,

			changeState,
			getState,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __('Template', 'getwid') }>
					<GetwidCustomPostTemplateControl
						setValues={ setAttributes }
						values={{
							postTemplate,
						}}
						// callbackOn={['postTemplate']}
						onChangeCallback={ (value, element) => {
							// debugger;
						} }
					/>
				</PanelBody>

				<PanelBody title={ __('Content', 'getwid') }>
					{/* Custom Post Type */}
					<GetwidCustomQueryControl
						setValues={ setAttributes }
						values={{
							postsToShow,
							postType,
							taxonomy,
							terms,
							relation,
							order,
							orderBy,
						}}
						// callbackOn={['postsToShow', 'postType', 'taxonomy', 'terms', 'relation', 'order', 'orderBy']}
						onChangeCallback={ (value, element) => {
							// debugger;
						} }
					/>
					{/* Custom Post Type */}
				</PanelBody>

				<PanelBody title={ __('View', 'getwid') }>
					<SelectControl
						label={__('Layout', 'getwid')}
						value={postLayout}
						onChange={postLayout => setAttributes({postLayout})}
						options={[
							{value: 'list', label: __('List', 'getwid'), },
							{value: 'grid', label: __('Grid', 'getwid'), },
						]}
					/>
					{ postLayout === 'grid' &&
						<RangeControl
							label={ __( 'Columns', 'getwid' ) }
							value={ columns }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
							min={ 1 }
							max={ ! hasPosts ? MAX_POSTS_COLUMNS : Math.min( MAX_POSTS_COLUMNS, recentPosts.length ) }
						/>
					}
				</PanelBody>
			</InspectorControls>
		);
	}
}