import {
	InnerBlocks,
	RichText,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import type { AccordionItemAttributes } from './types';
import type { BlockEditProps } from '@wordpress/blocks';
import Inspector from './inspector';

const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

export default function Edit(
	props: BlockEditProps< AccordionItemAttributes >
) {
	const { attributes, clientId, setAttributes, isSelected } = props;

	const rootClientId = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlockRootClientId( clientId ),
		[ clientId ]
	);
	const rootBlock = useSelect(
		( select ) =>
			rootClientId
				? select( blockEditorStore ).getBlock( rootClientId )
				: null,
		[ rootClientId ]
	);
	const headerTag =
		( rootBlock?.attributes?.headerTag as
			| keyof JSX.IntrinsicElements
			| undefined ) ?? 'span';
	const iconOpen =
		( rootBlock?.attributes?.iconOpen as string | undefined ) ??
		'fas fa-minus';
	const iconClose =
		( rootBlock?.attributes?.iconClose as string | undefined ) ??
		'fas fa-plus';
	const Tag = headerTag;

	const blockProps = useBlockProps( {
		className: clsx( {
			'is-opened': isSelected,
		} ),
	} );

	return (
		<div { ...blockProps }>
			<Inspector { ...props } />
			<div className="wp-block-getwid-accordion__header-wrapper">
				<Tag className="wp-block-getwid-accordion__header">
					<a
						href="#"
						onClick={ ( e ) => {
							e.preventDefault();
						} }
						tabIndex="-1"
					>
						<div className="wp-block-getwid-accordion__edit-area">
							<RichText
								tagName="span"
								className="wp-block-getwid-accordion__header-title"
								placeholder={ __( 'Write heading…', 'getwid' ) }
								value={ attributes.title }
								onChange={ ( title ) =>
									setAttributes( { title } )
								}
								allowedFormats={ allowedFormats }
							/>
						</div>
						<span className="wp-block-getwid-accordion__icon is-active">
							<i className={ iconClose } />
						</span>
						<span className="wp-block-getwid-accordion__icon is-passive">
							<i className={ iconOpen } />
						</span>
					</a>
				</Tag>
			</div>

			<div className="wp-block-getwid-accordion__content-wrapper">
				<div className="wp-block-getwid-accordion__content">
					<InnerBlocks
						template={ [
							[
								'core/paragraph',
								{
									placeholder: __( 'Write text…', 'getwid' ),
								},
							],
						] }
						templateInsertUpdatesSelection={ false }
						templateLock={ false }
					/>
				</div>
			</div>
		</div>
	);
}
