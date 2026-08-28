import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	QueryControls,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import type { RecentPostsEditProps } from './types';

const maxPostsColumns = 6;
const imageSizeOptions =
	(
		window as Window & {
			Getwid?: {
				settings?: {
					image_sizes?: Array< { value: string; label: string } >;
					excerpt_length?: number;
				};
			};
		}
	 ).Getwid?.settings?.image_sizes || [];
const maxExcerptLength =
	(
		window as Window & {
			Getwid?: { settings?: { excerpt_length?: number } };
		}
	 ).Getwid?.settings?.excerpt_length || 55;

export default function Inspector( {
	attributes,
	setAttributes,
	categoriesList,
	recentPosts,
}: RecentPostsEditProps ) {
	const {
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
		cropImages,
	} = attributes;
	const hasPosts = Array.isArray( recentPosts ) && recentPosts.length > 0;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<SelectControl
					label={ __( 'Layout', 'getwid' ) }
					value={ postLayout }
					onChange={ ( value ) =>
						setAttributes( { postLayout: value } )
					}
					options={ [
						{ value: 'list', label: __( 'List', 'getwid' ) },
						{ value: 'grid', label: __( 'Grid', 'getwid' ) },
					] }
				/>
				{ postLayout === 'grid' && (
					<RangeControl
						label={ __( 'Columns', 'getwid' ) }
						value={ columns }
						onChange={ ( value ) =>
							setAttributes( { columns: value ?? 1 } )
						}
						min={ 1 }
						max={
							! hasPosts
								? maxPostsColumns
								: Math.min(
										maxPostsColumns,
										recentPosts?.length || maxPostsColumns
								  )
						}
					/>
				) }
				<ToggleControl
					label={ __( 'Display Title', 'getwid' ) }
					checked={ showTitle }
					onChange={ () =>
						setAttributes( { showTitle: ! showTitle } )
					}
				/>
				{ showTitle && (
					<SelectControl
						label={ __( 'Title Tag', 'getwid' ) }
						value={ titleTag }
						options={ [
							{ value: 'p', label: __( 'Paragraph', 'getwid' ) },
							{ value: 'h2', label: __( 'Heading 2', 'getwid' ) },
							{ value: 'h3', label: __( 'Heading 3', 'getwid' ) },
							{ value: 'h4', label: __( 'Heading 4', 'getwid' ) },
							{ value: 'h5', label: __( 'Heading 5', 'getwid' ) },
							{ value: 'h6', label: __( 'Heading 6', 'getwid' ) },
						] }
						onChange={ ( value ) =>
							setAttributes( { titleTag: value } )
						}
					/>
				) }
				<ToggleControl
					label={ __( 'Display Featured Image', 'getwid' ) }
					checked={ showFeaturedImage }
					onChange={ () =>
						setAttributes( {
							showFeaturedImage: ! showFeaturedImage,
						} )
					}
				/>
				{ showFeaturedImage && (
					<Fragment>
						<SelectControl
							label={ __( 'Image Size', 'getwid' ) }
							help={ __(
								'For images from Media Library only.',
								'getwid'
							) }
							value={ imageSize }
							onChange={ ( value ) =>
								setAttributes( { imageSize: value } )
							}
							options={ imageSizeOptions }
						/>
						<ToggleControl
							label={ __( 'Crop Images', 'getwid' ) }
							checked={ cropImages }
							onChange={ () =>
								setAttributes( {
									cropImages: ! cropImages,
								} )
							}
						/>
					</Fragment>
				) }
				<ToggleControl
					label={ __( 'Display Excerpt', 'getwid' ) }
					checked={ showContent }
					onChange={ () =>
						setAttributes( { showContent: ! showContent } )
					}
				/>
				{ showContent && (
					<RangeControl
						label={ __( 'Number of words', 'getwid' ) }
						value={ contentLength }
						onChange={ ( value ) =>
							setAttributes( { contentLength: value ?? 5 } )
						}
						min={ 5 }
						max={ maxExcerptLength }
					/>
				) }
				<ToggleControl
					label={ __( 'Display Date', 'getwid' ) }
					checked={ showDate }
					onChange={ () => setAttributes( { showDate: ! showDate } ) }
				/>
				<ToggleControl
					label={ __( 'Display Categories', 'getwid' ) }
					checked={ showCategories }
					onChange={ () =>
						setAttributes( {
							showCategories: ! showCategories,
						} )
					}
				/>
				<ToggleControl
					label={ __( 'Display Comments', 'getwid' ) }
					checked={ showCommentsCount }
					onChange={ () =>
						setAttributes( {
							showCommentsCount: ! showCommentsCount,
						} )
					}
				/>
				<QueryControls
					order={ order }
					orderBy={ orderBy }
					numberOfItems={ postsToShow }
					categoriesList={ categoriesList }
					selectedCategoryId={
						categories !== undefined ? Number( categories ) : ''
					}
					onOrderChange={ ( value ) =>
						setAttributes( { order: value } )
					}
					onOrderByChange={ ( value ) =>
						setAttributes( { orderBy: value } )
					}
					onCategoryChange={ ( value ) =>
						setAttributes( {
							categories:
								value !== '' ? value.toString() : undefined,
						} )
					}
					onNumberOfItemsChange={ ( value ) =>
						setAttributes( { postsToShow: value } )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
