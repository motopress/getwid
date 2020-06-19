/**
* External dependencies
*/
import classnames from 'classnames';
import { isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import './style.scss';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { RichText, getColorClassName } = wp.blockEditor || wp.editor;

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
				{ cells.map(({ content, colSpan, rowSpan, styles }, cIndex) => (
					<RichText.Content
						tagName={ isEqual( section, 'head' ) ? 'th' : 'td' }
						key={ cIndex }
						colSpan={ colSpan }
						rowSpan={ rowSpan }
						style={ styles }
						value={ content }
					/>
				) ) }
			</tr>
		) );
	}
	
	render() {
		const {
			attributes: {
				head,
				foot,
				tableLayout,
				borderCollapse,

				horizontalAlign,
				verticalAlign,

				backgroundColor,
				textColor,

				customBackgroundColor,
				customTextColor
			},
			className
		} = this.props;

		const hasBackground = !!backgroundColor || !!customBackgroundColor;
		const hasTextColor  = !!textColor       || !!customTextColor;
		const hasAligment   = !!horizontalAlign || !!verticalAlign;
		
		const textClass = getColorClassName('color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		return (
			<div
				className={classnames(className, {
					[ `has-table-layout-${tableLayout}` ]: tableLayout,
					[ `has-border-collapse-${borderCollapse}` ]: borderCollapse
				})}
			>
				<table
					className={
						hasBackground || hasTextColor || hasAligment
							&& classnames(
							backgroundClass, textClass, {
								'has-background': backgroundColor || customBackgroundColor,
								'has-text-color': textColor || customTextColor,

								[ `has-horisontal-align-${horizontalAlign}` ]: !!horizontalAlign,
								[ `has-vertical-align-${verticalAlign}` ]: !!verticalAlign
							}
					)}
					style={{
						backgroundColor: backgroundColor
							? undefined
							: customBackgroundColor,

						color: textColor
							? undefined
							: customTextColor
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