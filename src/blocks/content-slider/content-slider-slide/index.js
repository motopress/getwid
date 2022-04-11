import { __ } from 'wp.i18n';
const { registerBlockType } = wp.blocks;
const { BlockControls, InnerBlocks } = wp.blockEditor || wp.editor;

export default registerBlockType(
	'getwid/content-slider-slide',
	{
		title: __( 'Content Slider Slide', 'getwid' ),
		category: 'getwid-blocks',
		parent: [ 'getwid/content-slider-slide' ],
		supports: {
			multiple: true,
			reusable: false,
			html: false
		},
		edit: props => (
			<div className={'slide'}>
				`block - {props.clientId}`
				{/*<InnerBlocks/>*/}
			</div>
		),
		save: props => (
			<div className={'slide'}>
				`block - {props.clientId}`
				{/*<InnerBlocks.Content/>*/}
			</div>
		)
	}
);
