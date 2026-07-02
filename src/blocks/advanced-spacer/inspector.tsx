import { InspectorControls } from '@wordpress/block-editor';
import { CheckboxControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { StyleLengthControl } from 'getwid-components';

import type { AdvancedSpacerEditProps } from './types';

const heightUnits = [
	{ label: 'px', value: 'px' },
	{ label: 'vh', value: 'vh' },
	{ label: 'vw', value: 'vw' },
];

export default function Inspector( {
	attributes,
	setAttributes,
}: AdvancedSpacerEditProps ) {
	const { height, isHideDesktop, isHideTablet, isHideMobile } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<StyleLengthControl
					label={ __( 'Height', 'getwid' ) }
					value={ height }
					units={ heightUnits }
					onChange={ ( nextHeight ) => {
						if ( typeof nextHeight !== 'undefined' ) {
							setAttributes( { height: nextHeight } );
						}
					} }
				/>
				<CheckboxControl
					label={ __( 'Hide on Desktop', 'getwid' ) }
					checked={ isHideDesktop }
					onChange={ ( nextIsHideDesktop ) =>
						setAttributes( { isHideDesktop: nextIsHideDesktop } )
					}
				/>
				<CheckboxControl
					label={ __( 'Hide on Tablet', 'getwid' ) }
					checked={ isHideTablet }
					onChange={ ( nextIsHideTablet ) =>
						setAttributes( { isHideTablet: nextIsHideTablet } )
					}
				/>
				<CheckboxControl
					label={ __( 'Hide on Mobile', 'getwid' ) }
					checked={ isHideMobile }
					onChange={ ( nextIsHideMobile ) =>
						setAttributes( { isHideMobile: nextIsHideMobile } )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
