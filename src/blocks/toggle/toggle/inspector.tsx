import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { BaseControl, PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { IconPicker } from 'getwid-components';

import type { ToggleEditProps, ToggleHeaderTag } from './types';

export default function Inspector( {
	attributes,
	setAttributes,
	clientId,
}: ToggleEditProps ) {
	const currentBlock = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);

	if ( ! currentBlock ) {
		return null;
	}

	const { iconPosition, iconOpen, iconClose, headerTag } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<BaseControl
					id={ `${ clientId }-icon-close` }
					label={ __( 'Icon', 'getwid' ) }
				>
					<IconPicker
						value={ iconClose }
						onChange={ ( value ) =>
							setAttributes( { iconClose: value } )
						}
					/>
				</BaseControl>
				<BaseControl
					id={ `${ clientId }-icon-open` }
					label={ __( 'Active Icon', 'getwid' ) }
				>
					<IconPicker
						value={ iconOpen }
						onChange={ ( value ) =>
							setAttributes( { iconOpen: value } )
						}
					/>
				</BaseControl>
				<SelectControl
					label={ __( 'Icon Position', 'getwid' ) }
					value={ iconPosition }
					options={ [
						{ value: 'left', label: __( 'Left', 'getwid' ) },
						{ value: 'right', label: __( 'Right', 'getwid' ) },
					] }
					onChange={ ( nextIconPosition ) =>
						setAttributes( {
							iconPosition:
								nextIconPosition as ToggleAttributesIconPosition,
						} )
					}
				/>
				<SelectControl
					label={ __( 'Title Tag', 'getwid' ) }
					value={ headerTag }
					options={ [
						{ value: 'span', label: __( 'Paragraph', 'getwid' ) },
						{ value: 'h2', label: __( 'Heading 2', 'getwid' ) },
						{ value: 'h3', label: __( 'Heading 3', 'getwid' ) },
						{ value: 'h4', label: __( 'Heading 4', 'getwid' ) },
						{ value: 'h5', label: __( 'Heading 5', 'getwid' ) },
						{ value: 'h6', label: __( 'Heading 6', 'getwid' ) },
					] }
					onChange={ ( nextHeaderTag ) =>
						setAttributes( {
							headerTag: nextHeaderTag as ToggleHeaderTag,
						} )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}

type ToggleAttributesIconPosition = 'left' | 'right';
