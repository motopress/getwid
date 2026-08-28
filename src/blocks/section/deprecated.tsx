import type { BlockDeprecation } from '@wordpress/blocks';

import attributes from './attributes';
import attributesDeprecated from './attributes-deprecated';
import attributesDeprecated2 from './attributes-deprecated-2';
import Save from './save';
import type { SectionAttributes } from './types';

const deprecated: BlockDeprecation< SectionAttributes >[] = [
	{
		attributes: {
			...attributes,
			foregroundImage: {
				type: 'string',
			},
		},
		isEligible() {
			return true;
		},
		migrate( oldAttributes ) {
			const { foregroundImage } = oldAttributes as SectionAttributes & {
				foregroundImage?: string;
			};

			if ( ! foregroundImage ) {
				return oldAttributes;
			}

			return {
				...oldAttributes,
				foregroundImage: {
					id: undefined,
					alt: undefined,
					url: foregroundImage,
				},
			};
		},
		save: Save,
	},
	{
		attributes: {
			...attributesDeprecated,
			backgroundVideoType: {
				type: 'string',
				default: 'self',
			},
		} as BlockDeprecation< SectionAttributes >[ 'attributes' ],
		save: Save,
	},
	{
		attributes:
			attributesDeprecated2 as BlockDeprecation< SectionAttributes >[ 'attributes' ],
		save: Save,
	},
];

export default deprecated;
