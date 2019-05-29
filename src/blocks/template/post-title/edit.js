/**
* External dependencies
*/
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
				headerTag
			},
			textColor,			
			setAttributes,
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const current_post_type = select("core/editor").getCurrentPostType();

		const Tag = headerTag;

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
					</BlockControls>
	
					<Tag style={{
							color: textColor.color,
							textAlign: textAlignment}}>
						{ __('Title text', 'getwid') }
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
])(Edit);