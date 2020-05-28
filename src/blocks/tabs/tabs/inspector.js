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
		const {
			active,
			headerTag,
			type,
			equalHeight
		} = this.props.attributes;
		const { setAttributes, getState, changeState } = this.props;

		const { clientId, getBlock, updateBlockAttributes } = this.props;

		let innerBlocks;
		const selectedTab = getState('selectedTab');
		const currentBlock = getBlock( clientId );
		if ( currentBlock ) {
			innerBlocks = currentBlock.innerBlocks;
		}

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
						label={__( 'Tab Icon', 'getwid' )}
					>
						{innerBlocks.length && (
							<GetwidIconPicker
								value={innerBlocks[selectedTab].attributes.icon}
								onChange={val => {
									updateBlockAttributes( innerBlocks[selectedTab].clientId, {
										icon: val
									} );
									changeState('selectedTab', selectedTab);
								}}
							/>
						)}
					</BaseControl>
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
						options={times(currentBlock.innerBlocks.length, index => ({
							value: index,
							label: filteringTitles[ index ].length > 30 ? filteringTitles[index ].substr(0, 30) + '...' : filteringTitles[ index ]
						}))}
						onChange={val => {setAttributes({ active: val })}}
					/>
					<CheckboxControl
						label={__('Equal height', 'getwid')}
						checked={equalHeight}
						onChange={(equalHeight) => { setAttributes({ equalHeight }) }}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;