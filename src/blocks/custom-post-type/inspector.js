/**
* External dependencies
*/
import GetwidCustomQueryControl from 'GetwidControls/custom-query-control'; //Custom Post Type
import GetwidCustomPostTemplateControl from 'GetwidControls/custom-post-template-control'; //Custom Post Template


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
} = wp.blockEditor || wp.editor;
const {
	SelectControl,
	PanelBody,
	RangeControl,
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
				offset,
				pagination,
				ignoreSticky,
				postTemplate,
				filterById,
				excludeById,
				excludeCurrentPost,
				parentPageId,
				postType,
				taxonomy,
				terms,
				relation,
				order,
				orderBy,
				//Custom Post Type

				align,
				postLayout,
				columns,
				spacing
			},
			setAttributes,
			recentPosts,
			hasPosts,

			changeState,
			getState,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Content Settings', 'getwid')} initialOpen={true}>
					{/* Custom Post Type */}
					<GetwidCustomQueryControl
						setValues={ setAttributes }
						options={['page','sticky','parentFilter']}
						values={{
							postsToShow,
							offset,
							pagination,
							ignoreSticky,
							filterById,
							excludeById,
							excludeCurrentPost,
							parentPageId,
							postType,
							taxonomy,
							terms,
							relation,
							order,
							orderBy,
						}}
						// callbackOn={['postsToShow', 'filterById', 'postType', 'taxonomy', 'terms', 'relation', 'order', 'orderBy']}
						onChangeCallback={ (value, element) => {
							// debugger;
						} }
					/>
					{/* Custom Post Type */}
				</PanelBody>

				<PanelBody title={__('Display Settings', 'getwid')} initialOpen={false}>
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
						<Fragment>
							<RangeControl
								label={ __( 'Columns', 'getwid' ) }
								value={ columns }
								onChange={ ( value ) => setAttributes( { columns: value } ) }
								min={ 1 }
								max={ ! hasPosts ? MAX_POSTS_COLUMNS : Math.min( MAX_POSTS_COLUMNS, recentPosts.length ) }
							/>
						</Fragment>
					}

					<SelectControl
						label={__('Spacing', 'getwid')}
						value={spacing}
						onChange={spacing => setAttributes({spacing})}
						options={[
							{ value: 'default', label: __( 'Default', 'getwid' ) },
							{ value: 'none', label: __( 'None', 'getwid' ) },
							{ value: 'small', label: __( 'Small', 'getwid' ) },
							{ value: 'medium', label: __( 'Medium', 'getwid' ) },
							{ value: 'normal', label: __( 'Normal', 'getwid' ) },
							{ value: 'large', label: __( 'Large', 'getwid' ) },
						]}
					/>

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
			</InspectorControls>
		);
	}
}
