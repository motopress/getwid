/**
* External dependencies
*/
import Inspector from './inspector';
import classnames from 'classnames';
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
	Toolbar,
	withFallbackStyles
} = wp.components;
import { __ } from 'wp.i18n';
const {
	BlockAlignmentToolbar,
	AlignmentToolbar,
	BlockControls,
	withColors,
	withFontSizes,
} = wp.editor;
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

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);		
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	render() {
		const {
			attributes: {
				align,
				textAlignment,
				bold,
				italic,				
			},
			textColor,
			fontSize,
		
			setAttributes,
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const current_post_type = select("core/editor").getCurrentPostType();

		if (current_post_type && current_post_type == Getwid.templates.name){
			return (
				<Fragment>
					<Inspector {...{
						...this.props,
						...{changeState},
						...{getState},
					}} key='inspector'/>
					<BlockControls>
						<BlockAlignmentToolbar
							value={ align }
							controls= {[ 'wide', 'full' ]}
							onChange={ ( nextAlign ) => {
								setAttributes( { align: nextAlign } );
							} }
						/>
						{!['left', 'right'].includes(align) && (
							<AlignmentToolbar
								value={ textAlignment }
								onChange={ textAlignment => setAttributes({textAlignment}) }
							/>
						)}	
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
	
					<div
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
						{ __('Custom field', 'getwid') }
					</div>
	
				</Fragment>
			);			
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-post-custom-fields"
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