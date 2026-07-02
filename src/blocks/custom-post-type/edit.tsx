import { BlockAlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import {
	Disabled,
	Placeholder,
	Spinner,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	CustomQueryToolbarButton,
	TemplateSelectToolbarButton,
} from 'getwid-components';

import Inspector from './inspector';
import type {
	CustomPostTypeAttributes,
	CustomPostTypeEditProps,
	ServerSideRenderProps,
} from './types';

import './editor.scss';
import './style.scss';

const ServerSideRender = (
	window as unknown as {
		wp?: {
			serverSideRender?: ( props: ServerSideRenderProps ) => JSX.Element;
		};
	}
 ).wp?.serverSideRender;

function Edit( props: CustomPostTypeEditProps ) {
	const { attributes, setAttributes, recentPosts } = props;
	const {
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
		metaQuery,
	} = attributes;
	const hasPosts = Array.isArray( recentPosts ) && recentPosts.length > 0;

	if ( ! hasPosts ) {
		return (
			<Fragment>
				<Inspector { ...props } />
				<Placeholder
					icon="admin-post"
					label={ __( 'Custom Post Type', 'getwid' ) }
				>
					{ ! Array.isArray( recentPosts ) ? (
						<Spinner />
					) : (
						__( 'No posts found.', 'getwid' )
					) }
				</Placeholder>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<Inspector { ...props } />
			<BlockControls>
				<BlockAlignmentToolbar
					value={ align }
					controls={ [ 'wide', 'full' ] }
					onChange={ ( nextAlign ) => {
						setAttributes( { align: nextAlign } );
					} }
				/>
				<ToolbarGroup>
					<ToolbarButton
						icon="list-view"
						label={ __( 'List View', 'getwid' ) }
						onClick={ () =>
							setAttributes( { postLayout: 'list' } )
						}
						isPressed={ postLayout === 'list' }
					/>
					<ToolbarButton
						icon="grid-view"
						label={ __( 'Grid View', 'getwid' ) }
						onClick={ () =>
							setAttributes( { postLayout: 'grid' } )
						}
						isPressed={ postLayout === 'grid' }
					/>
				</ToolbarGroup>
				<TemplateSelectToolbarButton
					selectedTemplate={ postTemplate }
					onSelect={ ( templateID ) =>
						setAttributes( { postTemplate: templateID } )
					}
					previewRender={ ( templateID ) =>
						ServerSideRender ? (
							<ServerSideRender
								block="getwid/custom-post-type"
								attributes={ {
									...attributes,
									postTemplate: String( templateID ),
								} }
							/>
						) : (
							<Fragment />
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
						orderBy,
						metaQuery,
					} }
					metaQuery={ metaQuery }
					updateMetaQuery={ ( nextMetaQuery ) =>
						setAttributes( { metaQuery: nextMetaQuery } )
					}
				/>
			</BlockControls>
			<Disabled>
				{ ServerSideRender && (
					<ServerSideRender
						block="getwid/custom-post-type"
						attributes={ attributes }
					/>
				) }
			</Disabled>
		</Fragment>
	);
}

export default function ConnectedEdit(
	props: Omit< CustomPostTypeEditProps, 'recentPosts' >
) {
	const recentPosts = useSelect(
		( select ) => {
			const core = select( 'core' ) as {
				getEntityRecords: (
					kind: string,
					name: string,
					query: Record< string, number | string | undefined >
				) => unknown[] | undefined;
			};
			const postsQuery = {
				order: props.attributes.order,
				per_page: props.attributes.postsToShow,
			};

			return core.getEntityRecords( 'postType', 'post', postsQuery );
		},
		[ props.attributes.order, props.attributes.postsToShow ]
	);

	return (
		<Edit
			{ ...( props as CustomPostTypeEditProps ) }
			recentPosts={ recentPosts }
		/>
	);
}
