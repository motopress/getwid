const apiFetch = wp.apiFetch;
const { select } = wp.data;
const { useEffect, useState } = wp.element;
const { rawHandler, createBlock } = wp.blocks;
const { __ } = wp.i18n;

function useGetwidAI() {

    const [ loading, setLoading ] = useState( false );
    const [ content, setContent ] = useState( '' );
    const [ abortController, setAbortController ] = useState( null );
    const [ errors, setErrors ] = useState( [] );
    const [ context, setContext ] = useState( window._context || [] );

    useEffect( () => {
        window._context = context;
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
            // signal: abortController.signal,
            keepalive: true,
            parse: false,
            data: {
                prompt,
                context,
                stream: true
            }
        } ).catch( response => {


            response.json().then( ( body ) => {

                let errors = [ ];

                if ( body.message ) {

                    errors.push( body.message );

                }

                if ( [ 'rest_missing_callback_param', 'rest_invalid_param' ].includes( body.code ) ) {

                    if ( body.data?.params ) {

                        errors.push( ...Object.values( body.data.params ) );

                    }

                }

                // if ( 'out_of_balance' === body.code ) {

                // }

                setErrors( errors );

                hasErrors = true;

            } );

        } );

        if ( hasErrors ) {

            setLoading( false );

            return '';

        }

        try {

            fullContent = await readStreamResponse( response, abortController.signal );

            setContext( [
                ...context,
                {
                    prompt,
                    response: fullContent
                }
            ] );

        } catch ( error ) {

            if ( error.name === 'AbortError' ) {

                console.log('AbortError content - ', fullContent);

            } else {

                setErrors( [ __( 'Response parsing error', 'getwid' ) ] );

            }

        }

        setLoading( false );

        return fullContent;

    }

    async function readStreamResponse( response, signal ) {

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = '';

        while (true) {

            const { value, done } = await reader.read();

            if ( done || signal.aborted ) break;

            const chunk = decoder.decode( value, { stream: true } );

            let parsedContent = parseStreamChunk( chunk );


            if ( parsedContent ) {

                buffer += parsedContent;

                setContent( prevContent => prevContent + parsedContent );

            }

        }

        return buffer;

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
