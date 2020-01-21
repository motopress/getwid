/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* Internal dependencies
*/
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidStyleLengthControl     from 'GetwidControls/style-length-control';

import { renderMediaControl as GetwidMediaControl } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls, URLInput } = wp.blockEditor || wp.editor;

const { PanelBody, BaseControl, SelectControl, ToggleControl, TextControl, Button, RadioControl } = wp.components;

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

		this.onSetNewTab = this.onSetNewTab.bind( this );
		this.onSetLinkRel = this.onSetLinkRel.bind( this );
	}

	hasMargin() {
		const {attributes: {marginTop, marginBottom, marginLeft, marginRight}} = this.props;
		return marginTop !== undefined ||
			marginBottom !== undefined ||
			marginRight !== undefined ||
			marginLeft !== undefined;
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

		this.props.setAttributes( {
			linkTarget,
			rel: updatedRel,
		} );
	}

	onSetLinkRel( value ) {
		this.props.setAttributes( { rel: value } );
	}

	render() {
		const {
			attributes: {
				id,
				url,
				imageSize,
				layout,
				imagePosition,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				link,
				hoverAnimation,
                mobileLayout,
                mobileAlignment,
				linkTarget,
				rel
			},
			setAttributes,
			changeImageSize,
			onSelectMedia,
			imgObj
		} = this.props;

		const onChangeImageSize = (imageSize) => {

			if (typeof imgObj != 'undefined'){
				setAttributes( {
					imageSize
				} );
				changeImageSize(imgObj, imageSize);
			}			
		};

		const resetMargin = () => {
			setAttributes({
				marginTop: undefined,
				marginBottom: undefined,
				marginLeft: undefined,
				marginRight: undefined
			})
		};

		return (
			<InspectorControls>

				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<RadioControl
						label={__('Layout', 'getwid')}
						selected={ layout ? layout : '' }
						options={ [
							{value: '', label: __('Default', 'getwid')},
							{value: 'left', label: __('Left', 'getwid')},
							{value: 'right', label: __('Right', 'getwid')},
						] }
						onChange={layout => setAttributes({layout}) }
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
							label={__('Image Size', 'getwid')}
							help={__('For images from Media Library only.', 'getwid')}
							value={imageSize}
							onChange={onChangeImageSize}
							options={Getwid.settings.image_sizes}
						/>
					)}

					{(layout == 'left' || layout == 'right') &&
						<SelectControl
							label={__('Image Vertical Alignment', 'getwid')}
							value={imagePosition}
							options={[
								{value: 'top', label: __('Top', 'getwid')},
								{value: 'middle', label: __('Middle', 'getwid')},
								{value: 'bottom', label: __('Bottom', 'getwid')},
							]}
							onChange={imagePosition => setAttributes({imagePosition})}
						/>
					}
					<GetwidAnimationSelectControl
						label={__('Image Hover Animation', 'getwid')}
						value={hoverAnimation !== undefined ? hoverAnimation : ''}
						onChange={hoverAnimation => setAttributes({hoverAnimation})}
						allowAnimation={['Seeker', 'Icon']}
					/>

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
                        label={__('Image alignment on mobile', 'getwid')}
                        value={mobileAlignment}
                        options={[
                            {value: 'default', label: __('Default', 'getwid')},
                            {value: 'left', label: __('Left', 'getwid')},
                            {value: 'center', label: __('Center', 'getwid')},
                            {value: 'right', label: __('Right', 'getwid')},
                        ]}
                        onChange={mobileAlignment => setAttributes({mobileAlignment})}
                    />
				</PanelBody>
				<PanelBody
					title={__('Image Link', 'getwid')}
					initialOpen={false}
				>
					<BaseControl
						label={__('Image Link', 'getwid')}
						className={'getwid-editor-url-input'}
					>
						<URLInput
							autoFocus={ false }
							label={__('Image Link', 'getwid')}
							value={ link }
							onChange={(link) => setAttributes({link})}
						/>
					</BaseControl>
					<BaseControl>
						<ToggleControl
							label={ __( 'Open in New Tab', 'getwid' ) }
							checked={ linkTarget === '_blank' }
							onChange={ this.onSetNewTab }
						/>
					</BaseControl>
					<TextControl
						label={ __( 'Link Rel', 'getwid' ) }
						value={ rel || '' }
						onChange={ this.onSetLinkRel }
					/>
				</PanelBody>
                <PanelBody
                    title={__('Margin', 'getwid')}
                    initialOpen={false}
                >
                    <GetwidStyleLengthControl
                        label={__('Margin Top', 'getwid')}
                        value={marginTop}
                        onChange={marginTop => {
                            setAttributes({marginTop});
                        }}
                        allowNegative
                        allowAuto
                    />
                    <GetwidStyleLengthControl
                        label={__('Margin Bottom', 'getwid')}
                        value={marginBottom}
                        onChange={marginBottom => {
                            setAttributes({marginBottom});
                        }}
                        allowNegative
                        allowAuto
                    />
                    <GetwidStyleLengthControl
                        label={__('Margin Left', 'getwid')}
                        value={marginLeft}
                        onChange={marginLeft => {
                            setAttributes({marginLeft});
                        }}
                        allowNegative
                        allowAuto
                    />
                    <GetwidStyleLengthControl
                        label={__('Margin Right', 'getwid')}
                        value={marginRight}
                        onChange={marginRight => {
                            setAttributes({marginRight});
                        }}
						allowNegative
						allowAuto
                    />
					<BaseControl>
						<Button isLink
							onClick={resetMargin}
							disabled={ !this.hasMargin() }>
							{__('Reset', 'getwid')}
						</Button>
					</BaseControl>
                </PanelBody>

			</InspectorControls>
		);
	}
}

export default ( Inspector );