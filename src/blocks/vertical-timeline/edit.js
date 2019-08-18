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
const { PanelBody } = wp.components;
const { InspectorControls, PanelColorSettings, withColors, InnerBlocks, getColorClassName } = wp.editor;
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
		const { itemsCount, customBackgroundColor } = this.props.attributes;
		const { className, baseClass } = this.props;

		const { textColor, backgroundColor } = this.props;
		const { setTextColor, setBackgroundColor } = this.props;	

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
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={ true }>
						<PanelColorSettings
							title={ __( 'Colors', 'getwid' ) }
							colorSettings={ [
								{
									value: textColor.color,
									onChange: setTextColor,
									label: __( 'Card Text Color', 'getwid' )
								},
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __( 'Card Background Color', 'getwid' )
								}
							] }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {

		const { clientId, setAttributes } = this.props;

		const { getBlock } = select( 'core/editor' );
		const { updateBlockAttributes } = dispatch( 'core/editor' );

		const innerBlocks = getBlock( clientId ).innerBlocks;

		if ( ! isEqual( prevProps.itemsCount, innerBlocks.length ) ) {
			setAttributes( {
				itemsCount: innerBlocks.length
			} );
		}

		const { textColor, customTextColor } = this.props.attributes;
		const { backgroundColor, customBackgroundColor } = this.props.attributes;

		if ( innerBlocks.length ) {
			$.each( innerBlocks, (index, item) => {
				const firstColor = textColor ?
					{ textColor, customTextColor: undefined } :
					{ customTextColor, textColor: undefined };

				updateBlockAttributes( item.clientId, firstColor );

				const secondColor = backgroundColor ?
				{ backgroundColor, customBackgroundColor: undefined } :
				{ customBackgroundColor, backgroundColor: undefined };

				updateBlockAttributes( item.clientId, secondColor );
			} );
		}
	}

	componentDidMount() {
		/* */
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } )
] )( GetwidTimeline );