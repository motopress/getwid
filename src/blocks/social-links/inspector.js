import {times} from 'lodash';
import GetwidIconPicker from 'GetwidControls/icon-picker';
// Setup the block
const {__} = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;

const {
	InspectorControls,
	PanelColorSettings,
} = wp.editor;

const {
	PanelBody,
	SelectControl,
	RadioControl,
	BaseControl,
	TextControl
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	render() {

		const {
			attributes: {
				align,
				textAlign,
				icons,
				iconsColor,
				iconsSize,
				iconsSpacing,
			},
			setAttributes,
			changeState,
			getState,
			updateArrValues
		} = this.props;


		const renderIconSettings = ( index ) => {
			if (typeof icons[ index ] !== 'undefined') {
				return (
					<Fragment>

						<BaseControl
							label={__('Icon', 'getwid')}
						>
							<GetwidIconPicker
								value={icons[ index ].icon}
								onChange={ (value) => {
									updateArrValues( { icon: value }, index );
								}}
							/>
						</BaseControl>

						<TextControl
							label={__('Title', 'getwid')}
							value={ icons[ index ].title }
							onChange={ (value) => {
								updateArrValues( { title: value }, index );
							}}
						/>

						<PanelColorSettings
							title={__('Color', 'getwid')}
							colorSettings={[
								{
									value: icons[ index ].color,
									onChange: (value) => {
										updateArrValues( { color: value }, index );
									},
									label: __('Icon Color', 'getwid')
								}
							]}
						>
						</PanelColorSettings>

						<TextControl
							label={__('Link', 'getwid')}
							value={ icons[ index ].link }
							onChange={ (value) => {
								updateArrValues( { link: value }, index );
							} }
						/>

					</Fragment>
				);
			}

		};


		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					{ renderIconSettings(getState('selectedTab')) }

					<PanelColorSettings
						title={__('Icons Color', 'getwid')}
						colorSettings={[
							{
								value: iconsColor,
								onChange: (iconsColor) => {
									setAttributes({iconsColor});
								},
								label: __('Icon Color', 'getwid')
							}
						]}
					>
					</PanelColorSettings>

					<TextControl
						type="number"
						label={__('Icons Size', 'getwid')}
						value={ iconsSize }
						onChange={iconsSize => {
							iconsSize = parseInt(iconsSize);
							if (isNaN(iconsSize)) {
								iconsSize = undefined;
							}
							setAttributes({iconsSize})
						}}
						min={0}
						step={1}
						placeholder="16"
					/>

					<SelectControl
						label={__('Icons Spacing', 'getwid')}
						value={iconsSpacing}
						options={[
							{value: 'small', label: __('Small', 'getwid')},
							{value: 'medium', label: __('Medium', 'getwid')},
							{value: 'large', label: __('Large', 'getwid')},
							{value: 'big', label: __('Big', 'getwid')},
						]}
						onChange={iconsSpacing => setAttributes({iconsSpacing})}
					/>

				</PanelBody>
			</InspectorControls>
		);
	}

}