/**
 * Internal block libraries
 */
const {__} = wp.i18n;

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
	Placeholder,
	QueryControls,
	RangeControl,
	Spinner,
	ToggleControl,
	Toolbar,
} = wp.components;

const MAX_POSTS_COLUMNS = 6;

/**
 * Create an Inspector Controls wrapper Component
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
				showTags,
				showAuthor,
				showCommentsCount,
				showFeaturedImage,
				align,
				postLayout,
				columns,
				order,
				orderBy,
				categories,
				postsToShow,
			},
			setAttributes,
			recentPosts,
			hasPosts,

			changeState,
			getState,
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

					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ postsToShow }
						categoriesList={ getState('categoriesList') }
						selectedCategoryId={ categories }
						onOrderChange={ ( value ) => setAttributes( { order: value } ) }
						onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
						onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
					/>
					<SelectControl
						label={__('Display Content', 'getwid')}
						value={showContent}
						onChange={showContent => setAttributes({showContent})}
						options={[
							{value: 'none', label: __('None', 'getwid'), },
							{value: 'excerpt', label: __('Excerpt', 'getwid'), },
							{value: 'content', label: __('Content', 'getwid'), },
						]}
					/>
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
							{value: 'span', label: __('Paragraph', 'getwid')},
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
						label={ __( 'Display Tags', 'getwid' ) }
						checked={ showTags }
						onChange={ () => {
							setAttributes( { showTags: !showTags } );
						}}
					/>
					<ToggleControl
						label={ __( 'Display Author', 'getwid' ) }
						checked={ showAuthor }
						onChange={ () => {
							setAttributes( { showAuthor: !showAuthor } );
						}}
					/>						
					<ToggleControl
						label={ __( 'Display Comments', 'getwid' ) }
						checked={ showCommentsCount }
						onChange={ () => {
							setAttributes( { showCommentsCount: !showCommentsCount } );
						}}
					/>
					<ToggleControl
						label={ __( 'Display Featured Image', 'getwid' ) }
						checked={ showFeaturedImage }
						onChange={ () => {
							setAttributes( { showFeaturedImage: !showFeaturedImage } );
						}}
					/>

					{showFeaturedImage && (
						<SelectControl
							label={__('Image Size', 'getwid')}
							help={__('Self-hosted images only', 'getwid')}
							value={imageSize}
							onChange={ (value) => {
								setAttributes( { imageSize: value } );
							}}
							options={Getwid.settings.image_sizes}
						/>	
					)}
				</PanelBody>
			</InspectorControls>
		);
	}
}