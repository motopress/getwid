import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save() {
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<div className="wp-block-getwid-content-slider-slide__wrapper">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
