import {
	InnerBlocks,
	getColorClassName,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import classnames from 'classnames';

import { baseClass } from './constants';
import type { ContentTimelineAttributes } from './types';

import './style.scss';

export default function Save( {
	attributes,
}: BlockSaveProps< ContentTimelineAttributes > ) {
	const { animation, filling, fillColor, customFillColor } = attributes;
	const fillClass = getColorClassName( 'background-color', fillColor );
	const blockProps = useBlockProps.save( {
		className: classnames( {
			'is-animated': animation !== 'none',
		} ),
		'data-animation': animation,
		'data-filling': filling,
	} );
	const barProps = {
		className: classnames( `${ baseClass }__bar`, {
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
