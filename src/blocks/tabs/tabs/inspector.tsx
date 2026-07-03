import { InspectorControls } from '@wordpress/block-editor';
import type { Block } from '@wordpress/blocks';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { TabsEditProps, TabsHeaderTag, TabsLayout } from './types';

type InspectorProps = TabsEditProps & {
	innerBlocks: Block[];
};

function stripHtmlTags( value: unknown ) {
	if ( value === null || value === undefined || value === '' ) {
		return '';
	}

	return String( value ).replace( /<[^>]*>/g, '' );
}

export default function Inspector( {
	attributes: { active, headerTag, type },
	setAttributes,
	innerBlocks,
}: InspectorProps ) {
	const titleOptions = innerBlocks.map( ( block, index ) => {
		const title = stripHtmlTags( block.attributes.title );

		return {
			value: String( index ),
			label:
				title.length > 30 ? `${ title.substring( 0, 30 ) }...` : title,
		};
	} );

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
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
					onChange={ ( value ) =>
						setAttributes( { headerTag: value as TabsHeaderTag } )
					}
				/>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Layout', 'getwid' ) }
					value={ type }
					options={ [
						{ value: '', label: __( 'Horizontal Left', 'getwid' ) },
						{
							value: 'horizontal-center',
							label: __( 'Horizontal Center', 'getwid' ),
						},
						{
							value: 'horizontal-right',
							label: __( 'Horizontal Right', 'getwid' ),
						},
						{
							value: 'vertical-left',
							label: __( 'Vertical Left', 'getwid' ),
						},
						{
							value: 'vertical-right',
							label: __( 'Vertical Right', 'getwid' ),
						},
					] }
					onChange={ ( value ) =>
						setAttributes( { type: value as TabsLayout } )
					}
				/>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Active by default', 'getwid' ) }
					value={ active ?? '0' }
					options={ titleOptions }
					onChange={ ( value ) => setAttributes( { active: value } ) }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
