/**
 * External dependencies
 */
import Inspector from './inspector';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;
const {
	ToolbarGroup,
	withFallbackStyles
} = wp.components;
import { __ } from 'wp.i18n';
const {
	AlignmentToolbar,
	BlockControls,
	withColors,
	withFontSizes,
} = wp.blockEditor || wp.editor;
const { compose } = wp.compose;
const { getComputedStyle } = window;

const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor, fontSize, customFontSize } = ownProps.attributes;
	const editableNode = node.querySelector( '[contenteditable="true"]' );
	// verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;

	return {
		fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
		fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
		fallbackFontSize: fontSize || customFontSize || ! computedStyles ? undefined : parseInt( computedStyles.fontSize ) || undefined,
	};
} );

/**
 * Create an Component
 */
class Edit extends Component {

	constructor() {
		super( ...arguments );
	}

	render() {
		const {
			attributes: {
				textAlignment,
				bold,
				italic,
			},
			textColor,
			fontSize,

			className,
			setAttributes,
		} = this.props;

		return (
			<Fragment>
				<Inspector { ...this.props } />
				<BlockControls>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ textAlignment => setAttributes({textAlignment}) }
					/>
					<ToolbarGroup controls={ [
						{
							icon: 'editor-bold',
							title: __( 'Bold', 'getwid' ),
							isActive: bold,
							onClick: () => {
								setAttributes( { bold: !bold } );
							}
						},
						{
							icon: 'editor-italic',
							title: __( 'Italic', 'getwid' ),
							isActive: italic,
							onClick: () => {
								setAttributes( { italic: !italic } );
							}
						},
					] }/>
				</BlockControls>
				<div
					className={ classnames(
						className,
						{
							[ fontSize.class ]: fontSize.class,
						})
					}
					style={ {
						color: textColor.color,
						textAlign: textAlignment,
						fontWeight: bold ? 'bold' : undefined,
						fontStyle: italic ? 'italic' : undefined,
						fontSize: !isNaN(fontSize.size) ? fontSize.size + 'px' : fontSize.size,
					} }
				>
					{ __( 'ACF Select', 'getwid' ) }
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	withFontSizes( 'fontSize' ),
	applyFallbackStyles,
] )( Edit );
