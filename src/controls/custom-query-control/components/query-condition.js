
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
			queryKey: this.props.query.queryKey || '',
			queryCompare: this.props.query.queryCompare ||'',
			queryValue: this.props.query.queryValue || '',
			queryValueSecond: this.props.query.queryValueSecond || '',
			queryType: this.props.query.queryType || '',
		};
	}

	render() {

		const { query, parentQuery, controlClassPrefix, getControlState, setControlState } = this.props;

		const removedSpacesTextCompare = query.queryCompare.replace( / /g, '' ),
			removedSpacesTextType = query.queryType.replace( / /g, '' );
		let   itemQueryValue;

		const removeCondition = () => {
			const index  = parentQuery.children.indexOf(query);
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
								<TextControl
									placeholder={ __( '2000-01-01 00:00', 'getwid' ) }
									value={ this.state.queryValue }
									onChange={ value => {
										query.queryValue = value;
										this.setState( { queryValue: value } );
									} }
								/>
								<TextControl
									placeholder={ __( '2000-01-02 00:00', 'getwid' ) }
									value={ this.state.queryValueSecond }
									onChange={ value => {
										query.queryValueSecond = value;
										this.setState( { queryValueSecond: value } );
									} }
								/>
							</div>
						);
						break;
					case 'DATE' :
						itemQueryValue = (
							<div className={ [ `${controlClassPrefix}__custom-between` ] }>
								<TextControl
									placeholder={ __( '2000-01-01', 'getwid' ) }
									value={ this.state.queryValue }
									onChange={ value => {
										query.queryValue = value;
										this.setState( { queryValue: value } );
									} }
								/>
								<TextControl
									placeholder={ __( '2000-01-02', 'getwid' ) }
									value={ this.state.queryValueSecond }
									onChange={ value => {
										query.queryValueSecond = value;
										this.setState( { queryValueSecond: value } );
									} }
								/>
							</div>
						);
						break;
					case 'TIME' :
						itemQueryValue = (
							<div className={ [ `${controlClassPrefix}__custom-between` ] }>
								<TextControl
									placeholder={ __( '00:00:00', 'getwid' ) }
									value={ this.state.queryValue }
									onChange={ value => {
										query.queryValue = value;
										this.setState( { queryValue: value } );
									} }
								/>
								<TextControl
									placeholder={ __( '01:00:00', 'getwid' ) }
									value={ this.state.queryValueSecond }
									onChange={ value => {
										query.queryValueSecond = value;
										this.setState( { queryValueSecond: value } );
									} }
								/>
							</div>
						);
						break;
					default :
						itemQueryValue = (
							<div className={ [ `${controlClassPrefix}__custom-between` ] }>
								<TextControl
									placeholder={ __( 'From', 'getwid' ) }
									value={ this.state.queryValue }
									onChange={ value => {
										query.queryValue = value;
										this.setState( { queryValue: value } );
									} }
								/>
								<TextControl
									placeholder={ __( 'To', 'getwid' ) }
									value={ this.state.queryValueSecond }
									onChange={ value => {
										query.queryValueSecond = value;
										this.setState( { queryValueSecond: value } );
									} }
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
							<TextControl
								placeholder={ __( '2000-01-01 00:00', 'getwid' ) }
								value={ this.state.queryValue }
								onChange={ value => {
									query.queryValue = value;
									this.setState( { queryValue: value } );
								} }
							/>
						);
						break;
					case 'DATE' :
						itemQueryValue = (
							<TextControl
								placeholder={ __( '2000-01-01', 'getwid' ) }
								value={ this.state.queryValue }
								onChange={ value => {
									query.queryValue = value;
									this.setState( { queryValue: value } );
								} }
							/>
						);
						break;
					case 'TIME' :
						itemQueryValue = (
							<TextControl
								placeholder={ __( '00:00:00', 'getwid' ) }
								value={ this.state.queryValue }
								onChange={ value => {
									query.queryValue = value;
									this.setState( { queryValue: value } );
								} }
							/>
						);
						break;
					default:
						itemQueryValue = (
							<TextControl
								placeholder={ __( 'Query Value', 'getwid' ) }
								value={ this.state.queryValue }
								onChange={ value => {
									query.queryValue = value;
									this.setState( { queryValue: value } );
								} }
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
					value={ this.state.queryKey }
					onChange={ value => {
						query.queryKey = value;
						this.setState( { queryKey: value } );
					} }
				/>
				<SelectControl
					className={ [ `${controlClassPrefix}__custom-query--compare` ] }
					value={ this.state.queryCompare }
					onChange={ value => {
						query.queryCompare = value;
						this.setState( { queryCompare: value } );
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
					value={ this.state.queryType }
					onChange={ value => {
						query.queryType = value;
						this.setState( { queryType: value } );
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
