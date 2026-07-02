import {
	AlignmentToolbar,
	BlockControls,
	InnerBlocks,
	useBlockProps,
	withColors,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { ServerSideRenderProps, TemplatePostMetaEditProps } from './types';

import './editor.scss';
import './style.scss';

const TEMPLATE = [
	[ 'getwid/template-post-author' ],
	[ 'getwid/template-post-date' ],
	[ 'getwid/template-post-categories' ],
	[ 'getwid/template-post-tags' ],
	[ 'getwid/template-post-comments' ],
];

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'getwid/template-post-author',
	'getwid/template-post-date',
	'getwid/template-post-categories',
	'getwid/template-post-tags',
	'getwid/template-post-comments',
];

const baseClass = 'wp-block-getwid-template-post-meta';

const ServerSideRender = (
	window as unknown as {
		wp?: {
			serverSideRender?: ( props: ServerSideRenderProps ) => JSX.Element;
		};
	}
 ).wp?.serverSideRender;

function getGetwidSettings() {
	return (
		window as unknown as {
			Getwid?: {
				templates?: { name?: string };
			};
		}
	 ).Getwid;
}

function Edit( props: TemplatePostMetaEditProps ) {
	const { attributes, setAttributes, textColor, clientId } = props;
	const { textAlignment, direction, blockDivider } = attributes;
	const currentPostType = useSelect(
		( select ) =>
			(
				select( 'core/editor' ) as {
					getCurrentPostType: () => string | undefined;
				}
			 ).getCurrentPostType(),
		[]
	);
	const innerBlocks = useSelect(
		( select ) =>
			(
				select( blockEditorStore ) as {
					getBlock: ( nextClientId: string ) =>
						| {
								innerBlocks: Array< {
									clientId: string;
									attributes: { blockDivider?: string };
								} >;
						  }
						| undefined;
				}
			 ).getBlock( clientId )?.innerBlocks || [],
		[ clientId ]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore ) as {
		updateBlockAttributes: (
			nextClientId: string,
			nextAttributes: Record< string, unknown >
		) => void;
	};
	const getwidSettings = getGetwidSettings();
	const blockProps = useBlockProps( {
		className: clsx( baseClass, {
			[ `has-direction-${ direction }` ]: direction !== 'row',
			'has-text-color': textColor.color,
			[ textColor.class || '' ]: textColor.class,
		} ),
		style: {
			textAlign: textAlignment,
			color: textColor.color,
		},
	} );

	useEffect( () => {
		innerBlocks.forEach( ( innerBlock ) => {
			if ( innerBlock.attributes.blockDivider !== blockDivider ) {
				updateBlockAttributes( innerBlock.clientId, { blockDivider } );
			}
		} );
	}, [ blockDivider, innerBlocks, updateBlockAttributes ] );

	if ( currentPostType === getwidSettings?.templates?.name ) {
		return (
			<>
				<Inspector { ...props } />
				<BlockControls>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( nextTextAlignment ) =>
							setAttributes( {
								textAlignment: nextTextAlignment,
							} )
						}
					/>
				</BlockControls>
				<div { ...blockProps }>
					<InnerBlocks
						template={ TEMPLATE }
						allowedBlocks={ ALLOWED_BLOCKS }
						templateInsertUpdatesSelection={ false }
					/>
				</div>
			</>
		);
	}

	return (
		<Disabled>
			{ ServerSideRender && (
				<ServerSideRender
					block="getwid/template-post-meta"
					attributes={ attributes }
				/>
			) }
		</Disabled>
	);
}

export default withColors( { textColor: 'color' } )( Edit );
