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

	renderSection(section) {
		
		const { attributes } = this.props;
		return attributes[section].map(({ cells }, rIndex) => (
			<tr key={ rIndex }>
				{ cells.map(({ value, colSpan, rowSpan }, cIndex) => {
					return (
						<RichText.Content
							tagName='td'
							key={ cIndex }
							colSpan={ colSpan }
							rowSpan={ rowSpan }
							value={ value }
						/>
					);
				} ) }
			</tr>
		) );
	}
	
	render() {
		const { baseClass } = this.props;
		const { head, foot, hasFixedLayout, tableCollapsed } = this.props.attributes;

		return (
			<div className={`${baseClass}`}>
				<table
					style={{
						tableLayout: hasFixedLayout ? 'fixed' : undefined,
						borderCollapse: tableCollapsed ? 'collapse' : undefined
					}}
				>
					{ !!head.length && (
						<thead>{ this.renderSection( 'head' ) }</thead>
					)}
					<tbody>{ this.renderSection( 'body' ) }</tbody>
					{ !!foot.length && (
						<tfoot>{ this.renderSection( 'foot' ) }</tfoot>
					)}
				</table>
			</div>
		);
	}
}

export default Save;