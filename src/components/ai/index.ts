import apiFetch from '@wordpress/api-fetch';
import { createBlock, rawHandler, type BlockInstance } from '@wordpress/blocks';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

type AiContextEntry = {
	prompt?: string;
	response?: string;
};

type AiErrorResponse = {
	code?: string;
	message?: string;
	data?: {
		params?: Record< string, string >;
	};
};

declare global {
	interface Window {
		GetwidAIContext?: AiContextEntry[];
	}
}

async function* readStreamResponse( response: Response, signal: AbortSignal ) {
	const reader = response.body?.getReader();
	const decoder = new TextDecoder();

	if ( ! reader ) {
		return;
	}

	while ( true ) {
		const { value, done } = await reader.read();

		if ( done || signal.aborted ) {
			break;
		}

		const chunk = decoder.decode( value, { stream: true } );
		const parsedContent = parseStreamChunk( chunk );

		if ( parsedContent ) {
			yield parsedContent;
		}
	}
}

function parseStreamChunk( chunk: string ) {
	const lines = chunk.split( '\n' );
	let buffer = '';

	lines.forEach( ( line ) => {
		if ( line && line.startsWith( 'data:' ) ) {
			const content = JSON.parse( line.slice( 5 ).trim() ) as string;

			buffer += content;
		}
	} );

	return buffer;
}

function maybeFixBlocks( blocks: BlockInstance[] ) {
	return blocks.map( ( block ) => {
		if ( ! block.isValid ) {
			return createBlock(
				block.name,
				block.attributes,
				block.innerBlocks
			);
		}

		return block;
	} );
}

export default function useGetwidAI() {
	const [ loading, setLoading ] = useState( false );
	const [ content, setContent ] = useState( '' );
	const [ abortController, setAbortController ] =
		useState< AbortController | null >( null );
	const [ errors, setErrors ] = useState< string[] >( [] );
	const [ context, setContext ] = useState< AiContextEntry[] >(
		window.GetwidAIContext || []
	);

	useEffect( () => {
		window.GetwidAIContext = context;
	}, [ context ] );

	async function makeStreamRequest( prompt?: string ) {
		const nextAbortController = new AbortController();
		setAbortController( nextAbortController );

		let fullContent = '';
		let hasErrors = false;

		setLoading( true );
		setContent( '' );
		setErrors( [] );

		const response = await apiFetch< Response >( {
			path: 'getwid/ai/v1/chat',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'text/event-stream',
			},
			method: 'POST',
			cache: 'no-cache',
			signal: nextAbortController.signal,
			keepalive: true,
			parse: false,
			data: {
				prompt,
				context,
				stream: true,
			},
		} ).catch( ( error ) => {
			error.json().then( ( body: AiErrorResponse ) => {
				const nextErrors: string[] = [];

				if ( body.message ) {
					nextErrors.push( body.message );
				}

				if (
					[
						'rest_missing_callback_param',
						'rest_invalid_param',
					].includes( body.code || '' ) &&
					body.data?.params
				) {
					nextErrors.push( ...Object.values( body.data.params ) );
				}

				setErrors( nextErrors );
				hasErrors = true;
			} );
		} );

		if ( hasErrors || ! response ) {
			setLoading( false );

			return '';
		}

		try {
			for await ( const chunk of readStreamResponse(
				response,
				nextAbortController.signal
			) ) {
				fullContent += chunk;
				setContent( fullContent );
			}

			const nextContext = [
				...context.slice( 0, -1 ),
				{ prompt },
				{ response: fullContent },
			];
			setContext( nextContext );
		} catch ( error ) {
			if ( ! ( error instanceof Error && error.name === 'AbortError' ) ) {
				setErrors( [ __( 'Response parsing error.', 'getwid' ) ] );
			}
		}

		setLoading( false );

		return fullContent;
	}

	function parseBlocks( nextContent: string ) {
		const blocks = rawHandler( { HTML: nextContent } );

		return maybeFixBlocks( blocks );
	}

	function stopLoading() {
		abortController?.abort();
	}

	return {
		loading,
		content,
		makeStreamRequest,
		errors,
		parseBlocks,
		stopLoading,
	};
}
