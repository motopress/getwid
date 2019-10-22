/**
 * Internal dependencies
 */
import Inspector from './inspector';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { ResizableBox } = wp.components;
const { Component, Fragment } = wp.element;
const { withSelect, withDispatch } = wp.data;
const { InnerBlocks } = wp.editor;

/**
* Create an Component
*/
class GetwidAdvancedColumn extends Component {
    constructor() {
        super(...arguments);
        
        this.state = {
            currentWidth: 0,
			nextWidth: 0
        }
    }
    
    render() {
        const { className, baseClass, adjacentBlockClientId, adjacentBlock, parentClientId, clientId, hasChildBlocks } = this.props;
        const { columnWidth } = this.props.attributes;

        //console.log( 'columnWidth: ' + columnWidth );

        const $block = $( `#block-${clientId}` );
        $block.css( 'flex-basis', `${columnWidth}%` );

        return (
            <Fragment>
                <Inspector { ...{
					...this.props
				} } key={ 'inspector' } />

                <div className={`${className}`}>
                    <ResizableBox
                        className={`${baseClass}__resize-container`}
                        enable={{
                            right: adjacentBlockClientId ? true : false
                        }}
                        handleWrapperClass={`${baseClass}__resize-container-handle`}
                        onResizeStart={ () => {
                            const { clientId } = this.props;

                            const $block = $( `#block-${clientId}` );
                            const $handle = $block.find( `.${baseClass}__resize-container-handle` ).find( '.components-resizable-box__handle' );

                            const handleTooltipLeft  = document.createElement( 'div' );
                            const handleTooltipRight = document.createElement( 'div' );

                            $( handleTooltipLeft ).addClass( 'resizable-tooltip resizable-tooltip-left' );
                            $( handleTooltipLeft ).text( `${parseFloat( columnWidth ).toFixed( 0 )}%` );
                            $handle.append( handleTooltipLeft );

                            $( handleTooltipRight ).addClass( 'resizable-tooltip resizable-tooltip-right' );
                            $( handleTooltipRight ).text( `${parseFloat( adjacentBlock.attributes.columnWidth ).toFixed( 0 )}%` );
                            $handle.append( handleTooltipRight );

                            this.setState( {
                                currentWidth: columnWidth,
                                nextWidth: adjacentBlock.attributes.columnWidth
                            } );

                            this.props.toggleSelection( false );
                        }}
                        onResize={ (event, direction, elt, delta) => {

                            const $section = $( `#block-${parentClientId}` );

                            const sectionWidth = $section.width();
                            const changedWidth = ( delta.width / sectionWidth ) * 100;

                            const { currentWidth, nextWidth } = this.state;
                            const width = parseFloat( currentWidth ) + changedWidth;
                            const nextColumnWidth = nextWidth - changedWidth;

                            const $column = $( `#block-${clientId}` );
                            const $handleTooltipLeft  = $column.find( '.resizable-tooltip-left'  );
                            const $handleTooltipRight = $column.find( '.resizable-tooltip-right' );

                            if ( 10 <= width && 10 <= nextColumnWidth ) {
                                $handleTooltipLeft .text( `${width.toFixed( 0 )}%` );
                                $handleTooltipRight.text( `${nextColumnWidth.toFixed( 0 )}%` );

                                const { setAttributes, updateBlockAttributes } = this.props;

                                setAttributes( { columnWidth: width.toFixed( 2 ) } );
                                updateBlockAttributes( adjacentBlockClientId, {
                                    columnWidth: nextColumnWidth.toFixed( 2 )
                                } );
                            }
                        }}
                        onResizeStop={ () => {
                            
                            const $column = $( `#block-${clientId}` );

                            const $handleTooltipLeft  = $column.find( '.resizable-tooltip-left'  );
                            const $handleTooltipRight = $column.find( '.resizable-tooltip-right' );

                            $handleTooltipLeft.remove();
                            $handleTooltipRight.remove();

                            this.props.toggleSelection( true );
                        } }
                    >
                        <div className={'wrapper'}>
                            <InnerBlocks
                                templateLock={false}
                                renderAppender={(
                                    hasChildBlocks ?
                                        undefined :
                                        () => <InnerBlocks.ButtonBlockAppender/>
                                )}
                            />
                        </div>
                    </ResizableBox>
                </div>
                
            </Fragment>
        );
    }
}

export default compose( [
	withSelect( ( select, props ) => {
		const { clientId } = props;
        const { getAdjacentBlockClientId, getBlock, getBlockRootClientId } = select( 'core/editor' );
        
        const adjacentBlockClientId = getAdjacentBlockClientId( clientId );
        const parentClientId        = getBlockRootClientId    ( clientId );

		const adjacentBlock = getBlock( adjacentBlockClientId );
        const parentBlock   = getBlock( parentClientId        );

        const hasChildBlocks = 0 < getBlock( clientId ).innerBlocks.length;
        
        return {
            adjacentBlockClientId,
            parentClientId,
            adjacentBlock,
            parentBlock
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const { updateBlockAttributes } = dispatch( 'core/editor' );
		return {
			updateBlockAttributes
		};
	} )
] )( GetwidAdvancedColumn );