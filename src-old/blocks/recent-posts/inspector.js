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
} = wp.blockEditor || wp.editor;
const {
	SelectControl,
	PanelBody,
	QueryControls,
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
				imageSize,
				titleTag,
				showContent,
				showTitle,
				showDate,
				showCategories,
				showCommentsCount,
				showFeaturedImage,
				postLayout,
				columns,
				order,
				orderBy,
				categories,
				postsToShow,
				contentLength,
				cropImages
			},
			categoriesList,
			setAttributes,
			recentPosts,
			hasPosts
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
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
					<ToggleControl
						label={ __( 'Display Title', 'getwid' ) }
						checked={ showTitle }
						onChange={ () => {
							setAttributes( { showTitle: !showTitle } );
						}}
					/>

					{showTitle && (
					<SelectControl
						label={__('Title Tag', 'getwid')}
						value={titleTag}
						options={[
							{value: 'p', label: __('Paragraph', 'getwid')},
							{value: 'h2', label: __('Heading 2', 'getwid')},
							{value: 'h3', label: __('Heading 3', 'getwid')},
							{value: 'h4', label: __('Heading 4', 'getwid')},
							{value: 'h5', label: __('Heading 5', 'getwid')},
							{value: 'h6', label: __('Heading 6', 'getwid')},
						]}
						onChange={titleTag => setAttributes({titleTag})}
					/>
					)}
					<ToggleControl
						label={ __( 'Display Featured Image', 'getwid' ) }
						checked={ showFeaturedImage }
						onChange={ () => {
							setAttributes( { showFeaturedImage: !showFeaturedImage } );
						}}
					/>
					{showFeaturedImage && (
						<Fragment>
							<SelectControl
								label={__('Image Size', 'getwid')}
								help={__('For images from Media Library only.', 'getwid')}
								value={imageSize}
								onChange={ (value) => {
									setAttributes( { imageSize: value } );
								}}
								options={Getwid.settings.image_sizes}
							/>
							<ToggleControl
								label={ __( 'Crop Images', 'getwid' ) }
								checked={ cropImages }
								onChange={ () => {
									setAttributes( { cropImages: !cropImages } );
								}}
							/>
						</Fragment>
					)}
					<ToggleControl
						label={ __( 'Display Excerpt', 'getwid' ) }
						checked={ showContent }
						onChange={ () => {
							setAttributes( { showContent: !showContent } );
						}}
					/>
					{ showContent &&
						<RangeControl
							label={ __( 'Number of words', 'getwid' ) }
							value={ contentLength }
							onChange={ ( contentLength ) => setAttributes( { contentLength } ) }
							min={ 5 }
							max={ Getwid.settings.excerpt_length }
						/>
					}

					<ToggleControl
						label={ __( 'Display Date', 'getwid' ) }
						checked={ showDate }
						onChange={ () => {
							setAttributes( { showDate: !showDate } );
						}}
					/>
					<ToggleControl
						label={ __( 'Display Categories', 'getwid' ) }
						checked={ showCategories }
						onChange={ () => {
							setAttributes( { showCategories: !showCategories } );
						}}
					/>
					<ToggleControl
						label={ __( 'Display Comments', 'getwid' ) }
						checked={ showCommentsCount }
						onChange={ () => {
							setAttributes( { showCommentsCount: !showCommentsCount } );
						}}
					/>
					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ postsToShow }
						categoriesList={ categoriesList }
						selectedCategoryId={
							undefined !== categories ? Number( categories ) : ''
						}
						onOrderChange={ value => setAttributes( { order: value } ) }
						onOrderByChange={ value => setAttributes( { orderBy: value } ) }
						onCategoryChange={
							value =>
								setAttributes( {
									categories: '' !== value ? value.toString() : undefined
								} )
						}
						onNumberOfItemsChange={ value => setAttributes( { postsToShow: value } ) }
					/>

				</PanelBody>
			</InspectorControls>
		);
	}
}