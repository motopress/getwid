/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

import Placeholder from './placeholder';

/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { Component } = wp.element;
const { ToolbarGroup, ToolbarButton } = wp.components;
const { BlockControls, InnerBlocks } = wp.blockEditor || wp.editor;
const { withSelect, withDispatch } = wp.data;
const { createBlock } = wp.blocks;

/**
 * Create an Component
 */
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.hasContent = this.hasContent.bind(this);
		this.addSlide = this.addSlide.bind(this);
	}

	hasContent() {
		const { getBlock, clientId } = this.props;

		const innerBlocks = getBlock( clientId ).innerBlocks;

		return innerBlocks.length > 0;
	}

	addSlide(position = 'after') {
		const { insertBlock, getBlock, clientId, getBlockIndex, getBlockRootClientId } = this.props;

		const rootId = getBlockRootClientId( clientId );
		const index = getBlockIndex( clientId, rootId ) + ( position === 'before' ? 0 : 1 );
		const block = getBlock( clientId );

		if ( block ) {
			const insertedBlock = createBlock( 'getwid/content-slider-slide' );

			insertBlock( insertedBlock, index, rootId );
		}
	}

	renderBlockControls() {
		return (
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						label={ __( 'Add Slide Before', 'getwid' ) }
						text={ __( 'Add Slide Before', 'getwid' ) }
						onClick={ () => {
							this.addSlide('before')
						} }
					/>
					<ToolbarButton
						label={ __( 'Add Slide After', 'getwid' ) }
						text={ __( 'Add Slide After', 'getwid' ) }
						onClick={ () => {
							this.addSlide()
						} }
					/>
				</ToolbarGroup>
			</BlockControls>
		)
	}

	render() {
		if ( ! this.hasContent() ) {
			return (
				<div>
					{ this.renderBlockControls() }
					<Placeholder rootClientId={ this.props.clientId } />
					<div style={ { display: 'none' } }>
						<InnerBlocks
							renderAppender={
								InnerBlocks.ButtonBlockAppender
							}
						/>
					</div>
				</div>
			);
		} else {
			return (
				<div className={ this.props.className }>
					{ this.renderBlockControls() }
					<div className="wp-block-getwid-content-slider-slide__wrapper">
						<InnerBlocks
							renderAppender={
								() => ( this.props.isSelected && ( <InnerBlocks.ButtonBlockAppender/> ) )
							}
						/>
					</div>
		 		</div>
		 	);
		}
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const {
			getBlock,
			getBlockRootClientId,
			getBlockIndex
		} = select( 'core/block-editor' );

		return {
			getBlock,
			getBlockRootClientId,
			getBlockIndex
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const { insertBlock } = dispatch( 'core/block-editor' );

		return {
			insertBlock
		};
	} ),
])( Edit );
