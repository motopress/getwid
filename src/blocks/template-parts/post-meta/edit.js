/**
* External dependencies
*/
import classnames from "classnames";
import Inspector from './inspector';
import './editor.scss';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	Fragment,
	Component
} = wp.element;
const {
	BlockAlignmentToolbar,
	AlignmentToolbar,
	BlockControls,
	InnerBlocks,
} = wp.editor;
const {
	select,
} = wp.data;



/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-template-post-meta';


/**
* Module Constants
*/
const TEMPLATE = [
	['getwid/template-post-author'],
	['getwid/template-post-date']
];
const ALLOWED_BLOCKS = [
	'getwid/template-post-author',
	'getwid/template-post-categories',
	'getwid/template-post-comments',
	'getwid/template-post-tags',
	'getwid/template-post-date',
];

/**
* Create an Component
*/
class Edit extends Component{

	constructor(){
		super( ...arguments );
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	render(){
		const {
			attributes:{
				align,
				textAlignment,
				alignment,
				direction,
			},
			setAttributes,
			className
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const wrapperClasses = classnames(
			baseClass,
			align ? `align${ align }` : null,
			{
				// [`has-alignment-${alignment}`]: alignment !== 'left',
				[`has-direction-${direction}`]: direction !== 'row',
			}
		);
			
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
							controls= {[ 'wide', 'full', 'left', 'center', 'right' ]}
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

					<div
						className={wrapperClasses}
						style={{
							textAlign: textAlignment,
						}}
					>
						<InnerBlocks
							template={TEMPLATE}
							allowedBlocks={ALLOWED_BLOCKS}
							templateInsertUpdatesSelection={ false }
						/>
					</div>
				</Fragment>
			);			
		} else {
			return (
				<Fragment>
					<Disabled>
						<ServerSideRender
							block="getwid/template-post-meta"
							attributes={this.props.attributes}
						/>
					</Disabled>
				</Fragment>
			);
		}

	}
}

export default Edit;