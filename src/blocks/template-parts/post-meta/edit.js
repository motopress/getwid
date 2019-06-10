/**
* External dependencies
*/
import classnames from "classnames";
import Inspector from './inspector';
import './editor.scss';
import {
	isEqual
} from "lodash";


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
	dispatch
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
	['getwid/template-post-date'],
	['getwid/template-post-categories'],
	['getwid/template-post-tags'],
	['getwid/template-post-comments']
];
const ALLOWED_BLOCKS = [
	'core/paragraph',
	'getwid/template-post-author',
	'getwid/template-post-date',
	'getwid/template-post-categories',
	'getwid/template-post-tags',
	'getwid/template-post-comments',
];

/**
* Create an Component
*/
class Edit extends Component{

	constructor(){
		super( ...arguments );

		this.setInnerBlocksAttributes = this.setInnerBlocksAttributes.bind(this);
	}

	componentDidMount() {
		this.setInnerBlocksAttributes('Mount');
	}

	componentDidUpdate(prevProps, prevState) {
		this.setInnerBlocksAttributes('Update', prevProps, prevState);
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
	}

	setInnerBlocksAttributes(callFrom = 'mount', prevProps, prevState){
		const {
			attributes:
			{
				blockDivider,
			},
		} = this.props;

		if (callFrom == 'Update'){
			if (isEqual(this.props.attributes, prevProps.attributes)){
				return;
			}
		}

		const innerBlocksOuter = select('core/editor').getBlock(this.props.clientId).innerBlocks;
		//Add parent attributes to children nodes
		if (innerBlocksOuter.length){
			jQuery.each(innerBlocksOuter, (index, item) => {

				if ((callFrom == 'Mount' && typeof item.attributes.blockDivider == 'undefined') || callFrom == 'Update'){
					//Inner blocks
					dispatch('core/editor').updateBlockAttributes(item.clientId, { blockDivider: blockDivider });
				}

			});
		}
	}

	render(){
		const {
			attributes:{
				align,
				textAlignment,
				direction,
			},
			setAttributes,
			className
		} = this.props;

		const changeState = this.changeState;
		const getState = this.getState;

		const wrapperClasses = classnames(
			baseClass,
			className,
			align ? `align${ align }` : null,
			{
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