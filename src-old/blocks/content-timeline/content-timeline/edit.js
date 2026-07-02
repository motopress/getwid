/**
* External dependencies
*/
import { __ } from 'wp.i18n';

import { isEqual, get } from 'lodash';
/**
 * Internal dependencies
 */
import Inspector from './inspector';

import './editor.scss';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;

const { withColors, InnerBlocks, getColorObjectByAttributeValues } = wp.blockEditor || wp.editor;
const { Component, Fragment, createContext, createRef } = wp.element;

const { Button } = wp.components;
const { createBlock } = wp.blocks;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/content-timeline-item' ];

const { Consumer, Provider } = createContext();

/**
* Create an Component
*/
class GetwidTimeline extends Component {

	constructor() {
		super(...arguments);

		this.setScrollProgressPreview = this.setScrollProgressPreview.bind( this );
		this.changeState = this.changeState.bind( this );
		this.addItem = this.addItem.bind( this );

		this.timelineRef = createRef();
		this.resizeObserver = null;

		this.state = {
			isLockedPaddings: false
		};
	}

	changeState(param, value) {
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
	}

	getColor() {
		const { getSettings } = this.props;
		const { fillColor, customFillColor } = this.props.attributes;

		if ( fillColor ) {
			const editorColors = get( getSettings(), [ 'colors' ], [] );
			return getColorObjectByAttributeValues( editorColors, fillColor ).color;

		} else if ( customFillColor ) {
			return customFillColor;
		}
	}

	render() {
		const { changeState } = this;
		const { isLockedPaddings } = this.state;
		const { className, baseClass } = this.props;

		const color = this.getColor();
		const lineStyle = {
			style: {
				backgroundColor: color ? color : undefined,
				height: this.props.attributes.filling === 'true' ? '50%' : undefined
			}
		}

		return (
			<Fragment>
				<Inspector
					{ ...{
						...this.props,
						isLockedPaddings,
						changeState
					} }
				/>
				<div
					ref={ this.timelineRef }
					className={ className }
				>
					<div className={`${baseClass}__line`}>
						<div className={`${baseClass}__bar`} {...lineStyle}></div>
					</div>
					<Provider value={this}>
						<InnerBlocks
							templateInsertUpdatesSelection={false}
							allowedBlocks={ALLOWED_BLOCKS}
							template={[
								[ 'getwid/content-timeline-item' ]
							]}
							templateLock={false}

							renderAppender={ () => (
								<div className={ `${baseClass}__add-item` }>
									<Button
										icon='insert'
										onClick={ this.addItem }
										label={ __( 'Add Item', 'getwid' ) }
									/>
								</div>
							) }
						/>
					</Provider>
				</div>
			</Fragment>
		);
	}

	addItem() {
		const { insertBlock, getBlock, clientId } = this.props;

		let innerBlocks;
		const block = getBlock( clientId );
		if ( block ) {
			const insertedBlock = createBlock( 'getwid/content-timeline-item' );

			innerBlocks = block.innerBlocks;
			insertBlock( insertedBlock, innerBlocks.length, clientId );
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { clientId } = this.props;
		const { getBlock, updateBlockAttributes } = this.props;

		let innerBlocks;
		const block = getBlock( clientId );

		if ( block ) {
			innerBlocks = block.innerBlocks;
		}

		/* #region update inner blocks attributes */
		const { backgroundColor, customBackgroundColor } = this.props.attributes;
		const { paddingTop, paddingBottom, paddingLeft, paddingRight, animation } = this.props.attributes;
		const { horizontalSpace, marginBottom } = this.props.attributes;

		const pointColor = this.getColor();

		if ( ! isEqual( prevProps.attributes, this.props.attributes ) ) {
			if ( innerBlocks ) {
				if ( innerBlocks.length ) {
					innerBlocks.forEach( (item) => {
						updateBlockAttributes( item.clientId, {
							outerParent: {
								attributes: {
									backgroundColor,
									customBackgroundColor,

									paddingTop,
									paddingBottom,
									paddingLeft,
									paddingRight,

									horizontalSpace,
									marginBottom,

									pointColor,
									animation
								}
							}
						} );
					} );
				}
			}
		}
		/* #endregion */

		const { filling } = this.props.attributes;
		if ( prevProps.attributes.filling !== filling ) {
			if ( filling === 'true' ) {
				this.setScrollProgressPreview();
			} else {
				this.resetActivePoints();
			}
		}

		const { fillColor, customFillColor } = this.props.attributes;
		if ( prevProps.attributes.fillColor !== fillColor || prevProps.attributes.customFillColor !== customFillColor ) {
			const pointColor = this.getColor();
			this.setPointsColor( pointColor );
		}
	}

	setPointsColor( color ) {
		const block = this.timelineRef.current;
		const points = block.querySelectorAll( '.wp-block-getwid-content-timeline-item__point.is-active' );
		points.forEach( point => {
			point.querySelector('.wp-block-getwid-content-timeline-item__point-content').style.borderColor = color;
		} );
	}

	resetActivePoints() {
		const block = this.timelineRef.current;
		const points = block.querySelectorAll( '.wp-block-getwid-content-timeline-item__point.is-active' );
		points.forEach( point => {
			point.classList.remove( 'is-active' );
			point.querySelector('.wp-block-getwid-content-timeline-item__point-content').style.borderColor = '';
		} );
	}

	setScrollProgressPreview() {
		const block = this.timelineRef.current;

		if ( !block ) {
			return;
		}

		const items = block.querySelectorAll( '.wp-block-getwid-content-timeline-item__wrapper' );
		const points = block.querySelectorAll( '.wp-block-getwid-content-timeline-item__point' );
		const line = block.querySelector( '.wp-block-getwid-content-timeline__line');

		if ( points.length === 0 ) {
			return;
		}

		const lineTopPosition = items[0].offsetHeight / 2;
		const lineBottomPosition = items[items.length - 1].offsetHeight / 2;

		line.style.top = `${lineTopPosition}px`;
		line.style.bottom = `${lineBottomPosition}px`;

		if ( this.props.attributes.filling === 'false' ) {
			return;
		}

		const bar = line.querySelector( '.wp-block-getwid-content-timeline__bar');
		const { height, top } = bar.getBoundingClientRect();
		const maxDotOffset = top + height;
		const borderColor = this.getColor();

		points.forEach( point => {
			const pointRect = point.getBoundingClientRect();
			const pointContent = point.querySelector( '.wp-block-getwid-content-timeline-item__point-content' );

			point.classList.remove( 'is-active' );
			pointContent.style.borderColor = '';

			if ( pointRect.top <= maxDotOffset ) {
				point.classList.add( 'is-active' );
				pointContent.style.borderColor = borderColor ?? 'currentColor';
			}
		} );
	}

	componentDidMount() {
		this.setScrollProgressPreview();

		this.resizeObserver = new ResizeObserver( () => {
			setTimeout( () => this.setScrollProgressPreview(), 500 );
		} );

		this.resizeObserver.observe( this.timelineRef.current );
	}

	componentWillUnmount() {
		if ( this.resizeObserver ) {
			this.resizeObserver.disconnect();
		}
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
	withColors( 'fillColor', 'backgroundColor' )
] )( GetwidTimeline );

export { Consumer };
