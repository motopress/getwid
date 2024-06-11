/**
 * External dependencies
 */
import GetwidCustomRepeater from '../../custom-repeater';

/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';

const { Component } = wp.element;
const {
	Button,
	SelectControl,
	TextControl,
} = wp.components;

class ConditionComponent extends Component {

	constructor() {
		super( ...arguments );

		this.state = {
			key:     this.props.query.key     || '',
			compare: this.props.query.compare || '',
			value:   this.props.query.value   || [ '' ],
			type:    this.props.query.type    || '',
		};
	}

	render() {

		const { query, parentQuery, controlClassPrefix, getControlState, setControlState } = this.props;
		const removedSpacesTextCompare = query.compare.replace( / /g, '' );

		const removeCondition = () => {
			const index = parentQuery.children.indexOf( query );
			parentQuery.children.splice( index, 1 );

			setControlState( { metaScheme: getControlState( 'metaScheme' ) } );
		}

		return (
			<div className={ [ `${controlClassPrefix}__custom-query` ] }>
				<TextControl
					placeholder={ __( 'Key', 'getwid' ) }
					value={ query.key }
					onChange={ value => {
						query.key = value;
						this.setState( { key: value } );
					} }
				/>
				<SelectControl
					className={ [ `${controlClassPrefix}__custom-query--compare` ] }
					value={ query.compare }
					onChange={ value => {
						query.compare = value;
						this.setState( { compare: value } );
					} }
					options={ [
						{ value: '', label: __( 'Compare', 'getwid' ) },
						{ value: '=', label: '=' },
						{ value: '!=', label: '!=' },
						{ value: '>', label: '>' },
						{ value: '>=', label: '>=' },
						{ value: '<', label: '<' },
						{ value: '<=', label: '<=' },
						{ value: 'LIKE', label: 'LIKE' },
						{ value: 'NOT LIKE', label: 'NOT LIKE' },
						{ value: 'IN', label: 'IN' },
						{ value: 'NOT IN', label: 'NOT IN' },
						{ value: 'BETWEEN', label: 'BETWEEN' },
						{ value: 'NOT BETWEEN', label: 'NOT BETWEEN' },
						{ value: 'EXISTS', label: 'EXISTS' },
						{ value: 'NOT EXISTS', label: 'NOT EXISTS' },
						{ value: 'REGEXP', label: 'REGEXP' },
						{ value: 'NOT REGEXP', label: 'NOT REGEXP' },
						{ value: 'RLIKE', label: 'RLIKE' },
					] }
				/>
				{ removedSpacesTextCompare != 'EXISTS' && removedSpacesTextCompare != 'NOTEXISTS' && (
					<GetwidCustomRepeater
						placeholder={ __( 'Value', 'getwid' ) }
						arrayData={ query.value }
					/>
				) }
				{ removedSpacesTextCompare != 'EXISTS' && removedSpacesTextCompare != 'NOTEXISTS' && (
					<SelectControl
						className={ [ `${controlClassPrefix}__custom-query--type` ] }
						value={ query.type }
						onChange={ value => {
							query.type = value;
							this.setState( { type: value } );
						} }
						options={ [
							{ value: '', label: __( 'Type', 'getwid' ) },
							{ value: 'NUMERIC', label: 'NUMERIC' },
							{ value: 'DECIMAL', label: 'DECIMAL' },
							{ value: 'SIGNED', label: 'SIGNED' },
							{ value: 'UNSIGNED', label: 'UNSIGNED' },
							{ value: 'CHAR', label: 'CHAR' },
							{ value: 'BINARY', label: 'BINARY' },
							{ value: 'DATETIME', label: 'DATETIME' },
							{ value: 'DATE', label: 'DATE' },
							{ value: 'TIME', label: 'TIME' },
						] }
					/>
				) }
				<Button
					label={ __( 'Remove Condition', 'getwid' ) }
					className={ [ `${controlClassPrefix}__custom-query--btn-close` ] }
					icon={ 'no-alt' }
					iconSize={ 14 }
					onClick={ removeCondition }
				/>
			</div>
		);
	}
}

export default ConditionComponent;
