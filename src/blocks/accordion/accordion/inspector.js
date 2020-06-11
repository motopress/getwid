/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import {times} from 'lodash';


/**
* Internal dependencies
*/
import GetwidIconPicker from 'GetwidControls/icon-picker';
import { filtering } from 'GetwidUtils/help-functions';


/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.editor;
const { PanelBody, SelectControl, BaseControl, CheckboxControl } = wp.components;

const { jQuery: $ } = window;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const { iconPosition, iconOpen, iconClose, active, headerTag } = this.props.attributes;
		const { setAttributes } = this.props;

		const { clientId, getBlock } = this.props;
		const currentBlock = getBlock( clientId );

		if ( ! currentBlock ) {
			return (
				<InspectorControls></InspectorControls>
			);
		}

		let titles = [];
		$.each(currentBlock.innerBlocks, function (i, el) {
			let obj = {};
			obj.content = el.attributes.title;
			titles.push(obj);
		});

		const filteringTitles = filtering( titles );

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
						options={times(currentBlock.innerBlocks.length, index => ({
							value: index,
							label: filteringTitles[ index ].length > 30 ? filteringTitles[index ].substr(0, 30) + '...' : filteringTitles[ index ]
						}))}
						onChange={val => {setAttributes({ active:val })}}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;