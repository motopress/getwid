import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';

import { baseClass } from './utils';
import type { MediaTextSliderAttributes } from './types';

import './style.scss';

type SaveProps = {
	attributes: MediaTextSliderAttributes;
	className?: string;
};

export default function Save( { attributes, className }: SaveProps ) {
	const {
		contentAnimation,
		contentAnimationDuration,
		contentAnimationDelay,
		sliderAnimationEffect,
		sliderAutoplay,
		pauseOnHover,
		sliderAutoplaySpeed,
		sliderAnimationSpeed,
		sliderArrays,
		sliderArrows,
		sliderDots,
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: clsx( className, `${ baseClass }--current-slide-1`, {
			[ `has-arrows-${ sliderArrows }` ]: sliderArrows !== undefined,
			[ `has-dots-${ sliderDots }` ]: sliderDots !== undefined,
		} ),
		'data-labels': sliderArrays,
		'data-animation':
			contentAnimation !== undefined ? contentAnimation : '',
		'data-duration':
			contentAnimationDuration !== undefined
				? contentAnimationDuration
				: '1500ms',
		'data-delay':
			contentAnimationDelay !== undefined ? contentAnimationDelay : '0ms',
	} );

	return (
		<div { ...blockProps }>
			<div className={ `${ baseClass }__slides-wrapper` }>
				<div
					className={ `${ baseClass }__content` }
					data-slide-effect={ sliderAnimationEffect }
					data-slide-autoplay={ sliderAutoplay }
					data-slide-pause-on-hover={ pauseOnHover }
					data-slide-autoplay-speed={ sliderAutoplaySpeed }
					data-slide-speed={ sliderAnimationSpeed }
					data-infinite
				>
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
