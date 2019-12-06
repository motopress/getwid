/**
* External dependencies
*/
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidCustomTabsControl      from 'GetwidControls/custom-tabs-control';

import { renderMarginsPanel } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';

const {Component, Fragment} = wp.element;
const {
	InspectorControls,
	URLInput,
} = wp.editor;
const {
	BaseControl,
	SelectControl,
	ToggleControl,
	TextControl,
} = wp.components;

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

		this.onSetNewTab     = this.onSetNewTab    .bind( this );
		this.onSetLinkRel    = this.onSetLinkRel   .bind( this );
		this.changeTabState  = this.changeTabState .bind( this );

		this.state = {
			tabName: 'general'
		};
	}

	changeTabState(param, value) {
		this.setState( { [ param ]: value } );
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
				imageSize,
				layout,
				imagePosition,
				link,
				hoverAnimation,
                mobileLayout,
                mobileAlignment,
				linkTarget,
				rel
			},
			setAttributes,
			changeImageSize,
			imgObj

		} = this.props;

		const onChangeImageSize = imageSize => {
			if ( typeof imgObj != 'undefined' ){
				setAttributes( { imageSize } );
				changeImageSize( imgObj, imageSize );
			}
		};

		const { tabName } = this.state;
		const { changeTabState } = this;

		return (
			<InspectorControls>
				<GetwidCustomTabsControl
					state={tabName}
					stateName={'tabName'}
					onChangeTab={changeTabState}
					tabs={[ 'general', 'layout', 'advanced' ]}
				/>
				{ tabName === 'general' && (
					<Fragment>
						{ imgObj && (
							<SelectControl
								label={__( 'Image Size', 'getwid' )}
								help={__( 'For images from Media Library only.', 'getwid' )}
								value={imageSize}
								onChange={onChangeImageSize}
								options={Getwid.settings.image_sizes}
							/>
						) }

						{ layout == 'left' || layout == 'right' &&
							<SelectControl
								label={__( 'Image Vertical Alignment', 'getwid' )}
								value={imagePosition}
								options={[
									{ value: 'top'   , label: __( 'Top'   , 'getwid' ) },
									{ value: 'middle', label: __( 'Middle', 'getwid' ) },
									{ value: 'bottom', label: __( 'Bottom', 'getwid' ) }
								]}
								onChange={imagePosition => setAttributes( { imagePosition } )}
							/>
						}
						<GetwidAnimationSelectControl
							label={__( 'Image Hover Animation', 'getwid' )}
							value={hoverAnimation ? hoverAnimation : ''}
							onChange={hoverAnimation => setAttributes( { hoverAnimation } )}
							allowAnimation={[ 'Seeker', 'Icon' ]}
						/>
						<SelectControl
							label={__( 'Mobile Layout', 'getwid' )}
							value={mobileLayout}
							options={[
								{ value: 'default'       , label: __( 'Default'             , 'getwid' ) },
								{ value: 'column'        , label: __( 'Column'              , 'getwid' ) },
								{ value: 'column-reverse', label: __( 'Column Reverse Order', 'getwid' ) }
							]}
							onChange={mobileLayout => setAttributes({ mobileLayout })}
						/>

						<SelectControl
							label={__( 'Mobile Alignment', 'getwid' )}
							value={mobileAlignment}
							options={[
								{ value: 'default', label: __( 'Default', 'getwid') },
								{ value: 'left'   , label: __( 'Left'   , 'getwid') },
								{ value: 'center' , label: __( 'Center' , 'getwid') },
								{ value: 'right'  , label: __( 'Right'  , 'getwid') }
							]}
							onChange={mobileAlignment => setAttributes( { mobileAlignment } )}
						/>
					</Fragment>
				) }


				{ tabName === 'layout' && ( renderMarginsPanel( this ) ) }

				{ tabName === 'advanced' && (
					<Fragment>
						<BaseControl
							label={__( 'Image Link', 'getwid' )}
							className={'getwid-editor-url-input'}
						>
							<URLInput
								autoFocus={false}
								label={__( 'Image Link', 'getwid' )}
								value={link}
								onChange={ link => setAttributes( { link } )}
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
				) }
			</InspectorControls>
		);
	}
}

export default Inspector;