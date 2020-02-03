/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { times } from 'lodash';

/**
* External dependencies
*/
import { filtering } from 'GetwidUtils/help-functions';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, SelectControl } = wp.components;

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	render() {

		const { titles, items, type, active, headerTag } = this.props.attributes;
		const { setAttributes } = this.props;

		const filteringTitles = filtering( titles );

		return (
			<InspectorControls>
				<PanelBody
					title={__( 'Settings', 'getwid' )}
				>
					<SelectControl
						label={__( 'Title Tag', 'getwid' )}
						value={headerTag}
						options={[
							{ value: 'span', label: __( 'Paragraph', 'getwid' ) },
							{ value: 'h2'  , label: __( 'Heading 2', 'getwid' ) },
							{ value: 'h3'  , label: __( 'Heading 3', 'getwid' ) },
							{ value: 'h4'  , label: __( 'Heading 4', 'getwid' ) },
							{ value: 'h5'  , label: __( 'Heading 5', 'getwid' ) },
							{ value: 'h6'  , label: __( 'Heading 6', 'getwid' ) }
						]}
						onChange={headerTag => setAttributes({ headerTag })}
					/>
					<SelectControl
						label={__( 'Layout', 'getwid' )}
						value={type}
						options={[
							{ value: ''					, label: __( 'Horizontal Left'  , 'getwid' ) },
							{ value: 'horizontal-center', label: __( 'Horizontal Center', 'getwid' ) },
							{ value: 'horizontal-right' , label: __( 'Horizontal Right' , 'getwid' ) },
							{ value: 'vertical-left'	, label: __( 'Vertical Left'    , 'getwid' ) },
							{ value: 'vertical-right'	, label: __( 'Vertical Right'   , 'getwid' ) }
						]}
						onChange={type => setAttributes({ type })}
					/>
					<SelectControl
						label={__( 'Active by default', 'getwid' )}
						value={active}
						options={times(items.length, index => ({
							value: index,
							label: filteringTitles[ index ].length > 30 ? filteringTitles[ index ].substr( 0, 30 ) + '...' : filteringTitles[ index ]
						}))}
						onChange={active => setAttributes({ active })}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;