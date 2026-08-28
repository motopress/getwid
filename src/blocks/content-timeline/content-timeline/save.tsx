import {
	InnerBlocks,
	getColorClassName,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import { baseClass } from './constants';
import type { ContentTimelineAttributes } from './types';

import './style.scss';

export default function Save( {
	attributes,
}: BlockSaveProps< ContentTimelineAttributes > ) {
	const { animation, filling, fillColor, customFillColor } = attributes;
	const fillClass = getColorClassName( 'background-color', fillColor );
	const blockProps = useBlockProps.save( {
		className: clsx( {
			'is-animated': animation !== 'none',
		} ),
		'data-animation': animation,
		'data-filling': filling,
	} );
	const barProps = {
		className: clsx( `${ baseClass }__bar`, {
			'has-background': fillColor || customFillColor,
			[ fillClass || '' ]: fillClass,
		} ),
		style: {
			backgroundColor: fillColor ? undefined : customFillColor,
		},
	};

	return (
		<div { ...blockProps }>
			<div className={ `${ baseClass }__line` }>
				<div { ...barProps } />
			</div>
			<div className={ `${ baseClass }__wrapper` }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
