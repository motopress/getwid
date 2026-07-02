/**
* External dependencies
*/
import Inspector from './inspector';
import classnames from 'classnames';
import './editor.scss';


/**
* WordPress dependencies
*/
const { serverSideRender: ServerSideRender } = wp;
const {
	Component,
	Fragment,
} = wp.element;
const {
	Disabled,
	withFallbackStyles
} = wp.components;
import { __ } from 'wp.i18n';
const {
	AlignmentToolbar,
	BlockControls,
	withColors,
	withFontSizes,
} = wp.blockEditor || wp.editor;
const {
	select,
} = wp.data;
const { compose } = wp.compose;
const { getComputedStyle } = window;


const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor, fontSize, customFontSize } = ownProps.attributes;
	const editableNode = node.querySelector( '[contenteditable="true"]' );
	//verify if editableNode is available, before using getComputedStyle.
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
				showContent,
			},
			textColor,
			fontSize,

			className,

			setAttributes,
		} = this.props;

		const current_post_type = select("core/editor").getCurrentPostType();

		var text = '';
		if (showContent == 'excerpt'){
			text = __('Post Content (excerpt)', 'getwid');
		} else if (showContent == 'content'){
			text = __('Post Content (content)', 'getwid');
		} else if (showContent == 'full'){
			text = __('Post Content (full content)', 'getwid');
		}

		if (current_post_type && current_post_type == Getwid.templates.name){
			return (
				<Fragment>
					<Inspector { ...this.props } />
					<BlockControls>
						<AlignmentToolbar
							value={ textAlignment }
							onChange={ textAlignment => setAttributes({textAlignment}) }
						/>
					</BlockControls>

					<div
						className={ classnames(
							className,
							{
								[ fontSize.class ]: fontSize.class,
							}
						)}
						style={{
							color: textColor.color,
							textAlign: textAlignment,
							fontSize: !isNaN(fontSize.size) ? fontSize.size + 'px' : fontSize.size,
						}}
					>
						{text}
					</div>

				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-post-content"
							attributes={this.props.attributes}
						/>
					</Disabled>
				</Fragment>
			);
		}

	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
	withFontSizes( 'fontSize' ),
	applyFallbackStyles,
])(Edit);
