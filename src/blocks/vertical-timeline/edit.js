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
	}	

	render() {
		const { itemsCount } = this.props.attributes;
		const { className, baseClass } = this.props;

		return (
			<Fragment>
				<Inspector {...this.props}/>
					<div className={`${className}`}>
						<div className={`${baseClass}__line`}></div>
						<div className={`${baseClass}__hide-line`}></div>

						<InnerBlocks
							templateInsertUpdatesSelection={false}
							allowedBlocks={ALLOWED_BLOCKS}
							template={getPanesTemplate( itemsCount )}
							templateLock={ false }
						/>
					</div>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {

		const { clientId, setAttributes } = this.props;
		const innerBlocks = select( 'core/editor' ).getBlock( clientId ).innerBlocks;

		if ( ! isEqual( prevProps.itemsCount, innerBlocks.length ) ) {
			setAttributes( {
				itemsCount: innerBlocks.length
			} );
		}
	}

	componentDidMount() {
		/* */
	}
}

export default compose( [
	withColors( { textColor: 'color' } )
] )( GetwidTimeline );