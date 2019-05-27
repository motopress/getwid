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
	Disabled
} = wp.components;
import { __ } from 'wp.i18n';
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
				buttonText
			},
			backgroundColor,
			textColor,
			setBackgroundColor,
			setTextColor,

			setAttributes,
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const current_post_type = select("core/editor").getCurrentPostType();

		if (current_post_type && current_post_type == 'getwid_template_part'){
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
							controls= {[ 'left', 'center', 'right' ]}
							onChange={ ( nextAlign ) => {
								setAttributes( { align: nextAlign } );
							} }
						/>
						<AlignmentToolbar
							value={ textAlignment }
							onChange={ textAlignment => setAttributes({textAlignment}) }
						/>					
					</BlockControls>
	
					<div style={{textAlign: textAlignment}}>
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
])(Edit);