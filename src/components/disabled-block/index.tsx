import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function MaybeBlockIsDisabled( blockName: string ) {
	const isDisabled =
		GetwidComponentsData.disabledBlocks.includes( blockName );

	if ( ! isDisabled ) {
		return undefined;
	}

	const DisabledBlockEdit = () => {
		const blockProps = useBlockProps();

		const message = sprintf(
			// translators: %1$s is a block name, %2$s is a link.
			__(
				'%1$s block is disabled in plugin settings. <a href="%2$s">Manage Blocks</a>',
				'getwid'
			),
			blockName,
			GetwidComponentsData.optionsUrl.blocks
		);

		return (
			<div { ...blockProps }>
				<p dangerouslySetInnerHTML={ { __html: message } } />
			</div>
		);
	};

	return DisabledBlockEdit;
}
