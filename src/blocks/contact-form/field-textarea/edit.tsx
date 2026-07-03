import { useBlockProps } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { FieldTextarea, type FieldEditProps } from 'getwid-components';

function getFieldLabel( props: FieldEditProps ) {
	return props.attributes.label === null
		? getBlockType( props.name )?.title || ''
		: props.attributes.label;
}

export function Edit( props: FieldEditProps ) {
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<FieldTextarea
				{ ...props.attributes }
				label={ getFieldLabel( props ) }
				setAttributes={ props.setAttributes }
				isSelected={ props.isSelected }
				className={ props.className }
			/>
		</div>
	);
}
