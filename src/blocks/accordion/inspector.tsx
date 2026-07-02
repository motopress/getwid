import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { BaseControl, PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { filterTitles, IconPicker } from 'getwid-components';
import type { AccordionAttributes } from './types';
import type { BlockEditProps } from '@wordpress/blocks';

export default function AccordionInspector( {
	attributes,
	setAttributes,
	clientId,
}: BlockEditProps< AccordionAttributes > ) {
	const currentBlock = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);

	if ( ! currentBlock ) {
		return null;
	}

	const { iconPosition, iconOpen, iconClose, active, headerTag } = attributes;
	const titles = currentBlock.innerBlocks.map( ( block ) => ( {
		content: block.attributes.title as string | undefined,
	} ) );
	const filteredTitles = filterTitles( titles );

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
					options={ [
						{ value: 'left', label: __( 'Left', 'getwid' ) },
						{ value: 'right', label: __( 'Right', 'getwid' ) },
					] }
					value={ iconPosition }
					onChange={ ( nextIconPosition ) =>
						setAttributes( {
							iconPosition: nextIconPosition,
						} )
					}
				/>
				<SelectControl
					label={ __( 'Title Tag', 'getwid' ) }
					options={ [
						{ value: 'span', label: __( 'Paragraph', 'getwid' ) },
						{ value: 'h2', label: __( 'Heading 2', 'getwid' ) },
						{ value: 'h3', label: __( 'Heading 3', 'getwid' ) },
						{ value: 'h4', label: __( 'Heading 4', 'getwid' ) },
						{ value: 'h5', label: __( 'Heading 5', 'getwid' ) },
						{ value: 'h6', label: __( 'Heading 6', 'getwid' ) },
					] }
					value={ headerTag }
					onChange={ ( nextHeaderTag ) =>
						setAttributes( {
							headerTag: nextHeaderTag,
						} )
					}
				/>
				<BaseControl
					id={ `${ clientId }-active` }
					label={ __( 'Active by default', 'getwid' ) }
				>
					<SelectControl
						id={ `${ clientId }-active` }
						label=""
						options={ [
							{ value: 'none', label: __( 'None', 'getwid' ) },
							...currentBlock.innerBlocks.map(
								( _block, index ) => ( {
									value: String( index ),
									label:
										filteredTitles[ index ]?.length > 30
											? `${ filteredTitles[ index ].slice(
													0,
													30
											  ) }...`
											: filteredTitles[ index ] ||
											  String( index + 1 ),
								} )
							),
						] }
						value={ active ?? 'none' }
						onChange={ ( nextActive ) =>
							setAttributes( {
								active: nextActive,
							} )
						}
					/>
				</BaseControl>
			</PanelBody>
		</InspectorControls>
	);
}
