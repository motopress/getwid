/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* Internal dependencies
*/
import GetwidCustomTabsControl from 'GetwidControls/custom-tabs-control';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';

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

		const { id, url, imageSize, layout, imagePosition, link, linkTarget, rel, hoverAnimation, mobileLayout, mobileAlignment } = this.props.attributes;
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
						<PanelBody>
							<RadioControl
								label={__( 'Layout', 'getwid' )}
								selected={layout ? layout : ''}
								options={[
									{ value: ''     , label: __( 'Default', 'getwid' ) },
									{ value: 'left' , label: __( 'Align Image Left'   , 'getwid' ) },
									{ value: 'right', label: __( 'Align Image Right'  , 'getwid' ) }
								]}
								onChange={layout => setAttributes({ layout })}
							/>

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

							<SelectControl
								label={__('Mobile Layout', 'getwid')}
								value={mobileLayout}
								options={[
									{value: 'default', label: __('Default', 'getwid')},
									{value: 'column', label: __('Column', 'getwid')},
									{value: 'column-reverse', label: __('Column Reverse Order', 'getwid')},
								]}
								onChange={mobileLayout => setAttributes({mobileLayout})}
							/>

							<SelectControl
								label={__('Mobile Alignment', 'getwid')}
								value={mobileAlignment}
								options={[
									{value: 'default', label: __('Default', 'getwid')},
									{value: 'left', label: __('Left', 'getwid')},
									{value: 'center', label: __('Center', 'getwid')},
									{value: 'right', label: __('Right', 'getwid')},
								]}
								onChange={mobileAlignment => setAttributes({mobileAlignment})}
							/>

							<GetwidAnimationSelectControl
								label={__('Image Hover Animation', 'getwid')}
								value={hoverAnimation !== undefined ? hoverAnimation : ''}
								onChange={hoverAnimation => setAttributes({ hoverAnimation })}
								allowAnimation={['Seeker', 'Icon']}
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
						</PanelBody>
					</Fragment>
				)}
				{tabName === 'style' && (
					<Fragment>
						<PanelBody>
							{ renderMarginsPanel( this ) }
						</PanelBody>
					</Fragment>
				)}

				{tabName === 'advanced' && (
					<Fragment>
						<PanelBody>
							<BaseControl
								label={__( 'Image Link', 'getwid' )}
								className='getwid-editor-url-input'
							>
								<URLInput
									autoFocus={false}
									value={ link }
									onChange={(link) => setAttributes({ link })}
									__nextHasNoMarginBottom
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
						</PanelBody>
					</Fragment>
				)}

			</InspectorControls>
		);
	}
}

export default Inspector;