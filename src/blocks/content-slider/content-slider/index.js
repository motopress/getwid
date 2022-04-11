import attributes from "./attributes";
import Edit from "./edit";
import Save from "./save";

import { checkDisableBlock } from 'GetwidUtils/help-functions';

import { __ } from 'wp.i18n';
const { registerBlockType } = wp.blocks;

export default registerBlockType(
	'getwid/content-slider',
	{
		title: __( 'Content Slider', 'getwid' ),
		category: 'getwid-blocks',
		icon: 'slides',
		keywords: [
			__( 'slider', 'getwid' ),
		],
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
