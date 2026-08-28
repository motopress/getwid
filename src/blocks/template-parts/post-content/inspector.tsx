import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { FontSizePicker } from 'getwid-components';

import type { TemplatePostContentEditProps } from './types';

function getExcerptLength() {
	return (
		(
			window as unknown as {
				Getwid?: {
					settings?: { excerpt_length?: number };
				};
			}
		 ).Getwid?.settings?.excerpt_length || 55
	);
}

export default function Inspector( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
}: TemplatePostContentEditProps ) {
	const { showContent, contentLength, fontSize, customFontSize } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<SelectControl
					label={ __( 'Display Content', 'getwid' ) }
					value={ showContent }
					onChange={ ( nextShowContent ) =>
						setAttributes( { showContent: nextShowContent } )
					}
					options={ [
						{ value: 'excerpt', label: __( 'Excerpt', 'getwid' ) },
						{
							value: 'content',
							label: __( 'Post Content', 'getwid' ),
						},
						{
							value: 'full',
							label: __( 'Full Content', 'getwid' ),
						},
					] }
				/>
				{ showContent === 'excerpt' && (
					<RangeControl
						label={ __( 'Number of words', 'getwid' ) }
						value={ contentLength }
						onChange={ ( nextContentLength ) =>
							setAttributes( {
								contentLength: nextContentLength || 5,
							} )
						}
						min={ 5 }
						max={ getExcerptLength() }
					/>
				) }
				<FontSizePicker
					fontSizeAttributeName="fontSize"
					fontSize={ { fontSize, customFontSize } }
					setAttributes={ setAttributes }
				/>
				<PanelColorSettings
					title={ __( 'Text Color', 'getwid' ) }
					colorSettings={ [
						{
							value: textColor.color,
							onChange: setTextColor,
							label: __( 'Text Color', 'getwid' ),
						},
					] }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
