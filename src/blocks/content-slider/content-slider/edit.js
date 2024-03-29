/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Navigation from './navigation';

/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { Component, createRef } = wp.element;
const { ToolbarGroup, ToolbarButton } = wp.components;
const { BlockControls, InnerBlocks } = wp.blockEditor || wp.editor;
const { withSelect, withDispatch, subscribe } = wp.data;
const { createBlock } = wp.blocks;

import './editor.scss';
import classnames from "classnames";

/**
 * Create an Component
 */
class Edit extends Component {

	constructor() {
		super(...arguments);

		this.state = {
			activeSlideIndex: 0,
			activeSlideID: '',
			slidesCount: 0,
			slidesOrder: []
		}

		this.sliderRef = createRef();

		this.addSlide = this.addSlide.bind(this);
		this.activateSlide = this.activateSlide.bind(this);
		this.getSelectedSlide = this.getSelectedSlide.bind(this);
		this.listenSlidesChange = this.listenSlidesChange.bind(this);
		this.isSlidesOrderChanged = this.isSlidesOrderChanged.bind(this);
		this.isSlidesSelectionUpdated = this.isSlidesSelectionUpdated.bind(this);
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

	activateSlide( index ) {
		const { clientId, getBlockOrder } = this.props;
		const blocksOrder = getBlockOrder( clientId );
		const activeSlideID = blocksOrder[index] || blocksOrder[0];
		const document = this.sliderRef.current?.ownerDocument;

		this.setState({
			slidesOrder: blocksOrder,
			activeSlideID: activeSlideID,
			activeSlide: index,
			slidesCount: blocksOrder.length
		});

		if ( ! document ) return;

		blocksOrder.forEach( ( blockId ) => {
			document.getElementById(`block-${blockId}`)?.setAttribute('data-hidden', true);
		});

		document.getElementById(`block-${activeSlideID}`)?.removeAttribute('data-hidden');
	}

	getSelectedSlide() {
		const {
			clientId,
			hasSelectedInnerBlock,
			getSelectedBlock
		} = this.props;

		if ( hasSelectedInnerBlock( clientId ) ) {
			return getSelectedBlock();
		}

		return null;
	}

	getIndexOfSelectedSlide() {
		const { clientId, getBlockIndex } = this.props;
		const selectedSlide = this.getSelectedSlide();

		return selectedSlide ? getBlockIndex( selectedSlide.clientId, clientId ) : 0;
	}

	listenSlidesChange() {
		if ( this.isSlidesOrderChanged() || this.isSlidesSelectionUpdated() ) {
			this.activateSlide( this.getIndexOfSelectedSlide() );
		}
	}

	isSlidesOrderChanged() {
		const newSlidesOrder = this.props.getBlockOrder( this.props.clientId );

		return ! isEqual( this.state.slidesOrder, newSlidesOrder );
	}

	isSlidesSelectionUpdated() {
		const {
			clientId,
			hasSelectedInnerBlock,
			getSelectedBlockClientId
		} = this.props;

		const hasSelectedSlide = hasSelectedInnerBlock( clientId );
		const selectedBlockId = getSelectedBlockClientId();

		return hasSelectedSlide && selectedBlockId !== this.state.activeSlideID;
	}

	componentDidMount() {
		this.activateSlide( 0 );

		subscribe( this.listenSlidesChange );
	}

	render() {

		const sliderClasses = classnames( this.props.className,
			`has-arrows-${this.props.attributes.arrows}`,
			`has-dots-${this.props.attributes.dots}`
		)

		return (
			<div>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Add Slide', 'getwid' ) }
							onClick={ this.addSlide }
						>
							{ __( 'Add Slide', 'getwid' ) }
						</ToolbarButton>
					</ToolbarGroup>
				</BlockControls>

				<Inspector { ...this.props } />

				<div
					ref={ this.sliderRef }
					className={ sliderClasses }
				>
					<Navigation
						addSlide={ this.addSlide }
						activateSlide={ this.activateSlide }
						activeSlideIndex={ this.state.activeSlide }
						activeSlideID={ this.state.activeSlideID }
						slidesCount={ this.state.slidesCount }
						slidesOrder={ this.state.slidesOrder }
						selectBlock={ this.props.selectBlock }
						isEditActive={ this.props.isSelected }
					/>

					<div className="wp-block-getwid-content-slider__wrapper">
						<InnerBlocks
							template={ [
								[ 'getwid/content-slider-slide', {} ],
							] }
							allowedBlocks={ [ 'getwid/content-slider-slide' ] }
							templateLock={ false }
							renderAppender={ () => {
								return '';
							} }
							orientation="horizontal"
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const {
			getBlock,
			getBlockIndex,
			getBlockOrder,
			hasSelectedInnerBlock,
			getSelectedBlockClientId,
			getSelectedBlock
		} = select( 'core/block-editor' );

		return {
			getBlock,
			getBlockIndex,
			getBlockOrder,
			hasSelectedInnerBlock,
			getSelectedBlockClientId,
			getSelectedBlock
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const {
			updateBlockAttributes,
			insertBlock,
			selectNextBlock,
			selectPreviousBlock,
			selectBlock
		} = dispatch( 'core/block-editor' );

		return {
			insertBlock,
			updateBlockAttributes,
			selectNextBlock,
			selectPreviousBlock,
			selectBlock
		};
	} ),
])( Edit );
