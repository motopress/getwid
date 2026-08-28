import { useBlockProps } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { Field, type FieldEditProps } from 'getwid-components';

function getFieldLabel( props: FieldEditProps ) {
	const label =
		props.attributes.label === null
			? getBlockType( props.name )?.title || ''
			: props.attributes.label;

	return label === 'Email' ? `${ label } address` : label;
}

export function Edit( props: FieldEditProps ) {
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<Field
				{ ...props.attributes }
				label={ getFieldLabel( props ) }
				setAttributes={ props.setAttributes }
				isSelected={ props.isSelected }
				className={ props.className }
				type="email"
			/>
		</div>
	);
}
