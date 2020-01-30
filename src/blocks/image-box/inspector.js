/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* Internal dependencies
*/
import GetwidCustomTabsControl from 'GetwidControls/custom-tabs-control';

import { renderMediaControl as GetwidMediaControl } from 'GetwidUtils/render-inspector';
import { renderMarginsPanel } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { InspectorControls, URLInput } = wp.blockEditor || wp.editor;

const { PanelBody, BaseControl, SelectControl, ToggleControl, TextControl, RadioControl } = wp.components;

/**
* Module Constants
*/
const NEW_TAB_REL = 'noreferrer noopener';

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);

		this.onSetNewTab  = this.onSetNewTab .bind( this );
		this.onSetLinkRel = this.onSetLinkRel.bind( this );
		this.changeTab    = this.changeTab   .bind( this );

		this.state = {
			tabName: 'general'
		};
	}

	changeTab(param, value) {
		this.setState({ [ param ]: value });
	}

	onSetNewTab( value ) {
		const { rel } = this.props.attributes;
		const linkTarget = value ? '_blank' : undefined;

		let updatedRel = rel;
		if ( linkTarget && ! rel ) {
			updatedRel = NEW_TAB_REL;
		} else if ( ! linkTarget && rel === NEW_TAB_REL ) {
			updatedRel = undefined;
		}

		this.props.setAttributes({
			linkTarget,
			rel: updatedRel,
		});
	}

	onSetLinkRel( value ) {
		this.props.setAttributes({ rel: value });
	}

	render() {

		const { id, url, imageSize, layout, imagePosition, link, linkTarget, rel } = this.props.attributes;
		const { setAttributes, changeImageSize, onSelectMedia, imgObj } = this.props;

		const { tabName } = this.state;
		const { changeTab } = this;

		const onChangeImageSize = imageSize => {

			if ( typeof imgObj != 'undefined' ) {
				setAttributes({
					imageSize
				});
				changeImageSize( imgObj, imageSize );
			}
		};

		return (
			<InspectorControls>
				<GetwidCustomTabsControl
					state={tabName}
					stateName='tabName'
					onChangeTab={changeTab}
					tabs = {[ 'general', 'style', 'advanced' ]}
				/>
				{tabName === 'general' && (
					<Fragment>
						<RadioControl
							label={__( 'Layout', 'getwid' )}
							selected={layout ? layout : ''}
							options={[
								{ value: ''     , label: __( 'Default'            , 'getwid' ) },
								{ value: 'left' , label: __( 'Align Image Left'   , 'getwid' ) },
								{ value: 'right', label: __( 'Align Image Right'  , 'getwid' ) }
							]}
							onChange={layout => setAttributes({ layout })}
						/>
						<GetwidMediaControl
							label={__( 'Image', 'getwid' )}
							removeButton={false}
							url={url}
							id={id}
							onSelectMedia={onSelectMedia}
							onRemoveMedia={() => setAttributes({
								url: undefined,
								id: undefined
							})}
						/>
						{imgObj && (
							<SelectControl
								label={__( 'Image Size', 'getwid' )}
								help={__( 'For images from Media Library only.', 'getwid' )}
								value={imageSize}
								onChange={onChangeImageSize}
								options={Getwid.settings.image_sizes}
							/>
						)}
					</Fragment>
				)}
				{tabName === 'style' && (
					<Fragment>
						{(layout == 'left' || layout == 'right') && (
							<SelectControl
								label={__( 'Image Vertical Alignment', 'getwid' )}
								value={imagePosition}
								options={[
									{ value: 'top'   , label: __( 'Top'   , 'getwid' ) },
									{ value: 'middle', label: __( 'Middle', 'getwid' ) },
									{ value: 'bottom', label: __( 'Bottom', 'getwid' ) }
								]}
								onChange={imagePosition => setAttributes({ imagePosition })}
							/>
						)}
						<PanelBody title={__( 'Margin', 'getwid' )} initialOpen={true}>
							{renderMarginsPanel( this )}
						</PanelBody>
					</Fragment>
				)}		

				{tabName === 'advanced' && (
					<Fragment>
						<BaseControl
							label={__( 'Image Link', 'getwid' )}
							className='getwid-editor-url-input'
						>
							<URLInput
								autoFocus={false}
								label={__( 'Image Link', 'getwid' )}
								value={link}
								onChange={link => setAttributes({ link })}
							/>
						</BaseControl>
						<BaseControl>
							<ToggleControl
								label={__( 'Open in New Tab', 'getwid' )}
								checked={linkTarget === '_blank'}
								onChange={this.onSetNewTab}
							/>
						</BaseControl>
						<TextControl
							label={__( 'Link Rel', 'getwid' )}
							value={rel || ''}
							onChange={this.onSetLinkRel}
						/>
					</Fragment>
				)}
			</InspectorControls>
		);
	}
}

export default Inspector;