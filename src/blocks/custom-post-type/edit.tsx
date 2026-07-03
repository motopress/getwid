import {
	BlockAlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
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
import type { CustomPostTypeEditProps } from './types';

import './editor.scss';
import './style.scss';
import { ServerSideRender } from '@wordpress/server-side-render';

export default function Edit( props: CustomPostTypeEditProps ) {
	const { attributes, setAttributes } = props;
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

	const blockProps = useBlockProps();

	return (
		<>
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
			<div { ...blockProps }>
				<Disabled>
					<ServerSideRender
						block="getwid/custom-post-type"
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		</>
	);
}
