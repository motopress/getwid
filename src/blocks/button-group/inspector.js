/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {Component, Fragment} = wp.element;
const {
	InspectorControls,
} = wp.editor;
const {
	PanelBody,
	SelectControl,
	TabPanel,
	RadioControl
} = wp.components;


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	render() {

		const {
			attributes: {
				spacing,

				alignment,
				alignmentTablet,
				alignmentMobile,

				direction,
				directionTablet,
				directionMobile,

				width,
				widthTablet,
				widthMobile,
			},
			setAttributes
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<SelectControl
						label={__('Horizontal space between buttons', 'getwid')}
						value={spacing !== undefined ? spacing : ''}
						onChange={spacing => setAttributes({spacing})}
						options={[
							{value: '', label: __('Default', 'getwid')},
							{value: 'small', label: __('Small', 'getwid')},
							{value: 'medium', label: __('Medium', 'getwid')},
							{value: 'normal', label: __('Normal', 'getwid')},
							{value: 'large', label: __('Large', 'getwid')},
							{value: 'none', label: __('None', 'getwid')},
						]}
					/>

					<TabPanel className="getwid-editor-tabs"
							  activeClass="is-active"
							  tabs={ [
								  {
									  name: 'desktop',
									  title: __('Desktop', 'getwid'),
									  className: 'components-button is-link is-small',
								  },
								  {
									  name: 'tablet',
									  title: __('Tablet', 'getwid'),
									  className: 'components-button is-link is-small',
								  },
								  {
									  name: 'mobile',
									  title: __('Mobile', 'getwid'),
									  className: 'components-button is-link is-small',
								  },
							  ] }>
						{
							(tab) => {
								switch (tab.name){
									case 'desktop': {
										return (
											<Fragment>
												<SelectControl
													label={__('Horizontal Alignment', 'getwid')}
													value={ alignment }
													onChange={alignment => setAttributes({alignment})}
													options={[
														{value: 'left', label: __('Left', 'getwid')},
														{value: 'center', label: __('Center', 'getwid')},
														{value: 'right', label: __('Right', 'getwid')},
													]}
												/>
												<SelectControl
													label={__('Direction', 'getwid')}
													value={ direction }
													onChange={direction => setAttributes({direction})}
													options={[
														{value: 'row', label: __('Horizontal', 'getwid')},
														{value: 'column', label: __('Vertical', 'getwid')},
													]}
												/>
												<SelectControl
													label={__('Button Width', 'getwid')}
													value={ width }
													onChange={width => setAttributes({width})}
													options={[
														{value: 'auto', label: __('Auto', 'getwid')},
														{value: '100', label: __('100%', 'getwid')},
														{value: '50', label: __('50%', 'getwid')},
														{value: '33', label: __('33%', 'getwid')},
														{value: '25', label: __('25%', 'getwid')},
														{value: '20', label: __('20%', 'getwid')},
													]}
												/>
											</Fragment>
										)
									}
									case 'tablet': {
										return(
											<Fragment>
												<SelectControl
													label={__('Horizontal Alignment', 'getwid')}
													value={ alignmentTablet }
													onChange={alignmentTablet => setAttributes({alignmentTablet})}
													options={[
														{value: '', label: __('Default', 'getwid')},
														{value: 'left', label: __('Left', 'getwid')},
														{value: 'center', label: __('Center', 'getwid')},
														{value: 'right', label: __('Right', 'getwid')},
													]}
												/>
												<SelectControl
													label={__('Direction', 'getwid')}
													value={ directionTablet }
													onChange={directionTablet => setAttributes({directionTablet})}
													options={[
														{value: '', label: __('Default', 'getwid')},
														{value: 'row', label: __('Horizontal', 'getwid')},
														{value: 'column', label: __('Vertical', 'getwid')},
													]}
												/>
												<SelectControl
													label={__('Button Width', 'getwid')}
													value={ widthTablet }
													onChange={widthTablet => setAttributes({widthTablet})}
													options={[
														{value: 'auto', label: __('Auto', 'getwid')},
														{value: '100', label: __('100%', 'getwid')},
														{value: '50', label: __('50%', 'getwid')},
														{value: '33', label: __('33%', 'getwid')},
														{value: '25', label: __('25%', 'getwid')},
														{value: '20', label: __('20%', 'getwid')},
													]}
												/>
											</Fragment>
										)
									}
									case 'mobile': {
										return(
											<Fragment>
												<SelectControl
													label={__('Horizontal Alignment', 'getwid')}
													value={ alignmentMobile }
													onChange={alignmentMobile => setAttributes({alignmentMobile})}
													options={[
														{value: '', label: __('Default', 'getwid')},
														{value: 'left', label: __('Left', 'getwid')},
														{value: 'center', label: __('Center', 'getwid')},
														{value: 'right', label: __('Right', 'getwid')},
													]}
												/>
												<SelectControl
													label={__('Direction', 'getwid')}
													value={ directionMobile }
													onChange={directionMobile => setAttributes({directionMobile})}
													options={[
														{value: '', label: __('Default', 'getwid')},
														{value: 'row', label: __('Horizontal', 'getwid')},
														{value: 'column', label: __('Vertical', 'getwid')},
													]}
												/>
												<SelectControl
													label={__('Button Width', 'getwid')}
													value={ widthMobile }
													onChange={widthMobile => setAttributes({widthMobile})}
													options={[
														{value: 'auto', label: __('Auto', 'getwid')},
														{value: '100', label: __('100%', 'getwid')},
														{value: '50', label: __('50%', 'getwid')},
														{value: '33', label: __('33%', 'getwid')},
														{value: '25', label: __('25%', 'getwid')},
														{value: '20', label: __('20%', 'getwid')},
													]}
												/>
											</Fragment>

										)
									}
								}
							}

						}
					</TabPanel>

				</PanelBody>
			</InspectorControls>
		);
	}

}