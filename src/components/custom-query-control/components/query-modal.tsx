import { Button, ButtonGroup, Modal } from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import QueryGroup from './query-group';
import type { ApiFetch, MetaQueryGroup, QueryValues } from '../types';

type QueryModalProps = {
	onRequestClose: () => void;
	query: QueryValues;
	metaQuery?: MetaQueryGroup[];
	updateMetaQuery: ( metaQuery: MetaQueryGroup[] ) => void;
};

const emptyMetaQuery = [ { relation: 'OR', children: [] } ];
const apiFetch = (
	window as unknown as {
		wp?: {
			apiFetch?: unknown;
		};
	}
 ).wp?.apiFetch as ApiFetch | undefined;

function cloneMetaQuery( metaQuery: MetaQueryGroup[] ) {
	return JSON.parse( JSON.stringify( metaQuery ) ) as MetaQueryGroup[];
}

export default function QueryModal( {
	onRequestClose,
	query,
	metaQuery: currentMetaQuery = [],
	updateMetaQuery,
}: QueryModalProps ) {
	const initialMetaQuery = useMemo(
		() =>
			currentMetaQuery.length > 0
				? cloneMetaQuery( currentMetaQuery )
				: cloneMetaQuery( emptyMetaQuery ),
		[]
	);
	const [ metaQuery, setMetaQuery ] =
		useState< MetaQueryGroup[] >( initialMetaQuery );
	const [ possibleMetaKeys, setPossibleMetaKeys ] = useState< string[] >(
		[]
	);

	useEffect( () => {
		if ( ! apiFetch ) {
			return;
		}

		apiFetch< string[] >( {
			path: '/getwid/v1/get_meta_keys',
			method: 'POST',
			data: { ...query },
		} )
			.then( ( data ) => setPossibleMetaKeys( data ) )
			.catch( () => undefined );
	}, [] );

	return (
		<Modal
			title={ __( 'Meta Query Builder', 'getwid' ) }
			onRequestClose={ onRequestClose }
			size="large"
		>
			<div className="components-getwid-custom-query-control__custom-conditions">
				{ metaQuery.map( ( queryGroup, index ) => (
					<QueryGroup
						key={ index }
						query={ queryGroup }
						parentQuery={ queryGroup }
						updateMetaQuery={ () =>
							setMetaQuery( [ ...metaQuery ] )
						}
						possibleMetaKeys={ possibleMetaKeys }
					/>
				) ) }
				<ButtonGroup className="components-getwid-custom-query-control__custom-btn-group">
					<Button variant="secondary" onClick={ onRequestClose }>
						{ __( 'Close', 'getwid' ) }
					</Button>
					<Button
						variant="primary"
						onClick={ () => {
							if ( metaQuery[ 0 ]?.children?.length > 0 ) {
								updateMetaQuery( metaQuery );
							} else {
								updateMetaQuery( [] );
							}
						} }
					>
						{ __( 'Update', 'getwid' ) }
					</Button>
				</ButtonGroup>
			</div>
		</Modal>
	);
}
