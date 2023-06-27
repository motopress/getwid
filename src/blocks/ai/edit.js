/**
* External dependencies
*/
import classnames from 'classnames';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const { useState, useRef, RawHTML } = wp.element;
const { TextControl, Button, Spinner, Icon } = wp.components;
const { store, InnerBlocks } = wp.blockEditor;
const { useDispatch, select } = wp.data;

import { getScrollableClassName } from 'GetwidUtils/help-functions';
import { AI, Plane, Check, Cross } from './icons';
import useGetwidAI from '../../utils/ai';
/**
* Create an Component
*/
function Edit( props ) {

    const { attributes, setAttributes } = props;
    const [ showPlainContent, setShowPlainContent ] = useState( true );
    const { getBlock, getClientIdsOfDescendants } = select( store );
    const { replaceBlocks, insertBlocks } = useDispatch( store );
    const { loading, content, makeStreamRequest, errors, parseBlocks, stopLoading } = useGetwidAI();
    const formRef = useRef(null);
    const acceptButtonRef = useRef(null);
    const stopButtonRef = useRef(null);

    const onSubmit = async ( event ) =>  {
        event.preventDefault();

        setShowPlainContent( true );

        let shouldIgnoreScroll = false;

        const focus = setInterval( () => {

            shouldIgnoreScroll = true;
            formRef?.current?.scrollIntoView( false );

        }, 150 );

        document.getElementsByClassName( getScrollableClassName() )[0].addEventListener('scroll', () => {

            if ( shouldIgnoreScroll ) {

                shouldIgnoreScroll = false;

            } else {

                clearInterval( focus );

            }

        });

        const fullContent = await makeStreamRequest( attributes.prompt );
        const blocks = parseBlocks( fullContent );

        insertParsedBlocks( blocks );

        clearInterval( focus );

    }

    function insertParsedBlocks( blocks ) {

        const descendants = getClientIdsOfDescendants( [ props.clientId ] );

        if ( descendants.length > 0 ) {
            replaceBlocks( descendants, blocks );
        } else {
            insertBlocks( blocks, 0, props.clientId );
        }

        setShowPlainContent( false );
    }

    function replaceAIBlockWithGeneratedContent() {

        const innerBlocks = getBlock( props.clientId ).innerBlocks;

        replaceBlocks( props.clientId, innerBlocks );

    }

    return (
        <div className='wp-block-getwid-ai'>

            { ( showPlainContent && content ) && (
                <RawHTML
                    className='wp-block-getwid-ai__suggestion'
                    children={ content }
                />
            ) }

            <div
                className={ classnames( 'wp-block-getwid-ai__parsed-blocks', {
                    'is-visible': ! showPlainContent && errors.length == 0
                } ) }
            >
                <InnerBlocks
                    renderAppender={ false }
                />
            </div>

            <div className='wp-block-getwid-ai__prompt-wrapper' ref={ formRef }>
                <form
                    className= { classnames( 'wp-block-getwid-ai__prompt-form', {
                        'is-loading': loading
                    } ) }
                    onSubmit={ ( event ) => onSubmit( event ) }
                    autoComplete="off"
                >
                    { loading ? (
                        <Spinner
                            className='wp-block-getwid-ai__icon'
                        />
                    ) : (
                        <Icon
                            className='wp-block-getwid-ai__icon'
                            icon={ AI }
                        />
                    ) }

                    <TextControl
                        className='wp-block-getwid-ai__prompt-input'
                        value={ attributes.prompt || '' }
                        onChange={ ( value ) => setAttributes( { prompt: value } ) }
                        minLength={ 5 }
                        required
                        disabled={ loading }
                        placeholder={ __( 'Input your request or question to receive an AI-generated reply', 'getwid' ) }
                    />

                    <div className='wp-block-getwid-ai__prompt-buttons'>

                        { ( ( ! loading && showPlainContent ) || errors.length > 0 ) && (
                            <Button
                                className='send'
                                type='submit'
                                variant='tertiary'
                                icon={ Plane }
                                iconSize='16'
                            />
                        ) }

                        { ( ! showPlainContent && errors.length == 0 ) && (
                            <Button
                                ref={ acceptButtonRef }
                                className='accept'
                                disabled={ showPlainContent }
                                variant='tertiary'
                                onClick={ () => { replaceAIBlockWithGeneratedContent() } }
                                icon={ Check }
                                iconSize='16'
                            >
                                { __( 'Accept', 'getwid' ) }
                            </Button>
                        ) }

                        { loading && (
                            <Button
                                ref={ stopButtonRef }
                                className='stop'
                                variant='tertiary'
                                onClick={ () => {
                                    stopLoading();
                                } }
                                icon={ Cross }
                                iconSize='15'
                            >
                                { __( 'Stop', 'getwid' ) }
                            </Button>
                        ) }

                    </div>
                </form>

                { errors?.length > 0 && (
                    <div className='wp-block-getwid-ai__errors'>
                        <ul>
                            { errors.map( ( error, index ) => {
                                return <li key={ index }>{ error }</li>
                            }) }
                        </ul>
                    </div>
                ) }

            </div>

        </div>
    );

}

export default Edit;