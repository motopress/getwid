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
	URLInput
} = wp.editor;

const {
	PanelBody,
	SelectControl,
	RadioControl,
	BaseControl,
	TextControl,
	ToggleControl
} = wp.components;

const NEW_TAB_REL = 'noreferrer noopener';

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {

		const {
			attributes: {
				align,
				textAlignment,
				icons,
				iconsColor,
				iconsBgColor,
				iconsStyle,
				iconsSize,
				iconsSpacing,
			},
			setAttributes,
			changeState,
			getState,
			updateArrValues
		} = this.props;

		const useSecondaryColor = iconsStyle === 'stacked' || iconsStyle === 'framed';

		const renderIconSettings = ( index ) => {
			if (typeof icons[ index ] !== 'undefined') {
				return (
					<Fragment>
						<PanelBody
							title={__('Current Icon', 'getwid')}
						>

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
									},
									...( useSecondaryColor && iconsStyle == 'stacked' ? [{
										value: icons[ index ].background,
										onChange: (value) => {
											updateArrValues( { background: value }, index );
										},
										label: __('Background Color', 'getwid')
									}] : [])
								]}
							>
							</PanelColorSettings>

							<BaseControl
								label={__('Link', 'getwid')}
								className={'getwid-editor-url-input'}
							>
								<URLInput
									autoFocus={ false }
									label={__('Link', 'getwid')}
									value={ icons[ index ].link }
									onChange={ (value) => {
										updateArrValues( { link: value }, index );
									} }
								/>
							</BaseControl>

							<ToggleControl
								label={ __( 'Open in New Tab', 'getwid' ) }
								checked={ icons[ index ].linkTarget === '_blank' }
								onChange={ (value) => {
									const rel  = icons[index].rel;
									const linkTarget = value ? '_blank' : undefined;
							
									let updatedRel = rel;
									if ( linkTarget && ! rel ) {
										updatedRel = NEW_TAB_REL;
									} else if ( ! linkTarget && rel === NEW_TAB_REL ) {
										updatedRel = undefined;
									}
																		
									updateArrValues( { linkTarget: linkTarget, rel: updatedRel }, index );
								}}
							/>

							<TextControl
								label={__('Link Rel', 'getwid')}
								value={ icons[ index ].rel || '' }
								onChange={ (value) => {
									updateArrValues( { rel: value }, index );
								} }
							/>
						</PanelBody>

					</Fragment>
				);
			}

		};

		return (
			<InspectorControls>
				
				{ renderIconSettings(getState('selectedIcon')) }				

				<PanelBody
					title={__('Icons', 'getwid')}
				>			
					<PanelColorSettings
						title={__('Icons Color', 'getwid')}
						colorSettings={[
							{
								value: iconsColor,
								onChange: (iconsColor) => {
									setAttributes({iconsColor});
								},
								label: __('Icon Color', 'getwid')
							},
							...( useSecondaryColor && iconsStyle == 'stacked' ? [{
								value: iconsBgColor,
								onChange: (iconsBgColor) => {
									setAttributes({iconsBgColor});
								},
								label: __('Background Color', 'getwid')
							}] : [])
						]}
					>
					</PanelColorSettings>

					<RadioControl
					    label={__('Layout', 'getwid')}
					    selected={ iconsStyle !== undefined ? iconsStyle : 'default' }
					    options={ [
							{value: 'default', label: __('Icon', 'getwid')},
							{value: 'stacked', label: __('Background', 'getwid')},
							{value: 'framed', label: __('Outline', 'getwid')},
					    ] }
					    onChange={iconsStyle => setAttributes({iconsStyle}) }
					/>

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
						placeholder="36"
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