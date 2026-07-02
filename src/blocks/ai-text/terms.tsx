import apiFetch from '@wordpress/api-fetch';
import { Button } from '@wordpress/components';
import { createInterpolateElement, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

type TermsAndConditionsProps = {
	setTermsAccepted: ( termsAccepted: boolean ) => void;
};

export default function TermsAndConditions( {
	setTermsAccepted,
}: TermsAndConditionsProps ) {
	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState( false );

	function acceptTermsAndConditions() {
		setLoading( true );

		apiFetch( {
			path: '/wp/v2/users/me',
			method: 'POST',
			data: {
				meta: {
					getwid_ai_accept_terms: true,
				},
			},
		} )
			.then( () => {
				setTermsAccepted( true );
			} )
			.catch( () => {
				setError( true );
			} )
			.finally( () => {
				setLoading( false );
			} );
	}

	const text = createInterpolateElement(
		__(
			'In order to use this block, you must accept <link>Terms and Conditions</link>.',
			'getwid'
		),
		{
			link: (
				// Interpolated link text is provided by the translated string.
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				<a
					href="https://api2.getmotopress.com/terms-and-conditions/"
					target="_blank"
					rel="noreferrer"
				/>
			),
		}
	);

	return (
		<div className="wp-block-getwid-ai__terms">
			{ error && (
				<p>
					{ __(
						'An error occurred while updating user profile.',
						'getwid'
					) }
				</p>
			) }
			<p>{ text }</p>
			<Button
				isBusy={ loading }
				variant="primary"
				size="default"
				onClick={ acceptTermsAndConditions }
			>
				{ __( 'Accept', 'getwid' ) }
			</Button>
		</div>
	);
}
