import {
	BlockAlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { Placeholder, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Fragment, useEffect, useRef } from '@wordpress/element';
import { __, isRTL } from '@wordpress/i18n';
import {
	CustomQueryToolbarButton,
	TemplateSelectToolbarButton,
} from 'getwid-components';
import jQuery from 'jquery';

import Inspector from './inspector';
import type { PostCarouselEditProps } from './types';

import './editor.scss';
import { ServerSideRender } from '@wordpress/server-side-render';
import { useRefEffect } from '@wordpress/compose';

const baseClass = 'wp-block-getwid-post-carousel';

type SlickElement = JQuery< HTMLElement > & {
	slick?: ( options: Record< string, unknown > ) => void;
};

function initEditorSlider(
	block: HTMLDivElement | null,
	attributes: PostCarouselEditProps[ 'attributes' ]
) {
	if ( ! block ) {
		return;
	}

	const slider = jQuery( block ).find(
		`.${ baseClass }__wrapper`
	) as SlickElement;

	slider.not( '.slick-initialized' ).slick?.( {
		arrows: attributes.sliderArrows !== 'none',
		dots: attributes.sliderDots !== 'none',
		slidesToShow: parseInt( attributes.sliderSlidesToShowDesktop, 10 ),
		slidesToScroll: parseInt( attributes.sliderSlidesToScroll, 10 ),
		autoplaySpeed: parseInt( String( attributes.sliderAutoplaySpeed ), 10 ),
		speed: parseInt( String( attributes.sliderAnimationSpeed ), 10 ),
		centerMode: attributes.sliderCenterMode,
		autoplay: attributes.sliderAutoplay,
		infinite: attributes.sliderInfinite,
		variableWidth: false,
		pauseOnHover: true,
		adaptiveHeight: true,
		fade: false,
		rows: 0,
		rtl: isRTL(),
	} );
}

function Edit( props: PostCarouselEditProps ) {
	const { attributes, setAttributes, recentPosts } = props;
	const {
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
	const blockProps = useBlockProps();

	const sliderRef = useRefEffect(
		( node ) => {
			const block = node as HTMLDivElement;
			const mutationObserver = new MutationObserver( () => {
				initEditorSlider( block, attributes );
			} );

			mutationObserver.observe( block, {
				childList: true,
				subtree: true,
			} );

			initEditorSlider( block, attributes );

			return () => mutationObserver.disconnect();
		},
		[
			attributes.sliderArrows,
			attributes.sliderDots,
			attributes.sliderSlidesToShowDesktop,
			attributes.sliderSlidesToScroll,
			attributes.sliderAutoplaySpeed,
			attributes.sliderAnimationSpeed,
			attributes.sliderCenterMode,
			attributes.sliderAutoplay,
			attributes.sliderInfinite,
		]
	);

	if ( ! hasPosts ) {
		return (
			<Fragment>
				<Inspector { ...props } />
				<div { ...blockProps }>
					<Placeholder
						icon="admin-post"
						label={ __( 'Post Carousel', 'getwid' ) }
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
				<TemplateSelectToolbarButton
					selectedTemplate={ postTemplate }
					onSelect={ ( templateID ) =>
						setAttributes( { postTemplate: templateID } )
					}
					previewRender={ ( templateID ) => (
						<ServerSideRender
							block="getwid/post-carousel"
							attributes={ {
								...attributes,
								postTemplate: String( templateID ),
							} }
						/>
					) }
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
				<div ref={ sliderRef }>
					<ServerSideRender
						block="getwid/post-carousel"
						attributes={ attributes }
					/>
				</div>
			</div>
		</Fragment>
	);
}

export default function ConnectedEdit(
	props: Omit< PostCarouselEditProps, 'recentPosts' >
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

			return core.getEntityRecords( 'postType', 'post', {
				order: props.attributes.order,
				per_page: props.attributes.postsToShow,
			} );
		},
		[ props.attributes.order, props.attributes.postsToShow ]
	);

	return (
		<Edit
			{ ...( props as PostCarouselEditProps ) }
			recentPosts={ recentPosts }
		/>
	);
}
