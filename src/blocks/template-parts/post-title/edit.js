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
	Toolbar,
	withFallbackStyles
} = wp.components;
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	BlockAlignmentToolbar,
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
				headerTag,
				bold,
				italic,
			},
			textColor,
			fontSize,

			setAttributes,
		} = this.props;

		const current_post_type = select("core/editor").getCurrentPostType();

		const Tag = headerTag;

		if (current_post_type && current_post_type == Getwid.templates.name){
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
					}} key='inspector'/>
					<BlockControls>
						<AlignmentToolbar
							value={ textAlignment }
							onChange={ textAlignment => setAttributes({textAlignment}) }
						/>
						<Toolbar controls={[
							{
								icon: 'editor-bold',
								title: __('Bold', 'getwid'),
								isActive: bold,
								onClick: () => {
									setAttributes( { bold: !bold } );
								}
							},
							{
								icon: 'editor-italic',
								title: __('Italic', 'getwid'),
								isActive: italic,
								onClick: () => {
									setAttributes( { italic: !italic } );
								}
							},
						]}/>
					</BlockControls>

					<Tag
						className={ classnames(
						{
							[ fontSize.class ]: fontSize.class,
						})}
						style={{
								color: textColor.color,
								textAlign: textAlignment,
								fontWeight: bold ? 'bold' : undefined,
								fontStyle: italic ? 'italic' : undefined,
								fontSize: fontSize.size ? fontSize.size + 'px' : undefined,
						}}
					>
						{ __('Post Title', 'getwid') }
					</Tag>

				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-post-title"
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
