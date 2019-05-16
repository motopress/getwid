/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	PanelBody,
	TextControl,
	BaseControl,
	ToggleControl
} = wp.components;

const {
	InspectorControls
} = wp.editor;

const { Component } = wp.element;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				to,
				subject
			},
			setAttributes

		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>
					<TextControl
						label={__('Email', 'getwid')}
						value={ to }
						onChange={to => {
							setAttributes({ to })
						}}
					/>
					<TextControl
						label={__('Subject', 'getwid')}
						value={ subject }
						onChange={subject => {
							setAttributes({ subject })
						}}
					/>
					{/* <BaseControl>
                        <ToggleControl
                            label={ __( 'Name', 'getwid' ) }
                            checked={ linkTarget === '_blank' }
                            onChange={ this.onSetNewTab }
                        />
                    </BaseControl> */}
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;