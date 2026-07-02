/**
 * External dependencies
 */
import GroupComponent from './query-group';

/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';

const { useState, useMemo, useEffect } = wp.element;
const {
	Modal,
	ButtonGroup,
	Button
} = wp.components;
const apiFetch = wp.apiFetch;


export default ( props ) => {

	const initialMetaQuery = useMemo( () => (
			props.metaQuery.length > 0 ? props.metaQuery
			: [ {
				relation: 'OR',
				children: []
			} ]
		),
		[ ]
	);

	const [ metaQuery, setMetaQuery ] = useState( initialMetaQuery );
	const [ possibleMetaKeys, setPossibleMetaKeys ] = useState( [] );

	useEffect( () => {
		apiFetch( {
			path: `/getwid/v1/get_meta_keys`,
			method: 'POST',
			data: { ...props.query },
		} )
		.then( data => setPossibleMetaKeys( data ) )
		.catch( () => { } );
	}, [] );

	return (
		<Modal
			title={ __( 'Meta Query Builder', 'getwid' ) }
			onRequestClose={ props.onRequestClose }
			size="large"
		>
			<div className="components-getwid-custom-query-control__custom-conditions">
				{ metaQuery.map( ( query, index ) =>
					{
						return (
							<GroupComponent
								key={ index }
								query={ query }
								parentQuery={ query }
								updateMetaQuery={ () => setMetaQuery( [ ...metaQuery ] ) }
								possibleMetaKeys={ possibleMetaKeys }
							/>
						)
					}
				) }
				<ButtonGroup className="components-getwid-custom-query-control__custom-btn-group">
					<Button
						isSecondary
						onClick={ props.onRequestClose }
					>
						{ __( 'Close', 'getwid' ) }
					</Button>
					<Button
						isPrimary
						onClick={ () => {
							if ( metaQuery[0]?.children?.length > 0 ) {
								props.updateMetaQuery( metaQuery )
							} else {
								props.updateMetaQuery( [] )
							}
						} }
					>
						{ __( 'Update', 'getwid' ) }
					</Button>
				</ButtonGroup>
			</div>
		</Modal>
	)
}
