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
				displayPostDate,
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
			toggleDisplayPostDate,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
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
					<ToggleControl
						label={ __( 'Display post date', 'getwid' ) }
						checked={ displayPostDate }
						onChange={ toggleDisplayPostDate }
					/>
					{ postLayout === 'grid' &&
						<RangeControl
							label={ __( 'Columns', 'getwid' ) }
							value={ columns }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
							min={ 2 }
							max={ ! hasPosts ? MAX_POSTS_COLUMNS : Math.min( MAX_POSTS_COLUMNS, recentPosts.length ) }
						/>
					}
				</PanelBody>
			</InspectorControls>
		);
	}
}