import { InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	RadioControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type {
	TableOfContentsEditProps,
	TableOfContentsListStyle,
} from './types';

export default function Inspector( {
	attributes: { allowedTags, listStyle },
	setAttributes,
}: TableOfContentsEditProps ) {
	return (
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'getwid' ) }>
				<BaseControl
					__nextHasNoMarginBottom
					label={ __( 'Headings', 'getwid' ) }
				>
					{ allowedTags.map( ( isAllowed, index ) => (
						<ToggleControl
							__nextHasNoMarginBottom
							key={ index }
							label={ `H${ index + 1 }` }
							checked={ isAllowed }
							onChange={ () =>
								setAttributes( {
									allowedTags: [
										...allowedTags.slice( 0, index ),
										! allowedTags[ index ],
										...allowedTags.slice( index + 1 ),
									],
								} )
							}
						/>
					) ) }
				</BaseControl>

				<RadioControl
					label={ __( 'List Style', 'getwid' ) }
					selected={ listStyle }
					options={ [
						{ value: 'default', label: __( 'Default', 'getwid' ) },
						{ value: 'none', label: __( 'None', 'getwid' ) },
						{
							value: 'unordered',
							label: __( 'Unordered', 'getwid' ),
						},
						{ value: 'ordered', label: __( 'Ordered', 'getwid' ) },
					] }
					onChange={ ( value ) =>
						setAttributes( {
							listStyle: value as TableOfContentsListStyle,
						} )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
