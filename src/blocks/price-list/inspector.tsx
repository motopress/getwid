import { InspectorControls } from '@wordpress/block-editor';
import {
	CheckboxControl,
	PanelBody,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { CustomColorPalette, MediaControl } from 'getwid-components';

import { currencyPositionOptions, titleTagOptions } from './constants';
import type { MediaObject, PriceListEditProps } from './types';
import { getThumbnailUrl } from './utils';

export default function Inspector( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
}: PriceListEditProps ) {
	const { titleTag, dotted, currencyPosition, url, id, customTextColor } =
		attributes;

	function onSelectMedia( image: MediaObject ) {
		setAttributes( {
			id: image.id,
			url: getThumbnailUrl( image ),
		} );
	}

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
				<MediaControl< MediaObject >
					label={ __( 'Image', 'getwid' ) }
					url={ url }
					id={ id }
					onSelectMedia={ onSelectMedia }
					onRemoveMedia={ () =>
						setAttributes( {
							url: undefined,
							id: undefined,
						} )
					}
				/>
				<SelectControl
					label={ __( 'Title Tag', 'getwid' ) }
					value={ titleTag }
					options={ [
						{
							value: titleTagOptions[ 0 ],
							label: __( 'Paragraph', 'getwid' ),
						},
						{
							value: titleTagOptions[ 1 ],
							label: __( 'Heading 2', 'getwid' ),
						},
						{
							value: titleTagOptions[ 2 ],
							label: __( 'Heading 3', 'getwid' ),
						},
						{
							value: titleTagOptions[ 3 ],
							label: __( 'Heading 4', 'getwid' ),
						},
						{
							value: titleTagOptions[ 4 ],
							label: __( 'Heading 5', 'getwid' ),
						},
						{
							value: titleTagOptions[ 5 ],
							label: __( 'Heading 6', 'getwid' ),
						},
					] }
					onChange={ ( nextTitleTag ) =>
						setAttributes( {
							titleTag:
								nextTitleTag as PriceListEditProps[ 'attributes' ][ 'titleTag' ],
						} )
					}
				/>
				<SelectControl
					label={ __( 'Currency Position', 'getwid' ) }
					value={ currencyPosition }
					onChange={ ( nextCurrencyPosition ) =>
						setAttributes( {
							currencyPosition: nextCurrencyPosition,
						} )
					}
					options={ [
						{
							value: currencyPositionOptions[ 0 ],
							label: __( 'Before', 'getwid' ),
						},
						{
							value: currencyPositionOptions[ 1 ],
							label: __( 'Before with space', 'getwid' ),
						},
						{
							value: currencyPositionOptions[ 2 ],
							label: __( 'After', 'getwid' ),
						},
						{
							value: currencyPositionOptions[ 3 ],
							label: __( 'After with space', 'getwid' ),
						},
					] }
				/>
				<CheckboxControl
					label={ __( 'Divider', 'getwid' ) }
					checked={ dotted }
					onChange={ ( nextDotted ) =>
						setAttributes( { dotted: nextDotted } )
					}
				/>
				<CustomColorPalette
					colorSettings={ [
						{
							title: __( 'Colors', 'getwid' ),
							colors: {
								customColor: customTextColor,
								defaultColor: textColor,
							},
							changeColor: setTextColor,
						},
					] }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
