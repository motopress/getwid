/**
* External dependencies
*/
import { __ } from 'wp.i18n';


/**
* Internal dependencies
*/
import GetwidIconPicker from 'GetwidControls/icon-picker';
import { filtering } from 'GetwidUtils/help-functions';


/**
* Internal dependencies
*/
// import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
// import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';

// import { renderPaddingsPanel } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.editor;
const { PanelBody, SelectControl, BaseControl } = wp.components;

const { jQuery: $ } = window;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		// const { filling, animation } = this.props.attributes;
		// const { setBackgroundColor, setFillColor } = this.props;
		const { /* titles, items, */ iconPosition, iconOpen, iconClose, active, headerTag } = this.props.attributes;
		const { setAttributes } = this.props;

		// const filteringTitles = filtering( titles );




		const { /* backgroundColor, customBackgroundColor, fillColor, customFillColor, setAttributes, */ clientId, getBlock } = this.props;

		// const { horizontalSpace, marginBottom } = this.props.attributes;

		// let enableFilling;
		const currentBlock = getBlock( clientId );

		if ( ! currentBlock ) {
			return (
				<InspectorControls></InspectorControls>
			);
		}

		// enableFilling = currentBlock.innerBlocks.length > 1 ? true : false;

		return (
			<InspectorControls>
				<PanelBody
					title={__( 'Settings', 'getwid' )}
				>
					<BaseControl
						label={__( 'Icon', 'getwid' )}
					>
						<GetwidIconPicker
							value={iconClose}
							onChange={iconClose => setAttributes({ iconClose })}
						/>
					</BaseControl>
					<BaseControl
						label={__( 'Active Icon', 'getwid' )}
					>
						<GetwidIconPicker
							value={iconOpen}
							onChange={iconOpen => setAttributes({ iconOpen })}
						/>
					</BaseControl>

					<SelectControl
						label={__( 'Icon Position', 'getwid' )}
						value={iconPosition}
						options={[
							{ value: 'left' , label: __( 'Left' , 'getwid' ) },
							{ value: 'right', label: __( 'Right', 'getwid' ) }
						]}
						onChange={iconPosition => setAttributes({ iconPosition })}
					/>
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
						label={__( 'Active by default', 'getwid' )}
						value={active}
						options={[
							{ value: 0, label: __( '0', 'getwid' ) },
							{ value: 1, label: __( '1', 'getwid' ) },
							{ value: 2, label: __( '2', 'getwid' ) },
						]}
						onChange={val => {setAttributes({ active:val })}}
					/>
				</PanelBody>
			</InspectorControls>
		);

		// options={times(items.length, index => ({
		// 	value: index,
		// 	label: filteringTitles[ index ].length > 30 ? filteringTitles[index ].substr(0, 30) + '...' : filteringTitles[ index ]
		// }))}

	}
}

export default Inspector;