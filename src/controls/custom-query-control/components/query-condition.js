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
	Dashicon,
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
			value:   this.props.query.value   || [ { key: '' } ],
			type:    this.props.query.type    || '',
		};
	}

	render() {

		const { query, parentQuery, controlClassPrefix, getControlState, setControlState } = this.props;
		const { value } = this.state;

		const removedSpacesTextCompare = query.compare.replace( / /g, '' ),
			  removedSpacesTextType    = query.type.replace( / /g, '' );
		let   itemQueryValue;

		const removeCondition = () => {
			const index = parentQuery.children.indexOf( query );
			parentQuery.children.splice( index, 1 );

			setControlState( { metaScheme: getControlState('metaScheme') } );
		}

		switch ( removedSpacesTextCompare ) {
			case 'EXISTS':
			case 'NOTEXISTS':
				itemQueryValue = null;
				break;
			case 'BETWEEN':
			case 'NOTBETWEEN':
				switch ( removedSpacesTextType ) {
					case 'DATETIME' :
						itemQueryValue = (
							<div className={ [ `${controlClassPrefix}__custom-between` ] }>
								<GetwidCustomRepeater
									placeholder={ __( 'Query Value', 'getwid' ) }
									arrayData={ value }
								/>
							</div>
						);
						break;
					case 'DATE' :
						itemQueryValue = (
							<div className={ [ `${controlClassPrefix}__custom-between` ] }>
								<GetwidCustomRepeater
									placeholder={ __( 'Query Value', 'getwid' ) }
									arrayData={ value }
								/>
							</div>
						);
						break;
					case 'TIME' :
						itemQueryValue = (
							<div className={ [ `${controlClassPrefix}__custom-between` ] }>
								<GetwidCustomRepeater
									placeholder={ __( 'Query Value', 'getwid' ) }
									arrayData={ value }
								/>
							</div>
						);
						break;
					default :
						itemQueryValue = (
							<div className={ [ `${controlClassPrefix}__custom-between` ] }>
								<GetwidCustomRepeater
									placeholder={ __( 'Query Value', 'getwid' ) }
									arrayData={ value }
								/>
							</div>
						);
						break;
				}
				break;
			default:
				switch ( removedSpacesTextType ) {
					case 'DATETIME' :
						itemQueryValue = (
							<GetwidCustomRepeater
								placeholder={ __( 'Query Value', 'getwid' ) }
								arrayData={ value }
							/>
						);
						break;
					case 'DATE' :
						itemQueryValue = (
							<GetwidCustomRepeater
								placeholder={ __( 'Query Value', 'getwid' ) }
								arrayData={ value }
							/>
						);
						break;
					case 'TIME' :
						itemQueryValue = (
							<GetwidCustomRepeater
								placeholder={ __( 'Query Value', 'getwid' ) }
								arrayData={ value }
							/>
						);
						break;
					default:
						itemQueryValue = (
							<GetwidCustomRepeater
								placeholder={ __( 'Query Value', 'getwid' ) }
								arrayData={ value }
							/>
						);
						break;
				}
				break;
		}

		return (
			<div className={ [ `${controlClassPrefix}__custom-query` ] }>
				<TextControl
					placeholder={ __( 'Query Key', 'getwid' ) }
					value={ this.state.key }
					onChange={ value => {
						query.key = value;
						this.setState( { key: value } );
					} }
				/>
				<SelectControl
					className={ [ `${controlClassPrefix}__custom-query--compare` ] }
					value={ this.state.compare }
					onChange={ value => {
						query.compare = value;
						this.setState( { compare: value } );
					} }
					options={ [
						{ value: '', label: __( 'Compare', 'getwid' ) },
						{ value: '=', label: __( '=', 'getwid' ) },
						{ value: '!=', label: __( '!=', 'getwid' ) },
						{ value: '>', label: __( '>', 'getwid' ) },
						{ value: '>=', label: __( '>=', 'getwid' ) },
						{ value: '<', label: __( '<', 'getwid' ) },
						{ value: '<=', label: __( '<=', 'getwid' ) },
						{ value: 'LIKE', label: __( 'LIKE', 'getwid' ) },
						{ value: 'NOT LIKE', label: __( 'NOT LIKE', 'getwid' ) },
						{ value: 'IN', label: __( 'IN', 'getwid' ) },
						{ value: 'NOT IN', label: __( 'NOT IN', 'getwid' ) },
						{ value: 'BETWEEN', label: __( 'BETWEEN', 'getwid' ) },
						{ value: 'NOT BETWEEN', label: __( 'NOT BETWEEN', 'getwid' ) },
						{ value: 'EXISTS', label: __( 'EXISTS', 'getwid' ) },
						{ value: 'NOT EXISTS', label: __( 'NOT EXISTS', 'getwid' ) },
						{ value: 'REGEXP', label: __( 'REGEXP', 'getwid' ) },
						{ value: 'NOT REGEXP', label: __( 'NOT REGEXP', 'getwid' ) },
						{ value: 'RLIKE', label: __( 'RLIKE', 'getwid' ) },
					] }
				/>
				{ itemQueryValue }
				<SelectControl
					className={ [ `${controlClassPrefix}__custom-query--type` ] }
					value={ this.state.type }
					onChange={ value => {
						query.type = value;
						this.setState( { type: value } );
					} }
					options={ [
						{ value: '', label: __( 'Type', 'getwid' ) },
						{ value: 'NUMERIC', label: __( 'NUMERIC', 'getwid' ) },
						{ value: 'DECIMAL', label: __( 'DECIMAL', 'getwid' ) },
						{ value: 'SIGNED', label: __( 'SIGNED', 'getwid' ) },
						{ value: 'UNSIGNED', label: __( 'UNSIGNED', 'getwid' ) },
						{ value: 'CHAR', label: __( 'CHAR', 'getwid' ) },
						{ value: 'BINARY', label: __( 'BINARY', 'getwid' ) },
						{ value: 'DATETIME', label: __( 'DATETIME', 'getwid' ) },
						{ value: 'DATE', label: __( 'DATE', 'getwid' ) },
						{ value: 'TIME', label: __( 'TIME', 'getwid' ) },
					] }
				/>
				<Button
					onClick={ removeCondition }
				>
					<Dashicon icon="no-alt" />
				</Button>
			</div>
		);
	}
}

export default ConditionComponent;
