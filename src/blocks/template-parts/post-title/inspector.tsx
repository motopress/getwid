import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { FontSizePicker } from 'getwid-components';

import type {
	TemplatePostTitleEditProps,
	TemplatePostTitleHeaderTag,
} from './types';

export default function Inspector( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
}: TemplatePostTitleEditProps ) {
	const { linkTo, headerTag, fontSize, customFontSize } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
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
				<SelectControl
					label={ __( 'Link to', 'getwid' ) }
					value={ linkTo }
					onChange={ ( nextLinkTo ) =>
						setAttributes( { linkTo: nextLinkTo } )
					}
					options={ [
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{ value: 'post', label: __( 'Post', 'getwid' ) },
					] }
				/>
				<SelectControl
					label={ __( 'Title Tag', 'getwid' ) }
					value={ headerTag }
					options={ [
						{ value: 'p', label: __( 'Paragraph', 'getwid' ) },
						{ value: 'h2', label: __( 'Heading 2', 'getwid' ) },
						{ value: 'h3', label: __( 'Heading 3', 'getwid' ) },
						{ value: 'h4', label: __( 'Heading 4', 'getwid' ) },
						{ value: 'h5', label: __( 'Heading 5', 'getwid' ) },
						{ value: 'h6', label: __( 'Heading 6', 'getwid' ) },
					] }
					onChange={ ( nextHeaderTag ) =>
						setAttributes( {
							headerTag:
								nextHeaderTag as TemplatePostTitleHeaderTag,
						} )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
