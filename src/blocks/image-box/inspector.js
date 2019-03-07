import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import {pick} from "lodash";

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

const {
	InspectorControls,
	URLInput,
} = wp.editor;

const {
	PanelBody,
	BaseControl,
	SelectControl,
	ToggleControl,
	Button
} = wp.components;

const ALLOWED_IMAGE_MEDIA_TYPES = ['image'];

/**
 * Create an Inspector Controls wrapper Component
 */
class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	hasMargin() {
		const {attributes: {marginTop, marginBottom, marginLeft, marginRight}} = this.props;
		return marginTop !== undefined ||
			marginBottom !== undefined ||
			marginRight !== undefined ||
			marginLeft !== undefined;
	}

	render() {
		const {
			attributes: {
				id,
				imageSize,
				layout,
				imagePosition,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				link,
				newWindow,
				hoverAnimation
			},
			setAttributes,
			changeImageSize,
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
					<SelectControl
						label={__('Image Size', 'getwid')}
						help={__('Self-hosted images only', 'getwid')}
						value={imageSize}
						onChange={onChangeImageSize}
						options={Getwid.settings.image_sizes}
					/>

					{(layout == 'left' || layout == 'right') &&
						<SelectControl
							label={__('Image Vertical Align', 'getwid')}
							value={imagePosition}
							options={[
								{value: 'top', label: __('Top', 'getwid')},
								{value: 'middle', label: __('Middle', 'getwid')},
								{value: 'bottom', label: __('Bottom', 'getwid')},
							]}
							onChange={imagePosition => setAttributes({imagePosition})}
						/>
					}

					<BaseControl
						label={__('Image Link', 'getwid')}
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
							checked={ newWindow }
							onChange={ () => {
								setAttributes( { newWindow: !newWindow } );
							}}
						/>
					</BaseControl>

					<GetwidAnimationSelectControl
						label={__('Image Hover Animation', 'getwid')}
						value={hoverAnimation !== undefined ? hoverAnimation : ''}
						onChange={hoverAnimation => setAttributes({hoverAnimation})}
						allowAnimation={['Seeker', 'Icon']}
					/>

					<PanelBody
						title={__('Spacing', 'getwid')}
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
						/>
						{
							this.hasMargin() &&
							<BaseControl>
								<Button isLink isDestructive onClick={resetMargin} >
									{__('Reset', 'getwid')}
								</Button>
							</BaseControl>
						}
					</PanelBody>
				</PanelBody>				

			</InspectorControls>
		);
	}
}

export default ( Inspector );