/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import Placeholder from './placeholder';

/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { Component } = wp.element;
const { ToolbarGroup, ToolbarButton } = wp.components;
const { BlockControls, InnerBlocks } = wp.blockEditor || wp.editor;
const { withSelect, withDispatch, subscribe } = wp.data;
const { createBlock } = wp.blocks;

/**
 * Create an Component
 */
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.state = {
			hasContent: true
		}

		this.hasContent = this.hasContent.bind(this);
		this.addSlide = this.addSlide.bind(this);
		this.listenSlideContentChange = this.listenSlideContentChange.bind(this);
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
						onClick={ () => {
							this.addSlide('before')
						} }
					>
						{ __( 'Add Slide Before', 'getwid' ) }
					</ToolbarButton>
					<ToolbarButton
						label={ __( 'Add Slide After', 'getwid' ) }
						onClick={ () => {
							this.addSlide()
						} }
					>
						{ __( 'Add Slide After', 'getwid' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
		)
	}

	listenSlideContentChange() {
		const slideContent = this.props.getBlockOrder( this.props.clientId );

		if ( ! this.state.hasContent && slideContent.length > 0 ) {
			this.setState({
				hasContent: true
			});
		}

		if ( this.state.hasContent && slideContent.length <= 0 ) {
			this.setState({
				hasContent: false
			});
		}
	}

	componentDidMount() {
		this.listenSlideContentChange();

		subscribe( this.listenSlideContentChange );
	}

	render() {
		const { hasContent } = this.state;

		return (
			<div className={ this.props.className }>
				{ this.renderBlockControls() }
				<div className="wp-block-getwid-content-slider-slide__wrapper">
					<InnerBlocks
						renderAppender={
							() => {
								if ( this.props.isSelected && hasContent ) return ( <InnerBlocks.ButtonBlockAppender/> );
								if ( ! hasContent ) return ( <Placeholder rootClientId={ this.props.clientId }/> );

								return '';
							}
						}
					/>
				</div>
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const {
			getBlock,
			getBlockRootClientId,
			getBlockIndex,
			getBlockOrder
		} = select( 'core/block-editor' );

		return {
			getBlock,
			getBlockRootClientId,
			getBlockIndex,
			getBlockOrder
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const { insertBlock } = dispatch( 'core/block-editor' );

		return {
			insertBlock
		};
	} ),
])( Edit );
