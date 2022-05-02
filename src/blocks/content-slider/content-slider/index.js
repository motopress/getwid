/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import attributes from "./attributes";
import Edit from "./edit";
import Save from "./save";
import { checkDisableBlock } from 'GetwidUtils/help-functions';

/**
 * WordPress dependencies
 */
const { registerBlockType } = wp.blocks;

export default registerBlockType(
	'getwid/content-slider',
	{
		title: __( 'Content Slider', 'getwid' ),
		category: 'getwid-blocks',
		icon: <svg x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24">
				<path d="M0,0v6v2v16h24V8V6V0H0z M22,22H2V8h20V22z M2,6V2h20v4H2z"/>
				<rect x="3" y="3" width="2" height="2"/>
				<rect x="6" y="3" width="2" height="2"/>
				<rect x="9" y="3" width="2" height="2"/>
				<polygon points="14.71,20.71 20.41,15 14.71,9.29 13.29,10.71 17.59,15 13.29,19.29 "/>
				<polygon points="10.71,19.29 6.41,15 10.71,10.71 9.29,9.29 3.59,15 9.29,20.71 "/>
			</svg>,
		keywords: [ ],
		supports: {
			alignWide: true,
			align: [ 'wide', 'full' ],
			inserter: !Getwid.disabled_blocks.includes('getwid/content-slider')
		},
		attributes,
		...checkDisableBlock('getwid/content-slider', Edit),
		save: Save
	}
);
