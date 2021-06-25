/**
 * External dependencies
 */
import './editor.scss';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import React from 'react';

const { Component, Fragment } = wp.element;
const { TextControl }         = wp.components;

class GetwidCustomRepeater extends Component {

	constructor() {
		super( ...arguments );
	}

	render() {
		const controlClassPrefix = 'components-getwid-custom-repeater-control';
		const { arrayData, placeholder } = this.props;

		const RepeatLists = arrayData.map( ( item, i ) => {
			return (
				<div className={ [ `${controlClassPrefix}__custom-group` ] } key={ i }>
					<TextControl
						placeholder={ placeholder }
						value={ item.key }
						onChange={ value => {
							item.key = value;
							this.setState( { key: value } );
						} }
					/>
					{
						i === 0
					    ? (
				            <button
					            className={ [ `${controlClassPrefix}__add-btn` ] }
				                onClick={ () => {
				                    arrayData.push( { key: '' } );
				                    this.setState( { arrayData } );
				                } }
				            >
				                { '+' }
				            </button>
					    ) : (
					        <button
						        className={ [ `${controlClassPrefix}__remove-btn` ] }
					            onClick={ () => {
					                arrayData.splice( i, 1 );
					                this.setState( { arrayData } );
					            } }
					        >
					            { '-' }
					        </button>
					    )
					}
				</div>
			);
		} );

		return (
			<div
				className={ classnames( 'components-base-control', controlClassPrefix ) }
			>
				{ RepeatLists }
			</div>
		);
	}
}

export default ( GetwidCustomRepeater );
