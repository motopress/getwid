/**
* External dependencies
*/
import { isUndefined, pickBy } from 'lodash';
import Inspector from './inspector';
import './editor.scss';
import { TemplateSelectToolbarButton } from 'GetwidControls/post-template-select';
import { CustomQueryToolbarButton } from 'GetwidControls/custom-query-control';


/**
* WordPress dependencies
*/
const { serverSideRender: ServerSideRender } = wp;
const {
	Component,
	Fragment,
} = wp.element;
const {
	Placeholder,
	Spinner,
	Disabled,
	ToolbarGroup
} = wp.components;
import { __ } from 'wp.i18n';
const {
	BlockAlignmentToolbar,
	BlockControls,
} = wp.blockEditor || wp.editor;
const {
	withSelect,
} = wp.data;


/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);
	}

	changeState ( param, value ) {
		if ( typeof param == 'object' ) {
			this.setState( param );
		} else if ( typeof param == 'string' ) {
			this.setState( { [ param ]: value } );
		}
	}

	getState (value) {
		return this.state[value];
	}

	render() {
		const {
			attributes: {
				align,
				postLayout,
				postTemplate,
				postsToShow,
				offset,
				pagination,
				ignoreSticky,
				filterById,
				excludeById,
				excludeCurrentPost,
				childPagesCurrentPage,
				parentPageId,
				postType,
				taxonomy,
				terms,
				relation,
				order,
				orderBy,
				metaQuery
			},
			setAttributes,
			recentPosts
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const hasPosts = Array.isArray( recentPosts ) && recentPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					<Inspector
						{ ...{
							...this.props,
							changeState,
							getState,
							hasPosts,
						} }
					/>
					<Placeholder
						icon="admin-post"
						label={ __( 'Custom Post Type', 'getwid' ) }
					>
						{ ! Array.isArray( recentPosts ) ?
							<Spinner /> :
							__( 'No posts found.', 'getwid' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		return (
			<Fragment>
				<Inspector
					{ ...{
						...this.props,
						changeState,
						getState,
						hasPosts
					} }
				/>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						controls= {[ 'wide', 'full' ]}
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
					<ToolbarGroup
						controls={ [
							{
								icon: 'list-view',
								title: __( 'List View', 'getwid' ),
								onClick: () => setAttributes( { postLayout: 'list' } ),
								isActive: postLayout === 'list',
							},
							{
								icon: 'grid-view',
								title: __( 'Grid View', 'getwid' ),
								onClick: () => setAttributes( { postLayout: 'grid' } ),
								isActive: postLayout === 'grid',
							},
						] }
					/>
					<TemplateSelectToolbarButton
						selectedTemplate={ postTemplate }
						onSelect={ ( templateID ) => setAttributes( { postTemplate: templateID } ) }
						previewRender={
							( templateID ) => (
								<ServerSideRender
									block="getwid/custom-post-type"
									attributes={ { ...this.props.attributes, postTemplate: templateID }}
								/>
							)
						}
					/>
					<CustomQueryToolbarButton
						query={ {
							postsToShow,
							offset,
							pagination,
							ignoreSticky,
							filterById,
							excludeById,
							excludeCurrentPost,
							childPagesCurrentPage,
							parentPageId,
							postType,
							taxonomy,
							terms,
							relation,
							order,
							orderBy
						} }
						metaQuery={ metaQuery }
						updateMetaQuery={ ( metaQuery ) => setAttributes( { metaQuery } ) }
					/>
				</BlockControls>

				<Disabled>
					<ServerSideRender
						block="getwid/custom-post-type"
						attributes={this.props.attributes}
					/>
				</Disabled>

			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const postsQuery = pickBy( {
		order,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );

	return {
		recentPosts: getEntityRecords( 'postType', 'post', postsQuery ),
	};
} )( Edit );
