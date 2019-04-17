/**
* External dependencies
*/
import classnames from 'classnames';
import Inspector from './inspector';
import GoogleFontLoader from 'react-google-font-loader';
import './editor.scss';


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
} = wp.element;
const {
	RichText,
	BlockControls,
	AlignmentToolbar,
	withColors
} = wp.editor;
const {compose} = wp.compose;


/**
* Create an Component
*/
class Edit extends Component {
	constructor( props ) {
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

	componentDidMount() {
		const {
			clientId
		} = this.props;

		this.textWrapper = $(`[data-block='${clientId}'] .wp-block-getwid-advanced-heading`);		
	}

	componentDidUpdate(prevProps, prevState) {
		
	}

	render() {
		const {
			attributes:
			{
				content,
				titleTag,
				fontFamily,
				fontSize,
				fontWeight,
				fontStyle,
				textTransform,
				lineHeight,
				letterSpacing,
				align,
				textAlignment,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,

				customBackgroundColor,
				customTextColor
			},
			className,
			backgroundColor,
			textColor,	
			setAttributes,
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const wrapperClass = classnames(className,
			{
				'alignfull': align === 'full',
				'alignwide': align === 'wide',
			}
		);

		const wrapperContentClass = classnames(
			`${className}__content`,
			{
				'has-text-color': textColor.color,
				[ textColor.class ]: textColor.class,				
				'has-background': (backgroundColor.color),
				[ backgroundColor.class ]: (backgroundColor.class),				
			}
		);

		return (
			<Fragment>
				{ fontFamily && (
					<GoogleFontLoader
						fonts={[ {
							font: fontFamily,
							weights: [fontWeight]
						} ]}
					/>
				)}
				<BlockControls>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( value ) => {
							setAttributes( { textAlignment: value } );
						}}
					/>
				</BlockControls>

				<Inspector {...{
					...this.props,
					...{changeState},
					...{getState}
				}} key='inspector'/>

				<div
					className={ wrapperClass }
					style={{
						marginTop,
						marginBottom,
					}}
				>
					<RichText
						tagName={ titleTag }
						value={ content }
						onChange={ ( value ) => setAttributes( { content: value } ) }		
						style={{
							textAlign: textAlignment,
							fontFamily: (fontFamily ? `"${fontFamily}"` : ''),
							fontSize: fontSize,
							fontWeight: fontWeight,
							fontStyle: fontStyle,
							textTransform: textTransform,
							lineHeight: lineHeight,
							letterSpacing: letterSpacing,
							paddingTop,
							paddingBottom,
							paddingLeft,
							paddingRight,
							marginLeft,
							marginRight,							
							color: ((typeof this.props.attributes.textColor != 'undefined' && typeof this.props.attributes.textColor.class == 'undefined') ?
								this.props.textColor.color : (customTextColor ? customTextColor : undefined)),
							backgroundColor: (this.props.backgroundColor.color ? this.props.backgroundColor.color : this.props.attributes.customBackgroundColor),
						}}
						className={ wrapperContentClass }
						placeholder={ __( 'Write heading…', 'getwid' ) }
					/>

				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( Edit );