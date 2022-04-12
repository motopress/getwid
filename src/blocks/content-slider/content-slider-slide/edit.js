/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import { merge, isEqual, get, unescape, cloneDeep } from 'lodash';

import Placeholder from './placeholder';

/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { Component } = wp.element;
const { ToolbarGroup, ToolbarButton, Spinner, VisuallyHidden } = wp.components;
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

		this.state = {
			firstInit: true,
		}

		this.activateCurrentSlide = this.activateCurrentSlide.bind(this);
		this.shouldActivateSlide = this.shouldActivateSlide.bind(this);
		this.hasContent = this.hasContent.bind(this);
		this.addSlide = this.addSlide.bind(this);
	}

	activateCurrentSlide() {
		const rootId = this.props.getBlockRootClientId(this.props.clientId);

		this.props.getBlock(rootId).activeSlideId = this.props.clientId;

		this.props.getBlock(rootId).innerBlocks.forEach( (block) => {
			document.getElementById(`block-${block.clientId}`).removeAttribute('data-active');
		});

		document.getElementById(`block-${this.props.clientId}`).setAttribute('data-active', true);
	}

	shouldActivateSlide(prevProps) {
		const rootId = this.props.getBlockRootClientId(this.props.clientId);
		const isSelected = this.props.isSelected && !prevProps.isSelected;

		return isSelected || this.props.getBlock(rootId).activeSlideId === this.props.clientId;
	}

	hasContent() {
		const { getBlock, clientId } = this.props;

		const innerBlocks = getBlock(clientId).innerBlocks;

		return innerBlocks.length > 0;
	}

	addSlide(position = 'after') {
		const { insertBlock, getBlock, clientId, getBlockIndex, getBlockRootClientId } = this.props;

		const rootId = getBlockRootClientId(clientId);
		const index = getBlockIndex(clientId, rootId) + (position === 'before' ? 0 : 1);
		const block = getBlock( clientId );

		if ( block ) {
			const insertedBlock = createBlock( 'getwid/content-slider-slide' );

			getBlock(rootId).activeSlideId = insertedBlock.clientId;
			insertBlock( insertedBlock, index, rootId );
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if ( this.shouldActivateSlide(prevProps) ) {
			this.activateCurrentSlide();
		}
	}

	componentDidMount() {
		this.setState({
			firstInit: false,
		});
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
				<div>
					{ this.renderBlockControls() }
					<InnerBlocks
						renderAppender={
							InnerBlocks.ButtonBlockAppender
						}
					/>
		 		</div>
		 	);
		}
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const {
			getBlock,
			getSettings,
			getBlockRootClientId,
			getClientIdsOfDescendants,
			getClientIdsWithDescendants,
			getBlockIndex,
		} = select( 'core/block-editor' );
		return {
			getSettings,
			getBlock,
			getBlockRootClientId,
			getClientIdsOfDescendants,
			getClientIdsWithDescendants,
			getBlockIndex,
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const { insertBlock } = dispatch( 'core/block-editor' );
		return {
			insertBlock,
		};
	} ),
])( Edit );
