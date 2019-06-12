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
	Disabled
} = wp.components;
import { __ } from 'wp.i18n';
const {
	BlockAlignmentToolbar,
	AlignmentToolbar,
	BlockControls,
	withColors,
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
	}

	render() {
		const {
			attributes: {
				align,
				textAlignment,
				showContent,
			},
			textColor,

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
					<Inspector {...{
						...this.props,
					}} key='inspector'/>
					<BlockControls>
						<BlockAlignmentToolbar
							value={ align }
							controls= {[ 'left', 'center', 'right', 'wide', 'full' ]}
							onChange={ ( nextAlign ) => {
								setAttributes( { align: nextAlign } );
							} }
						/>				
						<AlignmentToolbar
							value={ textAlignment }
							onChange={ textAlignment => setAttributes({textAlignment}) }
						/>									
					</BlockControls>
	
					<div 
						className={ classnames(
							className,
						)}
						style={{
							color: textColor.color,
							textAlign: textAlignment
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
])(Edit);