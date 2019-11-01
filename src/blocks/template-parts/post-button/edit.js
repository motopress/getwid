/**
* External dependencies
*/
import classnames from 'classnames';
import Inspector from './inspector';
import './editor.scss';


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
} = wp.element;
const {
	ServerSideRender,
	Disabled,
	withFallbackStyles,
} = wp.components;
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	BlockAlignmentToolbar,
	AlignmentToolbar,
	BlockControls,
	withColors,
	RichText,
} = wp.editor;
const {
	select,
} = wp.data;
const { compose } = wp.compose;


const { getComputedStyle } = window;

const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor } = ownProps;
	const backgroundColorValue = backgroundColor && backgroundColor.color;
	const textColorValue = textColor && textColor.color;
	//avoid the use of querySelector if textColor color is known and verify if node is available.
	const textNode = ! textColorValue && node ? node.querySelector( '[contenteditable="true"]' ) : null;
	return {
		fallbackBackgroundColor: backgroundColorValue || ! node ? undefined : getComputedStyle( node ).backgroundColor,
		fallbackTextColor: textColorValue || ! textNode ? undefined : getComputedStyle( textNode ).color,
	};
} )


/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );	

		this.nodeRef = null;
		this.bindRef = this.bindRef.bind( this );		
	}

	bindRef( node ) {
		if ( ! node ) {
			return;
		}
		this.nodeRef = node;
	}

	render() {
		const {
			attributes: {
				textAlignment,
				buttonText
			},
			backgroundColor,
			textColor,			

			setAttributes,
			className
		} = this.props;

		const current_post_type = select("core/editor").getCurrentPostType();

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
					</BlockControls>

					<div
						className={ classnames(
							className
						)}
						style={{
							textAlign: textAlignment
						}}
					>
						<div
							className={ classnames(
								'wp-block-button',
							) }							
							ref={ this.bindRef }>

							<RichText
								placeholder={ __('Read More', 'getwid') }
								value={ buttonText }
								onChange={ ( value ) => setAttributes( { buttonText: value } ) }
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
								className={ classnames(
									'wp-block-button__link', {
										'has-background': backgroundColor.color,
										[ backgroundColor.class ]: backgroundColor.class,
										'has-text-color': textColor.color,
										[ textColor.class ]: textColor.class,
									}
								) }
								style={ {
									backgroundColor: backgroundColor.color,
									color: textColor.color,
								} }
								keepPlaceholderOnFocus
							/>
						</div>
					</div>
	
				</Fragment>
			);			
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-post-link"
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
	applyFallbackStyles,
])(Edit);