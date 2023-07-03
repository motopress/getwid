const apiFetch = wp.apiFetch;
const { useEffect, useState } = wp.element;
const { rawHandler, createBlock } = wp.blocks;
const { __ } = wp.i18n;

function useGetwidAI() {

    const [ loading, setLoading ] = useState( false );
    const [ content, setContent ] = useState( '' );
    const [ abortController, setAbortController ] = useState( null );
    const [ errors, setErrors ] = useState( [] );
    const [ context, setContext ] = useState( window.GetwidAIContext || [] );

    useEffect( () => {
        window.GetwidAIContext = context;
    }, [ context ]);

    async function makeStreamRequest ( prompt ) {

        const abortController = new AbortController();
        setAbortController( abortController );

        let fullContent = '';
        let hasErrors = false;

        setLoading( true );
        setContent( '' );
        setErrors( [] );

        const response = await apiFetch( {
            path: 'getwid/ai/v1/chat',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            method: 'POST',
            cache: "no-cache",
            signal: abortController.signal,
            keepalive: true,
            parse: false,
            data: {
                prompt,
                context,
                stream: true
            }
        } ).catch( error => {

            error.json().then( ( body ) => {

                let errors = [ ];

                if ( body.message ) {
                    errors.push( body.message );
                }

                if ( [ 'rest_missing_callback_param', 'rest_invalid_param' ].includes( body.code ) ) {

                    if ( body.data?.params ) {
                        errors.push( ...Object.values( body.data.params ) );
                    }

                }

                setErrors( errors );
                hasErrors = true;

            } );

        } );

        if ( hasErrors ) {

            setLoading( false );

            return '';
        }

        try {

            for await ( const chunk of readStreamResponse( response, abortController.signal ) ) {

                fullContent += chunk;
                setContent( fullContent );

            }

            context.pop();
            context.push( { prompt }, { response: fullContent } );
            setContext( context );

        } catch ( error ) {

            if ( error.name === 'AbortError' ) {

            } else {
                setErrors( [ __( 'Response parsing error.', 'getwid' ) ] );
            }

        }

        setLoading( false );

        return fullContent;
    }

    async function* readStreamResponse( response, signal ) {

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {

            const { value, done } = await reader.read();

            if ( done || signal.aborted ) break;

            const chunk = decoder.decode( value, { stream: true } );
            let parsedContent = parseStreamChunk( chunk );

            if ( parsedContent ) {
                yield parsedContent;
            }

        }

    }

    function parseStreamChunk( chunk ) {

        const lines = chunk.split('\n');
        let buffer = '';

        lines.forEach( line => {

            if ( line &&  line.startsWith( 'data:' ) ) {

                let content = JSON.parse( line.slice(5).trim() );

                buffer += content;
            }

        } );

        return buffer;
    }

    function parseBlocks( content ) {

        let blocks = rawHandler( { HTML: content } );

        return maybeFixBlocks( blocks );
    }

    function maybeFixBlocks( blocks ) {

        return blocks.map( block => {

            if ( ! block.isValid ) {
                return createBlock( block.name, block.attributes, block.innerBlocks );
            }

            return block;
        } );
    }

    function stopLoading() {
        abortController.abort();
    }

    return {
        loading,
        content,
        makeStreamRequest,
        errors,
        parseBlocks,
        stopLoading
    }
}

export default useGetwidAI;
