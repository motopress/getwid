import { Button, ButtonGroup, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import QueryCondition from './query-condition';
import type { MetaQueryCondition, MetaQueryGroup } from '../types';
import { isMetaQueryGroup } from '../types';

type GroupProps = {
	query: MetaQueryGroup;
	parentQuery: MetaQueryGroup;
	possibleMetaKeys: string[];
	updateMetaQuery: () => void;
};

export default function QueryGroup( {
	query,
	parentQuery,
	possibleMetaKeys,
	updateMetaQuery,
}: GroupProps ) {
	const [ relation, setRelation ] = useState( query.relation || 'OR' );

	function addCondition() {
		query.children.push( {
			key: '',
			compare: '',
			value: [ '' ],
			type: '',
		} );
		updateMetaQuery();
	}

	function addGroup() {
		query.children.push( {
			relation: 'AND',
			children: [],
		} );
		updateMetaQuery();
	}

	function removeGroup() {
		const index = parentQuery.children.indexOf( query );
		parentQuery.children.splice( index, 1 );
		updateMetaQuery();
	}

	return (
		<div className="components-getwid-custom-query-control__custom-condition">
			<div className="components-getwid-custom-query-control__group">
				<SelectControl
					className="components-getwid-custom-query-control__custom-relation"
					value={ relation }
					onChange={ ( value ) => {
						query.relation = value;
						setRelation( value );
						updateMetaQuery();
					} }
					options={ [
						{ value: 'AND', label: 'AND' },
						{ value: 'OR', label: 'OR' },
					] }
				/>
				{ query !== parentQuery && (
					<Button
						label={ __( 'Remove Group', 'getwid' ) }
						className="components-getwid-custom-query-control__custom-query--btn-close"
						onClick={ removeGroup }
						icon="no-alt"
						iconSize={ 14 }
					/>
				) }
			</div>
			{ query.children.map(
				( childQuery: MetaQueryGroup | MetaQueryCondition, index ) =>
					isMetaQueryGroup( childQuery ) ? (
						<QueryGroup
							key={ index }
							query={ childQuery }
							parentQuery={ query }
							possibleMetaKeys={ possibleMetaKeys }
							updateMetaQuery={ updateMetaQuery }
						/>
					) : (
						<QueryCondition
							key={ index }
							query={ childQuery }
							parentQuery={ query }
							possibleMetaKeys={ possibleMetaKeys }
							updateMetaQuery={ updateMetaQuery }
						/>
					)
			) }
			<ButtonGroup className="components-getwid-custom-query-control__custom-btn-condition">
				<Button variant="secondary" onClick={ addCondition }>
					{ __( 'Add Condition', 'getwid' ) }
				</Button>
				<Button variant="secondary" onClick={ addGroup }>
					{ __( 'Add Group', 'getwid' ) }
				</Button>
			</ButtonGroup>
		</div>
	);
}
