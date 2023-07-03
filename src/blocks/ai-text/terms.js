import { __ } from 'wp.i18n';
const apiFetch = wp.apiFetch;
const { Button } = wp.components;
const { createInterpolateElement, useState } = wp.element;

function TermsAndConditions( props ) {

    const [ loading, setLoading ] = useState( false );
    const [ error, setError ] = useState( false );

    const acceptTermsAndConditions = () => {

        setLoading( true );

        apiFetch( {
            path: '/wp/v2/users/me',
            method: 'POST',
            data: {
              meta: {
                getwid_ai_accept_terms: true
              }
            }
        } )
        .then( response => {

            props.setTermsAccepted( true );

        } )
        .catch( error => {
            setError( true );
        } )
        .finally( () => {
            setLoading( false );
        } );

    }

    const text = createInterpolateElement(
        __( 'In order to use this block you must accept <link>Terms and Conditions</link>.', 'getwid' ),
        {
            link: <a href="https://api2.getmotopress.com/terms-and-conditions/" target="_blank" />
        }
    );

    return (
        <div
            className='wp-block-getwid-ai__terms'
        >
            { error && (
                <p>{ __( 'An error occurred while updating user profile.', 'getwid') }</p>
            ) }
            <p>{ text }</p>
            <Button
                isPrimary
                isBusy={ loading }
                variant='primary'
                size='default'
                onClick={ () => acceptTermsAndConditions() }
            >
                { __( 'Accept', 'getwid' ) }
            </Button>
        </div>
    )
}

export default TermsAndConditions;