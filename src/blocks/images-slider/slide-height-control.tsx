import {
	BaseControl,
	Button,
	CheckboxControl,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { StyleLengthControl } from 'getwid-components';

import type { ImagesSliderEditProps } from './types';

const tabs = [
	{
		name: 'desktop',
		title: __( 'Desktop', 'getwid' ),
		className: 'components-button is-link is-small',
	},
	{
		name: 'tablet',
		title: __( 'Tablet', 'getwid' ),
		className: 'components-button is-link is-small',
	},
	{
		name: 'mobile',
		title: __( 'Mobile', 'getwid' ),
		className: 'components-button is-link is-small',
	},
];

export default function SlideHeightControl( {
	attributes,
	setAttributes,
}: ImagesSliderEditProps ) {
	const { slideHeight, resetHeightOnTablet, resetHeightOnMobile } =
		attributes;

	return (
		<BaseControl className="getwid-slider-height-control">
			<BaseControl.VisualLabel>
				{ __( 'Slider Height', 'getwid' ) }
			</BaseControl.VisualLabel>
			<TabPanel
				className="getwid-editor-tabs"
				activeClass="is-active"
				tabs={ tabs }
			>
				{ ( tab ) => {
					if ( tab.name === 'desktop' ) {
						return (
							<StyleLengthControl
								value={ slideHeight }
								units={ [
									{ label: 'px', value: 'px' },
									{ label: 'vh', value: 'vh' },
								] }
								onChange={ ( nextSlideHeight ) => {
									if ( nextSlideHeight ) {
										setAttributes( {
											slideHeight: nextSlideHeight,
										} );
									} else {
										setAttributes( {
											slideHeight: nextSlideHeight,
											resetHeightOnTablet: false,
											resetHeightOnMobile: false,
										} );
									}
								} }
							/>
						);
					}

					if ( tab.name === 'tablet' ) {
						return (
							<CheckboxControl
								label={ __(
									'Reset height on tablet',
									'getwid'
								) }
								checked={ !! resetHeightOnTablet }
								disabled={ ! slideHeight }
								onChange={ ( value ) =>
									setAttributes( {
										resetHeightOnTablet: value,
									} )
								}
							/>
						);
					}

					return (
						<CheckboxControl
							label={ __( 'Reset height on mobile', 'getwid' ) }
							checked={ !! resetHeightOnMobile }
							disabled={ ! slideHeight }
							onChange={ ( value ) =>
								setAttributes( { resetHeightOnMobile: value } )
							}
						/>
					);
				} }
			</TabPanel>

			<Button
				variant="link"
				onClick={ () => setAttributes( { slideHeight: '' } ) }
				disabled={ ! slideHeight }
			>
				{ __( 'Reset', 'getwid' ) }
			</Button>
		</BaseControl>
	);
}
