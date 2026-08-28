import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { InstagramEditProps } from './types';

const defaults = {
	photoCount: 6,
	gridColumns: 3,
};

export default function Inspector( {
	attributes,
	setAttributes,
}: InstagramEditProps ) {
	const { photoCount, gridColumns, spacing } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
				<RangeControl
					label={ __( 'Number of items', 'getwid' ) }
					value={ photoCount }
					onChange={ ( nextPhotoCount = defaults.photoCount ) =>
						setAttributes( { photoCount: nextPhotoCount } )
					}
					allowReset
					min={ 1 }
					max={ 100 }
					step={ 1 }
				/>
				<RangeControl
					label={ __( 'Columns', 'getwid' ) }
					value={ gridColumns }
					onChange={ ( nextGridColumns = defaults.gridColumns ) =>
						setAttributes( { gridColumns: nextGridColumns } )
					}
					allowReset
					min={ 1 }
					max={ 6 }
					step={ 1 }
				/>
				<SelectControl
					label={ __( 'Spacing', 'getwid' ) }
					value={ spacing }
					onChange={ ( nextSpacing ) =>
						setAttributes( { spacing: nextSpacing } )
					}
					options={ [
						{ value: 'default', label: __( 'Default', 'getwid' ) },
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{ value: 'small', label: __( 'Small', 'getwid' ) },
						{ value: 'medium', label: __( 'Medium', 'getwid' ) },
						{ value: 'normal', label: __( 'Normal', 'getwid' ) },
						{ value: 'large', label: __( 'Large', 'getwid' ) },
					] }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
