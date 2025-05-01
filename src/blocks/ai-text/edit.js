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
const { InnerBlocks } = wp.blockEditor;
const { useDispatch, useSelect } = wp.data;

import { getScrollableClassName } from 'GetwidUtils/help-functions';
import { AI, Plane, Check, Cross } from './icons';
import useGetwidAI from '../../utils/ai';
import TermsAndConditions from './terms';
/**
* Create an Component
*/
function Edit( props ) {

    const { attributes, setAttributes } = props;
    const [ showPlainContent, setShowPlainContent ] = useState( true );
    const [ termsAccepted, setTermsAccepted ] = useState( false );
    const { replaceBlocks, insertBlocks } = useDispatch( 'core/block-editor' );
    const { loading, content, makeStreamRequest, errors, parseBlocks, stopLoading } = useGetwidAI();
    const formRef = useRef( null );

    const { getBlock, getClientIdsOfDescendants, currentUser } = useSelect( ( select ) => {
        return {
            currentUser: select( 'core' ).getCurrentUser(),
            getBlock: select( 'core/block-editor' ).getBlock,
            getClientIdsOfDescendants: select( 'core/block-editor' ).getClientIdsOfDescendants
        }
    }, [] );

    const onSubmit = async ( event ) =>  {
        event.preventDefault();

        setShowPlainContent( true );

        let shouldIgnoreScroll = false;

        const focus = setInterval( () => {

            shouldIgnoreScroll = true;
            formRef?.current?.scrollIntoView( false );

        }, 150 );

        if ( getScrollableClassName() ) {

            document.getElementsByClassName( getScrollableClassName() )[0].addEventListener('scroll', () => {

                if ( shouldIgnoreScroll ) {
                    shouldIgnoreScroll = false;
                } else {
                    clearInterval( focus );
                }

            });
        }

        const fullContent = await makeStreamRequest( attributes.prompt );
        const blocks = parseBlocks( fullContent );

        insertParsedBlocks( blocks );

        clearInterval( focus );

    }

    const insertParsedBlocks = ( blocks ) => {

        const descendants = getClientIdsOfDescendants( [ props.clientId ] );

        if ( descendants.length > 0 ) {
            replaceBlocks( descendants, blocks );
        } else {
            insertBlocks( blocks, 0, props.clientId );
        }

        setShowPlainContent( false );
    }

    const replaceAIBlockWithGeneratedContent = () => {

        const innerBlocks = getBlock( props.clientId ).innerBlocks;

        replaceBlocks( props.clientId, innerBlocks );

    }

    let termsAlreadyAccepted = true;

    if ( Object.keys( currentUser ).length > 0 ) {
        termsAlreadyAccepted = currentUser?.meta?.getwid_ai_accept_terms;
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
                { ( termsAlreadyAccepted || termsAccepted ) ? (
                    <form
                        className= { classnames( 'wp-block-getwid-ai__prompt-form', {
                            'is-loading': loading
                        } ) }
                        onSubmit={ ( event ) => onSubmit( event ) }
                        autoComplete="off"
                    >
                        <div
                            className='wp-block-getwid-ai__icon'
                        >
                            { loading ? (
                                <Spinner/>
                            ) : (
                                <Icon
                                    size='16'
                                    icon={ AI }
                                />
                            ) }
                        </div>

                        <TextControl
                            className='wp-block-getwid-ai__prompt-input'
                            value={ attributes.prompt || '' }
                            onChange={ ( value ) => setAttributes( { prompt: value } ) }
                            minLength={ 5 }
                            required
                            disabled={ loading }
                            placeholder={ __( 'Write your request or question to receive an AI-generated reply', 'getwid' ) }
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
                ) : (
                    <TermsAndConditions
                        setTermsAccepted={ setTermsAccepted }
                    />
                ) }

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