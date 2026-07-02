import {
	InnerBlocks,
	RichText,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { ToggleItemEditProps } from './types';

const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

export default function Edit( props: ToggleItemEditProps ) {
	const { attributes, clientId, setAttributes } = props;
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
		( rootBlock?.attributes?.headerTag as keyof JSX.IntrinsicElements ) ??
		'span';
	const iconOpen =
		( rootBlock?.attributes?.iconOpen as string | undefined ) ??
		'fas fa-minus';
	const iconClose =
		( rootBlock?.attributes?.iconClose as string | undefined ) ??
		'fas fa-plus';
	const Tag = headerTag;
	const blockProps = useBlockProps( {
		'toggle-active-default': attributes.active ? 'true' : undefined,
	} );

	return (
		<>
			<Inspector { ...props } />
			<div { ...blockProps }>
				<div
					className={ clsx( 'wp-block-getwid-toggle__row', {
						'is-active': attributes.active,
					} ) }
				>
					<div className="wp-block-getwid-toggle__header-wrapper">
						<Tag className="wp-block-getwid-toggle__header">
							<a
								href="#"
								onClick={ ( event ) => event.preventDefault() }
							>
								<div className="wp-block-getwid-toggle__edit-area">
									<RichText
										tagName="span"
										className="wp-block-getwid-toggle__header-title"
										placeholder={ __(
											'Write heading…',
											'getwid'
										) }
										value={ attributes.title }
										allowedFormats={ allowedFormats }
										onChange={ ( title ) =>
											setAttributes( { title } )
										}
									/>
								</div>
								<span className="wp-block-getwid-toggle__icon is-active">
									<i className={ iconClose } />
								</span>
								<span className="wp-block-getwid-toggle__icon is-passive">
									<i className={ iconOpen } />
								</span>
							</a>
						</Tag>
					</div>

					<div className="wp-block-getwid-toggle__content-wrapper">
						<div className="wp-block-getwid-toggle__content">
							<InnerBlocks
								template={ [
									[
										'core/paragraph',
										{
											placeholder: __(
												'Write text…',
												'getwid'
											),
										},
									],
								] }
								templateInsertUpdatesSelection={ false }
								templateLock={ false }
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
