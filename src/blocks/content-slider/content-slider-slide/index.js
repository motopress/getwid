import classnames from "classnames";

import Edit from './edit';

import { __ } from 'wp.i18n';
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.blockEditor || wp.editor;

export default registerBlockType(
	'getwid/content-slider-slide',
	{
		title: __( 'Slide', 'getwid' ),
		category: 'getwid-blocks',
		parent: [ 'getwid/content-slider' ],
		supports: {
			multiple: true,
			reusable: false,
			html: false
		},
		edit: Edit,
		save: props => (
			<div className={ props.className }>
				<div className="wp-block-getwid-content-slider-slide__wrapper">
					<InnerBlocks.Content/>
				</div>
			</div>
		)
	}
);
