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
	Dashicon,
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

		const { query, parentQuery, controlClassPrefix, getControlState, setControlState } = this.props;

		const nestedLevelComponent = ( query.children || [] ).map( ( childQuery, index) => {
			if ( childQuery.children ) {
				return <GroupComponent
					query={ childQuery }
					parentQuery={ query }
					getControlState={ getControlState }
					setControlState={ setControlState }
					controlClassPrefix={ controlClassPrefix }
				/>
			} else if ( ! childQuery.children ) {
				return <ConditionComponent
					query={ childQuery }
					parentQuery={ query }
					controlClassPrefix={ controlClassPrefix }
					getControlState={ getControlState }
					setControlState={ setControlState }
				/>
			}
		} );

		const addCondition = () => {
			query.children.push( {
				key:          '',
				compare:      '',
				value:        [
					{
						value:  ''
					}
				],
				type:         '',
			} );

			setControlState( { metaScheme: getControlState('metaScheme') } );
		}

		const addGroup = () => {
			query.children.push( {
				relation: 'AND',
				children: []
			} );

			setControlState( { metaScheme: getControlState( 'metaScheme' ) } );
		}

		const removeGroup = () => {
			const index  = parentQuery.children.indexOf(query);
			parentQuery.children.splice( index, 1 );

			setControlState( { metaScheme: getControlState( 'metaScheme' ) } );
		}

		return (
			<div className={ [ `${controlClassPrefix}__custom-condition` ] }>
				<div className={ [ `${controlClassPrefix}__group` ] }>
					<SelectControl
						className={ [ `${controlClassPrefix}__custom-relation` ] }
						placeholder={ __( 'Meta Relation', 'getwid' ) }
						value={ ( this.state.relation ) }
						onChange={ value => {
							query.relation = value;
							this.setState( { relation: value } );
						} }
						options={ [
							{ value: 'AND', label: __( 'AND', 'getwid' ) },
							{ value: 'OR', label: __( 'OR', 'getwid' ) },
						] }
					/>
					{ query !== parentQuery && (
						<Button
							onClick={ removeGroup }
						>
							<Dashicon icon="no-alt" />
						</Button>
					) }
				</div>
				{ nestedLevelComponent }
				<ButtonGroup
					className={ [ `${controlClassPrefix}__custom-btn-condition` ] }
				>
					<Button
						isDefault
						onClick={ addCondition }
					>
						<Dashicon icon="plus-alt" />
						{ __( 'Add Condition', 'getwid' ) }
					</Button>
					<Button
						isDefault
						onClick={ addGroup }
					>
						<Dashicon icon="editor-justify" />
						{ __( 'Add Group', 'getwid' ) }
					</Button>
				</ButtonGroup>
			</div>
		);
	}
}

export default GroupComponent;
