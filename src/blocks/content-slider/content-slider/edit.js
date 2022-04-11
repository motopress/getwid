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

/**
 * Create an Component
 */
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.addSlide = this.addSlide.bind(this);
	}

	addSlide() {
		const { insertBlock, getBlock, clientId } = this.props;

		let innerBlocks;
		const block = getBlock( clientId );
		if ( block ) {
			const insertedBlock = createBlock( 'getwid/content-slider-slide' );

			innerBlocks = block.innerBlocks;
			insertBlock( insertedBlock, innerBlocks.length, clientId );
		}
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
					</ToolbarGroup>
				</BlockControls>

				<div>
					<InnerBlocks
						template={[
							['getwid/content-slider-slide', {}],
						]}
						allowedBlocks={['getwid/content-slider-slide']}
						templateLock={ false }
						renderAppender={ false }
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
