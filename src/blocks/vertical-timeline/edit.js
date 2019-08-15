/**
 * Internal dependencies
 */
import Inspector from './inspector';

import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import memize from 'memize';
import { isEqual, times } from 'lodash';

const { compose } = wp.compose;
const { withColors, InnerBlocks } = wp.editor;
const { Component, Fragment } = wp.element;
const { select, dispatch } = wp.data;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [ 'getwid/vertical-timeline-item' ];

const getPanesTemplate = memize( count => (
	times( count, () => [ 'getwid/vertical-timeline-item' ] )
) );

/**
* Create an Component
*/
class GetwidTimeline extends Component {

	constructor() {
		super(...arguments);

		this.updateLineHeight = this.updateLineHeight.bind( this );
	}

	updateLineHeight() {

		console.log( 'updateLineHeight' );

		const { clientId, baseClass } = this.props;

		const $block  = $( `#block-${clientId}` );
		const $points = $block.find( 'div[class$=__point-content]' );

		const $line = $block.find( `.${baseClass}__central-line` );
				
		const blocksCount = select( 'core/editor' ).getBlock( clientId ).innerBlocks;

		console.log( 'HERE' );

		let paddingBottom = 0;
		let count = 1;

		if ( blocksCount.length == 1 ) {
			const $wrapper = $block.find( 'div[class$=__wrapper]' );

			paddingBottom = parseFloat( $wrapper.parent().css( 'padding-bottom' ), 10 );
		} else count = 2

		const $appender = $block.find( '.block-list-appender' );
		
		const $timeLine = $block.find( `.${baseClass}` );
		
		$line.css( {
			'top'   : $( $points[ 0 ] ).position().top,
			'height': $timeLine.height() - $appender.height() - $( $points[ 0 ] ).position().top * count - paddingBottom - 32
		} );
	};

	render() {

		const { className, baseClass } = this.props;

		return (
			<Fragment>
				<Inspector {...this.props}/>
				<div className={`${className}`}>
					<div className={`${baseClass}__central-line`}></div>
					{/* <div className={`${baseClass}__hide-line`}></div> */}
					<InnerBlocks
						templateInsertUpdatesSelection={false}
						allowedBlocks={ALLOWED_BLOCKS}
						template={getPanesTemplate( this.props.attributes.itemsCount )}
					/>					
				</div>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		const { clientId, setAttributes } = this.props;
		const innerBlocks = select( 'core/editor' ).getBlock( clientId ).innerBlocks;

		console.log( 'componentDidUpdate' );

		if ( ! isEqual( prevProps.itemsCount, innerBlocks.length ) ) {
			//this.updateLineHeight();

			setAttributes( {
				itemsCount: innerBlocks.length
			} );
		}
	}

	componentDidMount() {
		this.waitLoad = setInterval( () => {
			const { clientId, baseClass } = this.props;

			const $block = $( `#block-${clientId}` );
			const $points = $block.find( 'div[class$=__point-content]' );

			if ( $points.length ) {				
				this.updateLineHeight();

				$( window ).resize( () => this.updateLineHeight() );
			}

			clearInterval( this.waitLoad );
		}, 1 );
	}
}

export default compose( [
	withColors( { textColor: 'color' } )
] )( GetwidTimeline );