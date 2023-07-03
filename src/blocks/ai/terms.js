import { __ } from 'wp.i18n';
const apiFetch = wp.apiFetch;
const { Button } = wp.components;
const { createInterpolateElement } = wp.element;

function TermsAndConditions( props ) {

    const acceptTermsAndConditions = () => {

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

        } );

    }

    const text = createInterpolateElement(
        __( 'In order to use this block you must accept <link>Terms and Conditions</link>.', 'getwid' ),
        {
            link: <a href="#" />
        }
    );

    return (
        <div
            className='wp-block-getwid-ai__terms'
        >
            <p>{ text }</p>
            <Button
                isPrimary
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