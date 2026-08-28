import type { BlockDeprecation } from '@wordpress/blocks';

import Save from './save';
import type { VideoPopupAttributes } from './types';

export const deprecated: BlockDeprecation< VideoPopupAttributes >[] = [
	{
		attributes: {
			titleColor: { type: 'string' },
			customTitleColor: { type: 'string' },
			iconColor: { type: 'string' },
			customIconColor: { type: 'string' },
			buttonColorHEX: { type: 'string' },
			buttonColor: { type: 'string' },
			customButtonColor: { type: 'string' },
			overlayColor: { type: 'string' },
			customOverlayColor: { type: 'string' },
			imageSize: { type: 'string', default: 'full' },
			id: { type: 'number' },
			url: {
				type: 'string',
				source: 'attribute',
				selector: '.wp-block-getwid-video-popup__source',
				attribute: 'src',
			},
			title: {
				type: 'string',
				source: 'html',
				selector: '.wp-block-getwid-video-popup__title',
			},
			text: { type: 'string' },
			link: { type: 'string' },
			align: { type: 'string' },
			minHeight: { type: 'string' },
			buttonMaxWidth: { type: 'string' },
			overlayOpacity: { type: 'number', default: 35 },
			imageAnimation: { type: 'string', default: 'none' },
			buttonStyle: { type: 'string', default: 'default' },
			buttonAnimation: { type: 'string', default: 'none' },
			buttonSize: { type: 'string', default: 'default' },
		},
		save: Save,
	},
];
