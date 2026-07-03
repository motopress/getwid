import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';

import type { MediaTextSliderAttributes } from './types';
import { baseClass } from './utils';

const deprecatedAttributes = {
	slideCount: {
		type: 'number',
		default: 3,
	},
	imageSize: {
		type: 'string',
		default: 'large',
	},
	align: {
		type: 'string',
	},
	contentMaxWidth: {
		type: 'number',
	},
	minHeight: {
		type: 'string',
	},
	verticalAlign: {
		type: 'string',
	},
	horizontalAlign: {
		type: 'string',
	},
	paddingTop: {
		type: 'string',
	},
	paddingBottom: {
		type: 'string',
	},
	paddingLeft: {
		type: 'string',
	},
	paddingRight: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	overlayColor: {
		type: 'string',
	},
	overlayOpacity: {
		type: 'number',
		default: '30',
	},
	contentAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider',
		attribute: 'data-animation',
		default: 'fadeIn',
	},
	contentAnimationDuration: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider',
		attribute: 'data-duration',
		default: '1500ms',
	},
	contentAnimationDelay: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider',
		attribute: 'data-delay',
		default: '0ms',
	},
	sliderAnimationEffect: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'data-slide-effect',
	},
	sliderAutoplay: {
		type: 'boolean',
		default: false,
	},
	pauseOnHover: {
		type: 'boolean',
		default: true,
	},
	sliderAutoplaySpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'data-slide-autoplay-speed',
		default: 5000,
	},
	sliderAnimationSpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'slide-speed',
		default: 1000,
	},
	sliderArrays: {
		type: 'string',
		default: '[{"text":"Slide 1"},{"text":"Slide 2"},{"text":"Slide 3"}]',
	},
};

function DeprecatedSave( {
	attributes,
	className,
}: {
	attributes: MediaTextSliderAttributes;
	className?: string;
} ) {
	const {
		contentAnimation,
		contentAnimationDuration,
		contentAnimationDelay,
		sliderAnimationEffect,
		sliderAutoplay,
		pauseOnHover,
		sliderAutoplaySpeed,
		sliderAnimationSpeed,
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: clsx( className, `${ baseClass }--current-slide-1` ),
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

const deprecated = [
	{
		attributes: deprecatedAttributes,
		migrate( attributes: MediaTextSliderAttributes ) {
			const labels = JSON.parse(
				attributes.sliderArrays.replace( /u0022/g, '"' )
			);

			return {
				...attributes,
				sliderArrays: JSON.stringify(
					Array.from(
						{ length: attributes.slideCount },
						( _item, index ) => `${ labels[ index ].text }`
					)
				),
			};
		},
		save: DeprecatedSave,
	},
];

export default deprecated;
