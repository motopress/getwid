import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';
import { Button, Icon, Spinner, TextControl } from '@wordpress/components';
import { RawHTML, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';
import { useGetwidAI } from 'getwid-components';

import { AI, Check, Cross, Plane } from './icons';
import TermsAndConditions from './terms';
import type { AiTextEditProps, CurrentUser } from './types';

import './editor.scss';

type BlockEditorDispatch = {
	insertBlocks: (
		blocks: BlockInstance[],
		index?: number,
		rootClientId?: string
	) => void;
	replaceBlocks: (
		clientIds: string | string[],
		blocks: BlockInstance[]
	) => void;
};

type BlockEditorSelect = {
	getBlock: ( clientId: string ) => BlockInstance;
	getClientIdsOfDescendants: ( clientIds: string[] ) => string[];
};

type CoreSelect = {
	getCurrentUser: () => CurrentUser;
};

export default function Edit( props: AiTextEditProps ) {
	const { attributes, clientId, setAttributes } = props;
	const blockProps = useBlockProps( {
		className: 'wp-block-getwid-ai',
	} );
	const [ showPlainContent, setShowPlainContent ] = useState( true );
	const [ termsAccepted, setTermsAccepted ] = useState( false );
	const { replaceBlocks, insertBlocks } = useDispatch(
		'core/block-editor'
	) as BlockEditorDispatch;
	const {
		loading,
		content,
		makeStreamRequest,
		errors,
		parseBlocks,
		stopLoading,
	} = useGetwidAI();
	const { getBlock, getClientIdsOfDescendants, currentUser } = useSelect(
		( select ) => {
			const blockEditorSelect = select(
				'core/block-editor'
			) as BlockEditorSelect;
			const coreSelect = select( 'core' ) as CoreSelect;

			return {
				currentUser: coreSelect.getCurrentUser(),
				getBlock: blockEditorSelect.getBlock,
				getClientIdsOfDescendants:
					blockEditorSelect.getClientIdsOfDescendants,
			};
		},
		[]
	);
	const termsAlreadyAccepted =
		Object.keys( currentUser ).length > 0
			? currentUser.meta?.getwid_ai_accept_terms
			: true;

	async function onSubmit( event: React.FormEvent< HTMLFormElement > ) {
		event.preventDefault();

		setShowPlainContent( true );

		const fullContent = await makeStreamRequest( attributes.prompt );
		const blocks = parseBlocks( fullContent );

		insertParsedBlocks( blocks );
	}

	function insertParsedBlocks( blocks: BlockInstance[] ) {
		const descendants = getClientIdsOfDescendants( [ clientId ] );

		if ( descendants.length > 0 ) {
			replaceBlocks( descendants, blocks );
		} else {
			insertBlocks( blocks, 0, clientId );
		}

		setShowPlainContent( false );
	}

	function replaceAIBlockWithGeneratedContent() {
		const innerBlocks = getBlock( clientId ).innerBlocks;

		replaceBlocks( clientId, innerBlocks );
	}

	return (
		<div { ...blockProps }>
			{ showPlainContent && content && (
				<RawHTML className="wp-block-getwid-ai__suggestion">
					{ content }
				</RawHTML>
			) }

			<div
				className={ clsx( 'wp-block-getwid-ai__parsed-blocks', {
					'is-visible': ! showPlainContent && errors.length === 0,
				} ) }
			>
				<InnerBlocks renderAppender={ false } />
			</div>

			<div className="wp-block-getwid-ai__prompt-wrapper">
				{ termsAlreadyAccepted || termsAccepted ? (
					<form
						className={ clsx( 'wp-block-getwid-ai__prompt-form', {
							'is-loading': loading,
						} ) }
						onSubmit={ onSubmit }
						autoComplete="off"
					>
						<div className="wp-block-getwid-ai__icon">
							{ loading ? (
								<Spinner />
							) : (
								<Icon size="16" icon={ AI } />
							) }
						</div>

						<TextControl
							className="wp-block-getwid-ai__prompt-input"
							value={ attributes.prompt || '' }
							onChange={ ( value ) =>
								setAttributes( { prompt: value } )
							}
							minLength={ 5 }
							required
							disabled={ loading }
							placeholder={ __(
								'Write your request or question to receive an AI-generated reply',
								'getwid'
							) }
						/>

						<div className="wp-block-getwid-ai__prompt-buttons">
							{ ( ( ! loading && showPlainContent ) ||
								errors.length > 0 ) && (
								<Button
									className="send"
									type="submit"
									variant="tertiary"
									icon={ Plane }
									iconSize="16"
								/>
							) }

							{ ! showPlainContent && errors.length === 0 && (
								<Button
									className="accept"
									disabled={ showPlainContent }
									variant="tertiary"
									onClick={
										replaceAIBlockWithGeneratedContent
									}
									icon={ Check }
									iconSize="16"
								>
									{ __( 'Accept', 'getwid' ) }
								</Button>
							) }

							{ loading && (
								<Button
									className="stop"
									variant="tertiary"
									onClick={ stopLoading }
									icon={ Cross }
									iconSize="15"
								>
									{ __( 'Stop', 'getwid' ) }
								</Button>
							) }
						</div>
					</form>
				) : (
					<TermsAndConditions setTermsAccepted={ setTermsAccepted } />
				) }

				{ errors?.length > 0 && (
					<div className="wp-block-getwid-ai__errors">
						<ul>
							{ errors.map( ( error ) => (
								<li key={ error }>{ error }</li>
							) ) }
						</ul>
					</div>
				) }
			</div>
		</div>
	);
}
