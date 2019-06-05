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
	Toolbar
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
				icon,
				bold,
				italic,
			},
			backgroundColor,
			textColor,
			
			setAttributes,
			className,
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
							controls= {[ 'left', 'center', 'right' ]}
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
							className,
							{
								'has-background': backgroundColor.color,
								[ backgroundColor.class ]: backgroundColor.class,
								'has-text-color': textColor.color,
								[ textColor.class ]: textColor.class,
							}
						) }
						style={{
							textAlign: textAlignment,
							fontWeight: bold ? 'bold' : undefined,
							fontStyle: italic ? 'italic' : undefined,
							backgroundColor: backgroundColor.color,
							color: textColor.color,
						}}
					>
						{icon ? (<i className={icon}></i>) : undefined} { __('Date', 'getwid') }
					</div>
	
				</Fragment>
			);			
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-post-date"
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