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
const {jQuery: $} = window;
const {
	Fragment,
	Component
} = wp.element;
const {
	BlockAlignmentToolbar,
	AlignmentToolbar,
	BlockControls,
	InnerBlocks,
	withColors,
} = wp.blockEditor || wp.editor;
const {
	select,
	dispatch
} = wp.data;
const { compose } = wp.compose;


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

		const innerBlocksOuter = select('core/block-editor').getBlock(this.props.clientId).innerBlocks;
		//Add parent attributes to children nodes
		if (innerBlocksOuter.length){
			jQuery.each(innerBlocksOuter, (index, item) => {

				if ((callFrom == 'Mount' && typeof item.attributes.blockDivider == 'undefined') || callFrom == 'Update'){
					//Inner blocks
					dispatch('core/block-editor').updateBlockAttributes(item.clientId, { blockDivider: blockDivider });
				}

			});
		}
	}

	render(){
		const {
			attributes:{
				textAlignment,
				direction,
			},
			textColor,

			setAttributes,
			className
		} = this.props;

		const wrapperClasses = classnames(
			baseClass,
			className,
			{
				[`has-direction-${direction}`]: direction !== 'row',
				'has-text-color': textColor.color,
				[ textColor.class ]: textColor.class,
			}
		);

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
						className={wrapperClasses}
						style={{
							textAlign: textAlignment,
							color: textColor.color,
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

export default compose([
	withColors({ textColor: 'color' }),
])(Edit);