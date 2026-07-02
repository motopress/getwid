/**
 * External dependencies
 */
import './editor.scss';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
import React from 'react';

const { Component } = wp.element;
const { TextControl, Button } = wp.components;

class GetwidCustomRepeater extends Component {

	constructor() {
		super( ...arguments );
	}

	render() {
		const controlClassPrefix = 'components-getwid-custom-repeater-control';
		const { arrayData, placeholder } = this.props;

		const RepeatLists = arrayData.map( ( item, i ) => {
			return (
				<div
					key={ i }
					className={ classnames(
						`${controlClassPrefix}__custom-group`,
						{
							'initial': i == 0
						}
					) }

				>
					<TextControl
						placeholder={ placeholder }
						value={ arrayData[i] }
						onChange={ value => {
							arrayData[i] = value;
							this.setState( { arrayData } );
						} }
					/>
					{
						i === 0
							? (
								<Button
									size="small"
									className={ [ `${controlClassPrefix}__add-btn` ] }
									onClick={ () => {
										arrayData.push( '' );
										this.setState( { arrayData } );
									} }
								>
									{ __( 'Add Value', 'getwid' ) }
								</Button>
							) : (
								<Button
									label={ __( 'Remove Value', 'getwid' ) }
									className={ [ `${controlClassPrefix}__remove-btn` ] }
									onClick={ () => {
										arrayData.splice( i, 1 );
										this.setState( { arrayData } );
									} }
								>
									{ '-' }
								</Button>
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
