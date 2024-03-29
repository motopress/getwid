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
				icon,
				blockDivider
			},
			backgroundColor,
			textColor,
			iconColor,
			fontSize,

			setAttributes,
			className,
		} = this.props;

		const current_post_type = select("core/editor").getCurrentPostType();

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
								'has-background': backgroundColor.color,
								[ backgroundColor.class ]: backgroundColor.class,
								'has-text-color': textColor.color,
								[ textColor.class ]: textColor.class,
								[ fontSize.class ]: fontSize.class,
							}
						) }
						style={{
							textAlign: textAlignment,
							backgroundColor: backgroundColor.color,
							color: textColor.color,
							fontSize: !isNaN(fontSize.size) ? fontSize.size + 'px' : fontSize.size,
						}}
					>
						{icon ? (<i
							style={{color: iconColor.color ? iconColor.color : undefined}}
							className={ classnames(
								icon,
								{
									'has-text-color': iconColor.color,
									[ iconColor.class ]: iconColor.class,
								}
							) }></i>) : undefined} { __('Tags', 'getwid') } {blockDivider ? (<span className={'getwid-post-meta-divider'}>{blockDivider}</span>) : undefined}
					</div>

				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-post-tags"
							attributes={this.props.attributes}
						/>
					</Disabled>
				</Fragment>
			);
		}

	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }, 'iconColor'),
	withFontSizes( 'fontSize' ),
	applyFallbackStyles,
])(Edit);
