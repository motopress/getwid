import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import {
	createBlock,
	type Block,
	type BlockDeprecation,
	type BlockSaveProps,
} from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import type {
	ToggleAttributes,
	ToggleDeprecatedAttributes,
	ToggleHeaderTag,
} from '../types';

const baseClass = 'wp-block-getwid-toggle';

const currentAttributes = {
	align: {
		type: 'string',
	},
	iconPosition: {
		type: 'string',
		default: 'left',
	},
	iconOpen: {
		type: 'string',
		default: 'fas fa-minus',
	},
	iconClose: {
		type: 'string',
		default: 'fas fa-plus',
	},
	headerTag: {
		type: 'string',
		default: 'span',
	},
};

const legacyAttributes = {
	align: {
		type: 'string',
	},
	titles: {
		type: 'array',
		selector: `.${ baseClass }__header-title`,
		source: 'query',
		query: {
			content: {
				type: 'string',
				source: 'html',
			},
		},
		default: [],
	},
	items: {
		type: 'array',
		source: 'query',
		selector: `.${ baseClass }__content`,
		query: {
			content: {
				type: 'string',
				source: 'html',
			},
		},
		default: [],
	},
	active: {
		type: 'string',
		source: 'attribute',
		selector: `.${ baseClass }`,
		attribute: 'data-active-element',
		default: 'false',
	},
	iconPosition: {
		type: 'string',
		default: 'left',
	},
	iconOpen: {
		type: 'string',
		source: 'attribute',
		selector: `.${ baseClass }__icon.is-passive i`,
		attribute: 'class',
		default: 'fas fa-minus',
	},
	iconClose: {
		type: 'string',
		source: 'attribute',
		selector: `.${ baseClass }__icon.is-active i`,
		attribute: 'class',
		default: 'fas fa-plus',
	},
	headerTag: {
		type: 'string',
		default: 'span',
	},
};

function LegacySave( {
	attributes,
}: BlockSaveProps< ToggleDeprecatedAttributes > ) {
	const {
		align,
		titles,
		items,
		iconPosition,
		iconOpen = 'fas fa-minus',
		iconClose = 'fas fa-plus',
		active,
		headerTag = 'span',
	} = attributes;
	const Tag = headerTag as ToggleHeaderTag;
	const blockProps = useBlockProps.save( {
		className: clsx( {
			'has-icon-left': iconPosition === 'left',
			[ `align${ align }` ]: align,
		} ),
		'data-active-element': active,
	} );

	return (
		<div { ...blockProps }>
			{ titles.map( ( item, index ) => (
				<div className={ `${ baseClass }__row` } key={ index }>
					<div className={ `${ baseClass }__header-wrapper` }>
						<Tag className={ `${ baseClass }__header` }>
							<a href="#">
								<RichText.Content
									tagName="span"
									className={ `${ baseClass }__header-title` }
									value={ item.content }
								/>
								<span
									className={ `${ baseClass }__icon is-active` }
								>
									<i className={ iconClose } />
								</span>
								<span
									className={ `${ baseClass }__icon is-passive` }
								>
									<i className={ iconOpen } />
								</span>
							</a>
						</Tag>
					</div>
					<div className={ `${ baseClass }__content` }>
						<RichText.Content
							value={ items[ index ]?.content ?? '' }
						/>
					</div>
				</div>
			) ) }
		</div>
	);
}

export const deprecated: BlockDeprecation<
	ToggleAttributes,
	ToggleDeprecatedAttributes
>[] = [
	{
		attributes: currentAttributes,
		supports: {
			align: [ 'wide', 'full' ],
		},
		isEligible: ( attributes, innerBlocks: Block[] = [] ) => {
			const firstInnerBlockParentAttributes = (
				innerBlocks[ 0 ]?.attributes.outerParent as
					| { attributes?: Partial< ToggleAttributes > }
					| undefined
			 )?.attributes;

			if ( ! firstInnerBlockParentAttributes ) {
				return false;
			}

			return (
				( ! attributes.iconClose &&
					!! firstInnerBlockParentAttributes.iconClose ) ||
				( ! attributes.iconOpen &&
					!! firstInnerBlockParentAttributes.iconOpen )
			);
		},
		migrate: ( attributes, innerBlocks: Block[] = [] ) => {
			const firstInnerBlockParentAttributes = (
				innerBlocks[ 0 ]?.attributes.outerParent as
					| { attributes?: Partial< ToggleAttributes > }
					| undefined
			 )?.attributes;

			return [
				{
					...attributes,
					iconClose:
						attributes.iconClose ??
						firstInnerBlockParentAttributes?.iconClose,
					iconOpen:
						attributes.iconOpen ??
						firstInnerBlockParentAttributes?.iconOpen,
				},
				innerBlocks,
			];
		},
		save: SaveDeprecatedCurrent,
	},
	{
		attributes: legacyAttributes,
		supports: {
			align: [ 'wide', 'full' ],
		},
		migrate: ( attributes ) => [
			{
				align: attributes.align,
				iconPosition: attributes.iconPosition,
				iconOpen: attributes.iconOpen ?? 'fas fa-minus',
				iconClose: attributes.iconClose ?? 'fas fa-plus',
				headerTag: attributes.headerTag ?? 'span',
			},
			attributes.items.map( ( item, index ) =>
				createBlock(
					'getwid/toggle-item',
					{
						title: attributes.titles[ index ]?.content ?? '',
					},
					[
						createBlock( 'core/paragraph', {
							placeholder: __( 'Write heading…', 'getwid' ),
							content: item.content,
						} ),
					]
				)
			),
		],
		save: LegacySave,
	},
];

function SaveDeprecatedCurrent( {
	attributes: { align, iconPosition },
}: BlockSaveProps< ToggleAttributes > ) {
	const blockProps = useBlockProps.save( {
		className: clsx( {
			'has-icon-left': iconPosition === 'left',
			[ `align${ align }` ]: align,
		} ),
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
