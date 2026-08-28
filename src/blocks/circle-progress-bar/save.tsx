import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

import type { CircleProgressBarAttributes } from './types';

const baseClass = 'wp-block-getwid-circle-progress-bar';

import './style.scss';

export default function Save( {
	attributes,
}: BlockSaveProps< CircleProgressBarAttributes > ) {
	const {
		fillAmount,
		isAnimated,
		wrapperAlign,
		size,
		thickness,
		backgroundColor,
		textColor,
		value,
	} = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<div
				className={ `${ baseClass }__wrapper` }
				data-background-color={ backgroundColor }
				data-text-color={ textColor }
				data-fill-amount={ fillAmount }
				data-is-animated={ isAnimated }
				data-size={ size }
				data-thickness={ thickness }
				data-value={ value }
				style={ {
					textAlign: wrapperAlign || undefined,
				} }
			>
				<canvas className={ `${ baseClass }__canvas` } />
			</div>
		</div>
	);
}
