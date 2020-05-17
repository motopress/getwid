/**
* External dependencies
*/
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { RichText } = wp.blockEditor || wp.editor;

/**
* Create an Component
*/
class Save extends Component {
	constructor() {
		super(...arguments);
	}
	
	render() {
		const { baseClass } = this.props;
		const { body } = this.props.attributes;

		//console.log( body );

		return (
			<div className={`${baseClass}`}>
				<table>
					<tbody>
						{ body.map(({ cells }, rowIndex) => {
								return (
									<tr key={ rowIndex }>
										{ cells.map(({ value, colSpan, rowSpan }, columnIndex) => {
												return (
													<RichText.Content
														tagName='td'
														key={ columnIndex }
														colSpan={ colSpan }
														rowSpan={ rowSpan }
														value={ value }
													/>
												);
											})
										}
									</tr>
								);
							} )
						}
					</tbody>
				</table>
			</div>
		);
	}
}

export default Save;