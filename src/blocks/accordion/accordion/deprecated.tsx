import { createBlock, type BlockConfiguration } from '@wordpress/blocks';
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import clsx from 'clsx';

import Save from './save';
import type {
	AccordionAttributes,
	AccordionDeprecatedAttributes,
} from './types';

const baseClass = 'wp-block-getwid-accordion';

const deprecatedAttributes = {
	align: {
		type: 'string',
	},
	titles: {
		type: 'array',
		selector: '.wp-block-getwid-accordion__header-title',
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
		selector: '.wp-block-getwid-accordion__content',
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
		selector: '.wp-block-getwid-accordion',
		attribute: 'data-active-element',
		default: '0',
	},
	iconPosition: {
		type: 'string',
		default: 'left',
	},
	iconOpen: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-accordion__icon.is-passive i',
		attribute: 'class',
		default: 'fas fa-minus',
	},
	iconClose: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-accordion__icon.is-active i',
		attribute: 'class',
		default: 'fas fa-plus',
	},
	headerTag: {
		type: 'string',
		default: 'span',
	},
};

function DeprecatedSave( {
	attributes,
}: {
	attributes: AccordionDeprecatedAttributes;
} ) {
	const {
		titles,
		items,
		iconPosition,
		iconOpen,
		iconClose,
		active,
		headerTag = 'span',
		className,
	} = attributes;

	const Tag = headerTag as keyof JSX.IntrinsicElements;

	return (
		<div
			className={ clsx( className, {
				'has-icon-left': iconPosition === 'left',
			} ) }
			data-active-element={ active ?? '0' }
		>
			{ titles.map( ( item, index ) => (
				<Fragment key={ `${ index }-${ item.content }` }>
					<div className={ `${ baseClass }__header-wrapper` }>
						<Tag className={ `${ baseClass }__header` }>
							{  }
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
				</Fragment>
			) ) }
		</div>
	);
}

export const deprecated: BlockConfiguration< AccordionAttributes >[] = [
	{
		attributes: {
			align: {
				type: 'string',
			},
			active: {
				type: 'string',
				source: 'attribute',
				selector: '.wp-block-getwid-accordion',
				attribute: 'data-active-element',
				default: 'none',
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
		},
		isEligible: ( attributes, innerBlocks ) => {
			const firstInnerBlockParentAttributes =
				innerBlocks[ 0 ]?.attributes?.outerParent?.attributes;

			if ( ! firstInnerBlockParentAttributes ) {
				return false;
			}

			const hasUndefinedCloseIcon =
				! attributes.iconClose &&
				firstInnerBlockParentAttributes.iconClose;
			const hasUndefinedOpenIcon =
				! attributes.iconOpen &&
				firstInnerBlockParentAttributes.iconOpen;

			return Boolean( hasUndefinedCloseIcon || hasUndefinedOpenIcon );
		},
		migrate: ( attributes, innerBlocks ) => {
			const firstInnerBlockParentAttributes =
				innerBlocks[ 0 ]?.attributes?.outerParent?.attributes;

			if ( firstInnerBlockParentAttributes ) {
				attributes.iconClose =
					firstInnerBlockParentAttributes.iconClose;
				attributes.iconOpen = firstInnerBlockParentAttributes.iconOpen;
			}

			return [ attributes, innerBlocks ];
		},
		save: ( props ) => <Save { ...props } />,
	},
	{
		attributes: deprecatedAttributes,
		migrate: ( attributes ) => [
			{
				align: attributes.align,
				active: attributes.active,
				iconPosition: attributes.iconPosition,
				iconOpen: attributes.iconOpen,
				iconClose: attributes.iconClose,
				headerTag: attributes.headerTag,
			},
			attributes.items.map( ( item, index ) =>
				createBlock(
					'getwid/accordion-item',
					{
						title: attributes.titles[ index ]?.content,
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
		// @ts-expect-error Deprecated block settings permit legacy attribute shapes.
		save: ( props ) => <DeprecatedSave { ...props } />,
	},
];
