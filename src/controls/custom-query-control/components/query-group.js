/**
 * External dependencies
 */
import ConditionComponent from './query-condition';

/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';

const { Component } = wp.element;
const {
	ButtonGroup,
	Button,
	SelectControl,
} = wp.components;

class GroupComponent extends Component {

	constructor() {
		super( ...arguments );

		this.state = {
			relation: this.props.query.relation || 'OR'
		};
	}

	render() {

		const { query, parentQuery, possibleMetaKeys, updateMetaQuery } = this.props;

		const nestedLevelComponent = ( query.children || [] ).map( ( childQuery, index) => {
			if ( childQuery.children ) {
				return <GroupComponent
					key={ index }
					query={ childQuery }
					parentQuery={ query }
					possibleMetaKeys={ possibleMetaKeys }
					updateMetaQuery={ updateMetaQuery }
				/>
			} else if ( ! childQuery.children ) {
				return <ConditionComponent
					key={ index }
					query={ childQuery }
					parentQuery={ query }
					possibleMetaKeys={ possibleMetaKeys }
					updateMetaQuery={ updateMetaQuery }
				/>
			}
		} );

		const addCondition = () => {
			query.children.push( {
				key:          '',
				compare:      '',
				value:        [ '' ],
				type:         '',
			} );

			updateMetaQuery();
		}

		const addGroup = () => {
			query.children.push( {
				relation: 'AND',
				children: []
			} );

			updateMetaQuery();
		}

		const removeGroup = () => {
			const index  = parentQuery.children.indexOf( query );
			parentQuery.children.splice( index, 1 );

			updateMetaQuery();
		}

		return (
			<div className="components-getwid-custom-query-control__custom-condition">
				<div className="components-getwid-custom-query-control__group">
					<SelectControl
						className="components-getwid-custom-query-control__custom-relation"
						value={ ( this.state.relation ) }
						onChange={ value => {
							query.relation = value;
							this.setState( { relation: value } );
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
							icon={ 'no-alt' }
							iconSize={ 14 }
						/>
					) }
				</div>
				{ nestedLevelComponent }
				<ButtonGroup
					className="components-getwid-custom-query-control__custom-btn-condition"
				>
					<Button
						isSecondary
						onClick={ addCondition }
					>
						{ __( 'Add Condition', 'getwid' ) }
					</Button>
					<Button
						isSecondary
						onClick={ addGroup }
					>
						{ __( 'Add Group', 'getwid' ) }
					</Button>
				</ButtonGroup>
			</div>
		);
	}
}

export default GroupComponent;
