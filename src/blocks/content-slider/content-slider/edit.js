/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import { merge, isEqual, get, unescape, cloneDeep } from 'lodash';

/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { Component } = wp.element;
const { ToolbarGroup, ToolbarButton, Placeholder, Spinner } = wp.components;
const { BlockControls, InnerBlocks } = wp.blockEditor || wp.editor;
const { withSelect, withDispatch } = wp.data;
const { createBlock } = wp.blocks;

const { jQuery: $ } = window;

import './editor.scss';

/**
 * Create an Component
 */
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.state = {
			isPreview: true
		}

		this.addSlide = this.addSlide.bind(this);
		this.activateSlide = this.activateSlide.bind(this);
		this.getPreviewButtonText = this.getPreviewButtonText.bind(this);
	}

	addSlide() {
		const { insertBlock, getBlock, clientId } = this.props;

		let innerBlocks;
		const block = getBlock( clientId );
		if ( block ) {
			const insertedBlock = createBlock( 'getwid/content-slider-slide' );
			this.props.getBlock(this.props.clientId).activeSlideId = insertedBlock.clientId;

			innerBlocks = block.innerBlocks;
			insertBlock( insertedBlock, innerBlocks.length, clientId );
		}
	}

	activateSlide(index) {
		const { getBlock, clientId } = this.props;
		const innerBlocks = getBlock(clientId).innerBlocks;

		this.props.getBlock(this.props.clientId).activeSlideId = innerBlocks[index]?.clientId;
	}

	getPreviewButtonText() {
		return this.state.isPreview ? __( 'Edit', 'getwid' ) : __( 'Preview', 'getwid' );
	}

	componentDidMount() {
		this.activateSlide(0);
	}

	componentDidUpdate() {

	}

	render() {

		return (
			<div>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Add Slide', 'getwid' ) }
							text={ __( 'Add Slide', 'getwid' ) }
							onClick={ this.addSlide }
						/>
						<ToolbarButton
							label={ this.getPreviewButtonText() }
							text={ this.getPreviewButtonText() }
							onClick={ ()=> this.setState( { isPreview: !this.state.isPreview } ) }
						/>
					</ToolbarGroup>
				</BlockControls>

				<div className='wp-block-getwid-content-slider'>
					<InnerBlocks
						template={[
							['getwid/content-slider-slide', {}],
						]}
						allowedBlocks={['getwid/content-slider-slide']}
						templateLock={ false }
						renderAppender={ () => {
							return '';
						} }
						orientation="horizontal"
					/>
				</div>
			</div>
		);
	}

}

export default compose( [
	withSelect( ( select, props ) => {
		const { getBlock, getSettings } = select( 'core/block-editor' );
		return {
			getSettings,
			getBlock
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const { updateBlockAttributes, insertBlock } = dispatch( 'core/block-editor' );
		return {
			insertBlock,
			updateBlockAttributes
		};
	} ),
])( Edit );
