import { BlockControls, useBlockProps } from '@wordpress/block-editor';
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

import Inspector from './inspector';
import type { RecentPostsEditProps } from './types';

import './editor.scss';
import './style.scss';
import { ServerSideRender } from '@wordpress/server-side-render';

const categoriesListQuery = {
	per_page: -1,
};
function Edit( props: RecentPostsEditProps ) {
	const { attributes, setAttributes, recentPosts } = props;
	const { postLayout } = attributes;
	const hasPosts = Array.isArray( recentPosts ) && recentPosts.length > 0;
	const blockProps = useBlockProps();

	if ( ! hasPosts ) {
		return (
			<Fragment>
				<Inspector { ...props } />
				<div { ...blockProps }>
					<Placeholder
						icon="admin-post"
						label={ __( 'Recent Posts', 'getwid' ) }
					>
						{ ! Array.isArray( recentPosts ) ? (
							<Spinner />
						) : (
							__( 'No posts found.', 'getwid' )
						) }
					</Placeholder>
				</div>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<Inspector { ...props } />
			<BlockControls>
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
			</BlockControls>
			<div { ...blockProps }>
				<Disabled>
					<ServerSideRender
						block="getwid/recent-posts"
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		</Fragment>
	);
}

export default function ConnectedEdit(
	props: Omit< RecentPostsEditProps, 'recentPosts' | 'categoriesList' >
) {
	const { postsToShow, order, orderBy, categories } = props.attributes;
	const { recentPosts, categoriesList } = useSelect(
		( select ) => {
			const core = select( 'core' ) as {
				getEntityRecords: (
					kind: string,
					name: string,
					query: Record< string, number | string | undefined >
				) => unknown[] | undefined;
			};
			const postsQuery: Record< string, number | string | undefined > = {
				categories,
				order,
				orderby: orderBy,
				per_page: postsToShow,
			};

			Object.keys( postsQuery ).forEach( ( key ) => {
				if ( postsQuery[ key ] === undefined ) {
					delete postsQuery[ key ];
				}
			} );

			return {
				recentPosts: core.getEntityRecords(
					'postType',
					'post',
					postsQuery
				),
				categoriesList: core.getEntityRecords(
					'taxonomy',
					'category',
					categoriesListQuery
				),
			};
		},
		[ postsToShow, order, orderBy, categories ]
	);

	return (
		<Edit
			{ ...( props as RecentPostsEditProps ) }
			recentPosts={ recentPosts }
			categoriesList={ categoriesList }
		/>
	);
}
