import { RichText, useBlockProps } from '@wordpress/block-editor';
import {
	createBlock,
	type BlockDeprecation,
	type BlockSaveProps,
} from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import type {
	TabsAttributes,
	TabsDeprecatedAttributes,
	TabsHeaderTag,
} from './types';

const baseClass = 'wp-block-getwid-tabs';

const deprecatedAttributes = {
	align: { type: 'string' },
	titles: {
		type: 'array',
		selector: `.${ baseClass }__title`,
		source: 'query',
		query: {
			content: { type: 'string', source: 'html' },
		},
		default: [],
	},
	items: {
		type: 'array',
		source: 'query',
		selector: `.${ baseClass }__tab-content`,
		query: {
			content: { type: 'string', source: 'html' },
		},
		default: [],
	},
	active: {
		type: 'string',
		source: 'attribute',
		selector: `.${ baseClass }`,
		attribute: 'data-active-tab',
	},
	type: { type: 'string', default: '' },
	headerTag: { type: 'string', default: 'span' },
};

function DeprecatedSave( {
	attributes,
}: BlockSaveProps< TabsDeprecatedAttributes > ) {
	const { titles, items, type = '', active, headerTag = 'span' } = attributes;
	const Tag = headerTag as TabsHeaderTag;
	const blockProps = useBlockProps.save( {
		className: clsx( { [ `has-layout-${ type }` ]: type !== '' } ),
		'data-active-tab': active,
	} );

	return (
		<div { ...blockProps }>
			<ul className={ `${ baseClass }__nav-links` }>
				{ titles.map( ( item, index ) => (
					<li className={ `${ baseClass }__nav-link` } key={ index }>
						<Tag className={ `${ baseClass }__title-wrapper` }>
							<a href={ `#tab-${ index }` }>
								<RichText.Content
									tagName="span"
									className={ `${ baseClass }__title` }
									value={ item.content }
								/>
							</a>
						</Tag>
					</li>
				) ) }
			</ul>
			{ items.map( ( item, index ) => (
				<div
					id={ `tab-${ index }` }
					className={ `${ baseClass }__tab-content` }
					key={ index }
				>
					<RichText.Content value={ item.content } />
				</div>
			) ) }
		</div>
	);
}

export const deprecated: BlockDeprecation<
	TabsAttributes,
	TabsDeprecatedAttributes
>[] = [
	{
		attributes: deprecatedAttributes,
		supports: {
			align: [ 'wide', 'full' ],
		},
		migrate: ( attributes ) => [
			{
				align: attributes.align,
				active: attributes.active,
				// Preserve the legacy migration's iconPosition-to-type mapping.
				type: ( attributes.iconPosition ??
					'' ) as TabsAttributes[ 'type' ],
				headerTag: attributes.headerTag ?? 'span',
			},
			attributes.items.map( ( item, index ) =>
				createBlock(
					'getwid/tabs-item',
					{ title: attributes.titles[ index ]?.content ?? '' },
					[
						createBlock( 'core/paragraph', {
							placeholder: __( 'Write heading…', 'getwid' ),
							content: item.content,
						} ),
					]
				)
			),
		],
		save: DeprecatedSave,
	},
];
